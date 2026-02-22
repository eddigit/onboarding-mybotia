"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  ChatMessage,
  OnboardingState,
  WELCOME_MESSAGE,
  initialOnboardingState,
} from "@/types/onboarding";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import ChatContainer from "@/components/chat/ChatContainer";
import ChatInput from "@/components/chat/ChatInput";
import SidebarRecap from "@/components/sidebar/SidebarRecap";
import MobileDrawerToggle from "@/components/sidebar/MobileDrawerToggle";

// Clean marker tags from streamed text (handles both complete and partial markers)
function cleanMarkers(text: string): string {
  let cleaned = text
    // Remove complete marker pairs
    .replace(/\[MESSAGE\]\s*/g, "")
    .replace(/\s*\[\/MESSAGE\]/g, "")
    .replace(/\[STATE_UPDATE\][\s\S]*?\[\/STATE_UPDATE\]/g, "")
    .replace(/\[QUICK_REPLIES\][\s\S]*?\[\/QUICK_REPLIES\]/g, "")
    .replace(/\[ONBOARDING_COMPLETE\]/g, "")
    .replace(/\[ONBOARDING_DATA\][\s\S]*?\[\/ONBOARDING_DATA\]/g, "");

  // During streaming: strip from any unclosed opening marker to end of string
  // (the closing tag hasn't arrived yet, so the regex above won't match)
  cleaned = cleaned.replace(
    /\[(STATE_UPDATE|QUICK_REPLIES|ONBOARDING_DATA|ONBOARDING_COMPLETE|\/MESSAGE)\][\s\S]*$/g,
    ""
  );

  // Strip partial tag being formed at the end (e.g. "[STATE" or "[QUICK_RE")
  cleaned = cleaned.replace(/\[[A-Z_\/]*$/g, "");

  return cleaned.trim();
}

export default function OnboardingPage() {
  const router = useRouter();

  // Session
  const [sessionId] = useState(() => crypto.randomUUID());

  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [quickReplies, setQuickReplies] = useState<string[] | null>(null);

  // Onboarding state
  const [onboardingState, setOnboardingState] = useState<OnboardingState>(
    initialOnboardingState
  );

  // Sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Speech recognition
  const speechRecognition = useSpeechRecognition();

  // Build conversation history for API (Claude format)
  const buildHistory = useCallback((msgs: ChatMessage[]) => {
    return msgs
      .filter((m) => m.id !== "welcome")
      .map((m) => ({
        role: (m.role === "agent" ? "assistant" : "user") as
          | "user"
          | "assistant",
        content: m.content,
      }));
  }, []);

  const sendMessage = useCallback(
    async (text: string) => {
      if (isStreaming) return;

      // Add client message
      const clientMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "client",
        content: text,
        timestamp: new Date(),
      };

      const updatedMessages = [...messages, clientMsg];
      setMessages(updatedMessages);
      setIsStreaming(true);
      setStreamingText("");
      setQuickReplies(null);

      try {
        const response = await fetch("/api/chat/onboarding", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            session_id: sessionId,
            message: text,
            conversation_history: buildHistory(updatedMessages),
            current_state: onboardingState,
          }),
        });

        if (!response.ok) {
          const err = await response.json().catch(() => ({}));
          throw new Error(
            err.message || "Erreur de connexion. Réessayez."
          );
        }

        // Process SSE stream
        const reader = response.body?.getReader();
        if (!reader) throw new Error("Pas de flux de réponse");

        const decoder = new TextDecoder();
        let accumulated = "";
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const jsonStr = line.slice(6).trim();
            if (!jsonStr) continue;

            try {
              const event = JSON.parse(jsonStr);

              switch (event.type) {
                case "message_chunk":
                  accumulated += event.content;
                  setStreamingText(cleanMarkers(accumulated));
                  break;

                case "state_update":
                  if (event.state) {
                    setOnboardingState(event.state);
                  }
                  break;

                case "quick_replies":
                  if (event.options) {
                    setQuickReplies(event.options);
                  }
                  break;

                case "onboarding_complete":
                  // Redirect to confirmation after a brief delay
                  setTimeout(() => {
                    const state = event.data || onboardingState;
                    const params = new URLSearchParams({
                      name: state.client?.name || "",
                      agent:
                        state.identite_agent?.prenom || "votre assistant",
                    });
                    router.push(
                      `/onboarding/confirmation?${params.toString()}`
                    );
                  }, 3000);
                  break;

                case "error":
                  throw new Error(event.content || "Erreur du serveur");

                case "done":
                  break;
              }
            } catch (parseErr) {
              if (parseErr instanceof SyntaxError) continue;
              throw parseErr;
            }
          }
        }

        // Add final agent message
        const cleanedText = cleanMarkers(accumulated);
        if (cleanedText) {
          const agentMsg: ChatMessage = {
            id: crypto.randomUUID(),
            role: "agent",
            content: cleanedText,
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, agentMsg]);
        }
      } catch (err) {
        const errorMsg: ChatMessage = {
          id: crypto.randomUUID(),
          role: "agent",
          content: `Désolé, une erreur est survenue : ${
            err instanceof Error ? err.message : "Erreur inconnue"
          }. Veuillez réessayer.`,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMsg]);
      } finally {
        setIsStreaming(false);
        setStreamingText("");
      }
    },
    [isStreaming, messages, sessionId, buildHistory, onboardingState, router]
  );

  const handleQuickReply = useCallback(
    (option: string) => {
      sendMessage(option);
    },
    [sendMessage]
  );

  // Count completed sidebar sections
  const sections = [
    !!(onboardingState.profil.metier && onboardingState.profil.specialite),
    !!(
      onboardingState.identite_agent.prenom &&
      onboardingState.identite_agent.role
    ),
    !!onboardingState.missions.principale_1,
    !!onboardingState.caractere.ton,
    !!onboardingState.regles.confidentialite,
    !!(
      onboardingState.routine.taches.length > 0 ||
      onboardingState.routine.rituel_matin
    ),
    !!onboardingState.ecosysteme.formule,
  ];
  const completedCount = sections.filter(Boolean).length;

  return (
    <main className="h-screen flex flex-col relative overflow-hidden">
      {/* Background glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] opacity-20 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(79,125,243,0.15) 0%, transparent 70%)",
        }}
      />

      {/* Header */}
      <header
        className="relative z-10 flex items-center justify-between px-4 sm:px-6 py-3"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <h1 className="font-brand text-lg text-txt-primary tracking-wide">
          MyBotIA
        </h1>
        <MobileDrawerToggle
          onClick={() => setIsSidebarOpen(true)}
          completedCount={completedCount}
          totalCount={7}
        />
      </header>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden relative z-10">
        {/* Chat zone */}
        <div className="flex-1 flex flex-col min-w-0">
          <ChatContainer
            messages={messages}
            isStreaming={isStreaming}
            streamingText={streamingText}
            quickReplies={quickReplies}
            onQuickReply={handleQuickReply}
          />

          {/* Input */}
          <div className="px-4 pb-4 pt-2">
            <ChatInput
              onSend={sendMessage}
              disabled={isStreaming}
              speechRecognition={speechRecognition}
            />
          </div>
        </div>

        {/* Desktop sidebar */}
        <div className="hidden lg:block p-4 pl-0">
          <SidebarRecap
            state={onboardingState}
            isOpen={false}
            onClose={() => {}}
          />
        </div>
      </div>

      {/* Mobile sidebar drawer */}
      <div className="lg:hidden">
        <SidebarRecap
          state={onboardingState}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
      </div>

      {/* Footer */}
      <footer
        className="relative z-10 text-center py-2 text-xs text-txt-muted"
        style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
      >
        <span className="font-brand text-[10px] tracking-wide">MyBotIA</span>
        <span className="mx-1.5">|</span>
        MyBotIA.com &copy; {new Date().getFullYear()} &mdash; Gilles KORZEC,
        CEO Fondateur
      </footer>
    </main>
  );
}
