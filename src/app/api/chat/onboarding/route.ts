import { NextRequest } from "next/server";
import { z } from "zod";
import { OnboardingState } from "@/types/onboarding";
import { ONBOARDING_SYSTEM_PROMPT } from "@/prompts/onboarding-rh";
import { runCompletionPipeline } from "@/lib/chatPipeline";

// ============================================================
// Zod validation schema
// ============================================================

const chatRequestSchema = z.object({
  session_id: z.string().min(1, "session_id est requis"),
  message: z
    .string()
    .min(1, "Le message ne peut pas être vide")
    .max(2000, "Le message ne doit pas dépasser 2000 caractères"),
  conversation_history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string(),
      })
    )
    .optional()
    .default([]),
  current_state: z.any().optional().default(null),
});

// ============================================================
// Rate limiting (in-memory)
// ============================================================

// Per-session message counter
const sessionMessageCounts = new Map<
  string,
  { count: number; lastReset: number }
>();

// Per-IP new session tracker
const ipSessionTracker = new Map<
  string,
  { sessions: Set<string>; resetAt: number }
>();

const MAX_MESSAGES_PER_SESSION = 60;
const MAX_NEW_SESSIONS_PER_IP = 3;
const SESSION_WINDOW_MS = 60 * 60 * 1000; // 1 hour

function checkChatRateLimit(
  ip: string,
  sessionId: string
): { allowed: boolean; reason?: string } {
  const now = Date.now();

  // --- Per-session message limit ---
  const sessionEntry = sessionMessageCounts.get(sessionId);
  if (sessionEntry) {
    if (sessionEntry.count >= MAX_MESSAGES_PER_SESSION) {
      return {
        allowed: false,
        reason: "Limite de messages atteinte pour cette session.",
      };
    }
    sessionEntry.count++;
  } else {
    sessionMessageCounts.set(sessionId, { count: 1, lastReset: now });
  }

  // --- Per-IP new session limit ---
  let ipEntry = ipSessionTracker.get(ip);
  if (!ipEntry || now > ipEntry.resetAt) {
    ipEntry = { sessions: new Set(), resetAt: now + SESSION_WINDOW_MS };
    ipSessionTracker.set(ip, ipEntry);
  }

  // If this is a new session for this IP
  if (!ipEntry.sessions.has(sessionId)) {
    if (ipEntry.sessions.size >= MAX_NEW_SESSIONS_PER_IP) {
      // Undo the session message count increment since we're rejecting
      const entry = sessionMessageCounts.get(sessionId);
      if (entry && entry.count === 1) {
        sessionMessageCounts.delete(sessionId);
      }
      return {
        allowed: false,
        reason:
          "Trop de nouvelles sessions. Réessayez dans une heure.",
      };
    }
    ipEntry.sessions.add(sessionId);
  }

  return { allowed: true };
}

// ============================================================
// SSE helpers
// ============================================================

function sseEncode(data: Record<string, unknown>): string {
  return `data: ${JSON.stringify(data)}\n\n`;
}

// ============================================================
// Parse Claude's structured response
// ============================================================

function parseClaudeResponse(fullText: string): {
  message: string;
  stateUpdate: OnboardingState | null;
  quickReplies: string[] | null;
  onboardingComplete: boolean;
} {
  let message = "";
  let stateUpdate: OnboardingState | null = null;
  let quickReplies: string[] | null = null;
  let onboardingComplete = false;

  // Extract [MESSAGE]...[/MESSAGE]
  const messageMatch = fullText.match(
    /\[MESSAGE\]([\s\S]*?)\[\/MESSAGE\]/
  );
  if (messageMatch) {
    message = messageMatch[1].trim();
  } else {
    // Fallback: if no markers, use everything before any marker as message
    const firstMarker = fullText.search(
      /\[(STATE_UPDATE|QUICK_REPLIES|ONBOARDING_COMPLETE)\]/
    );
    message =
      firstMarker >= 0
        ? fullText.substring(0, firstMarker).trim()
        : fullText.trim();
  }

  // Check for [ONBOARDING_COMPLETE]
  if (fullText.includes("[ONBOARDING_COMPLETE]")) {
    onboardingComplete = true;
    // Remove the marker from the message
    message = message.replace(/\[ONBOARDING_COMPLETE\]/g, "").trim();
  }

  // Extract [STATE_UPDATE]...[/STATE_UPDATE]
  const stateMatch = fullText.match(
    /\[STATE_UPDATE\]([\s\S]*?)\[\/STATE_UPDATE\]/
  );
  if (stateMatch) {
    try {
      stateUpdate = JSON.parse(stateMatch[1].trim());
    } catch (e) {
      console.error(
        "[ChatRoute] Failed to parse STATE_UPDATE JSON:",
        e
      );
    }
  }

  // Extract [QUICK_REPLIES]...[/QUICK_REPLIES]
  const quickMatch = fullText.match(
    /\[QUICK_REPLIES\]([\s\S]*?)\[\/QUICK_REPLIES\]/
  );
  if (quickMatch) {
    try {
      quickReplies = JSON.parse(quickMatch[1].trim());
    } catch (e) {
      console.error(
        "[ChatRoute] Failed to parse QUICK_REPLIES JSON:",
        e
      );
    }
  }

  return { message, stateUpdate, quickReplies, onboardingComplete };
}

// ============================================================
// Build messages array for Claude API
// ============================================================

function buildMessages(
  conversationHistory: Array<{ role: "user" | "assistant"; content: string }>,
  userMessage: string,
  currentState: OnboardingState | null
): Array<{ role: "user" | "assistant"; content: string }> {
  const messages: Array<{ role: "user" | "assistant"; content: string }> = [];

  // Include conversation history
  if (conversationHistory.length > 0) {
    messages.push(...conversationHistory);
  }

  // Build the current user message with state context
  let content = userMessage;
  if (currentState) {
    content = `[ÉTAT ACTUEL DU FORMULAIRE]\n${JSON.stringify(currentState, null, 2)}\n[/ÉTAT ACTUEL]\n\n${userMessage}`;
  }

  messages.push({ role: "user", content });

  return messages;
}

// ============================================================
// POST handler
// ============================================================

export async function POST(request: NextRequest) {
  // --- Extract IP ---
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  // --- Parse body ---
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response(
      JSON.stringify({ error: "Corps de requête invalide." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  // --- Validate ---
  const parsed = chatRequestSchema.safeParse(body);
  if (!parsed.success) {
    const errors = parsed.error.issues.map((i) => i.message).join(", ");
    return new Response(
      JSON.stringify({ error: `Données invalides : ${errors}` }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const { session_id, message, conversation_history, current_state } =
    parsed.data;

  // --- Rate limit ---
  const rateCheck = checkChatRateLimit(ip, session_id);
  if (!rateCheck.allowed) {
    return new Response(
      JSON.stringify({ error: rateCheck.reason }),
      { status: 429, headers: { "Content-Type": "application/json" } }
    );
  }

  // --- Anthropic API key ---
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error("[ChatRoute] ANTHROPIC_API_KEY not configured.");
    return new Response(
      JSON.stringify({ error: "Service de chat non configuré." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  // --- Build messages ---
  const messages = buildMessages(
    conversation_history,
    message,
    current_state as OnboardingState | null
  );

  // --- Call Claude API with streaming ---
  let claudeResponse: Response;
  try {
    claudeResponse = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-5-20250929",
        max_tokens: 1024,
        stream: true,
        system: ONBOARDING_SYSTEM_PROMPT,
        messages,
      }),
    });
  } catch (e) {
    console.error("[ChatRoute] Failed to call Claude API:", e);
    return new Response(
      JSON.stringify({ error: "Erreur de connexion au service IA." }),
      { status: 502, headers: { "Content-Type": "application/json" } }
    );
  }

  if (!claudeResponse.ok) {
    const errText = await claudeResponse.text();
    console.error(
      `[ChatRoute] Claude API error ${claudeResponse.status}:`,
      errText
    );
    return new Response(
      JSON.stringify({
        error: "Le service IA a rencontré une erreur.",
      }),
      { status: 502, headers: { "Content-Type": "application/json" } }
    );
  }

  // --- Stream response via SSE ---
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const stream = new ReadableStream({
    async start(controller) {
      const reader = claudeResponse.body?.getReader();
      if (!reader) {
        controller.enqueue(
          encoder.encode(
            sseEncode({ type: "error", content: "Pas de réponse du service IA." })
          )
        );
        controller.enqueue(encoder.encode(sseEncode({ type: "done" })));
        controller.close();
        return;
      }

      let fullText = "";
      let buffer = "";

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          // Process complete SSE lines from Claude's stream
          const lines = buffer.split("\n");
          // Keep the last potentially incomplete line in buffer
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6).trim();

              if (data === "[DONE]") continue;

              try {
                const event = JSON.parse(data);

                if (
                  event.type === "content_block_delta" &&
                  event.delta?.type === "text_delta" &&
                  event.delta?.text
                ) {
                  const chunk = event.delta.text;
                  fullText += chunk;

                  // Stream chunk to client for perceived speed
                  controller.enqueue(
                    encoder.encode(
                      sseEncode({
                        type: "message_chunk",
                        content: chunk,
                      })
                    )
                  );
                }

                // Handle errors from Claude stream
                if (event.type === "error") {
                  console.error("[ChatRoute] Claude stream error:", event.error);
                  controller.enqueue(
                    encoder.encode(
                      sseEncode({
                        type: "error",
                        content: "Erreur du service IA.",
                      })
                    )
                  );
                }
              } catch {
                // Skip non-JSON lines (event: lines, etc.)
              }
            }
          }
        }

        // Process any remaining buffer
        if (buffer.trim()) {
          if (buffer.startsWith("data: ")) {
            const data = buffer.slice(6).trim();
            if (data !== "[DONE]") {
              try {
                const event = JSON.parse(data);
                if (
                  event.type === "content_block_delta" &&
                  event.delta?.type === "text_delta" &&
                  event.delta?.text
                ) {
                  fullText += event.delta.text;
                  controller.enqueue(
                    encoder.encode(
                      sseEncode({
                        type: "message_chunk",
                        content: event.delta.text,
                      })
                    )
                  );
                }
              } catch {
                // Ignore
              }
            }
          }
        }

        // --- Full response accumulated, now parse structured data ---
        const parsed = parseClaudeResponse(fullText);

        // Send state update if present
        if (parsed.stateUpdate) {
          controller.enqueue(
            encoder.encode(
              sseEncode({
                type: "state_update",
                state: parsed.stateUpdate,
              })
            )
          );
        }

        // Send quick replies if present
        if (parsed.quickReplies && parsed.quickReplies.length > 0) {
          controller.enqueue(
            encoder.encode(
              sseEncode({
                type: "quick_replies",
                options: parsed.quickReplies,
              })
            )
          );
        }

        // Handle onboarding completion
        if (parsed.onboardingComplete && parsed.stateUpdate) {
          controller.enqueue(
            encoder.encode(
              sseEncode({
                type: "onboarding_complete",
                data: parsed.stateUpdate,
              })
            )
          );

          // Trigger completion pipeline (non-blocking)
          const totalMessages =
            conversation_history.length + 2; // +2 for this user message and assistant response
          runCompletionPipeline(
            session_id,
            parsed.stateUpdate,
            totalMessages
          ).catch((err) => {
            console.error(
              "[ChatRoute] Completion pipeline failed:",
              err
            );
          });
        }

        // Send done event
        controller.enqueue(
          encoder.encode(sseEncode({ type: "done" }))
        );
      } catch (err) {
        console.error("[ChatRoute] Stream processing error:", err);
        controller.enqueue(
          encoder.encode(
            sseEncode({
              type: "error",
              content: "Erreur lors du traitement de la réponse.",
            })
          )
        );
        controller.enqueue(
          encoder.encode(sseEncode({ type: "done" }))
        );
      } finally {
        reader.releaseLock();
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
