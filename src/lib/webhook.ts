import { OnboardingFormData } from "@/types/onboarding";

interface WebhookPayload {
  client_id: string;
  client_email: string;
  client_name: string;
  agent_name: string;
  template: string;
  plan: string;
  markdown: string;
  submitted_at: string;
}

export async function sendWebhook(
  data: OnboardingFormData,
  markdown: string
): Promise<void> {
  const webhookUrl = process.env.ATLAS_WEBHOOK_URL;
  const webhookSecret = process.env.ATLAS_WEBHOOK_SECRET;

  if (!webhookUrl || !webhookSecret) {
    console.warn(
      "[Webhook] ATLAS_WEBHOOK_URL or ATLAS_WEBHOOK_SECRET not configured, skipping."
    );
    return;
  }

  const payload: WebhookPayload = {
    client_id: crypto.randomUUID(),
    client_email: data.clientEmail,
    client_name: data.clientName,
    agent_name: data.step2.prenomAgent,
    template: data.step2.role || "polyvalent",
    plan: data.step7.formule || "starter",
    markdown,
    submitted_at: new Date().toISOString(),
  };

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${webhookSecret}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Webhook failed with status ${response.status}`);
  }
}
