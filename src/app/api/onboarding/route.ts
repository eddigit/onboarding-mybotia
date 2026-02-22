import { NextRequest, NextResponse } from "next/server";
import { onboardingSchema } from "@/lib/serverValidation";
import { generateMarkdown } from "@/lib/generateMarkdown";
import { sendWebhook } from "@/lib/webhook";
import { createNotionEntry } from "@/lib/notion";
import { sendEmails } from "@/lib/email";
import { checkRateLimit } from "@/lib/rateLimit";

export async function POST(request: NextRequest) {
  // Rate limiting
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  const { allowed } = checkRateLimit(ip);
  if (!allowed) {
    return NextResponse.json(
      { message: "Trop de soumissions. Réessayez dans une heure." },
      { status: 429 }
    );
  }

  // Parse and validate
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: "Corps de requête invalide." },
      { status: 400 }
    );
  }

  const result = onboardingSchema.safeParse(body);
  if (!result.success) {
    const errors = result.error.issues.map((i) => i.message).join(", ");
    return NextResponse.json(
      { message: `Données invalides : ${errors}` },
      { status: 400 }
    );
  }

  const data = result.data;

  // Generate markdown
  const markdown = generateMarkdown(data);

  // Dispatch to all services (non-blocking — don't let one failure block others)
  const results = await Promise.allSettled([
    sendWebhook(data, markdown),
    createNotionEntry(data, markdown),
    sendEmails(data, markdown),
  ]);

  // Log failures but don't fail the request
  const labels = ["Webhook", "Notion", "Email"];
  results.forEach((r, i) => {
    if (r.status === "rejected") {
      console.error(`[Onboarding] ${labels[i]} failed:`, r.reason);
    }
  });

  return NextResponse.json({ success: true, message: "Onboarding enregistré." });
}
