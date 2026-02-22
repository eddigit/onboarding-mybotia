import { OnboardingFormData } from "@/types/onboarding";

const PLAN_LABELS: Record<string, string> = {
  starter: "Essentiel (69€/mois)",
  pro: "Professionnel (149€/mois)",
  cabinet: "Cabinet (299€/mois)",
};

const ROLE_LABELS: Record<string, string> = {
  juridique: "Assistant juridique",
  admin: "Assistant administratif",
  commercial: "Assistant commercial",
  polyvalent: "Assistant polyvalent",
  autre: "Autre",
};

function buildClientEmailHtml(data: OnboardingFormData): string {
  const agentName = data.step2.prenomAgent;
  const formule = PLAN_LABELS[data.step7.formule as string] || data.step7.formule;
  const role = ROLE_LABELS[data.step2.role as string] || data.step2.role;

  return `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"></head>
<body style="font-family: 'Inter', Arial, sans-serif; background: #f8f9fa; padding: 20px;">
  <div style="max-width: 560px; margin: 0 auto; background: white; border-radius: 16px; padding: 32px; border: 1px solid #e9ecef;">
    <h1 style="color: #212529; font-size: 22px; margin-bottom: 8px;">
      Votre assistant ${agentName} est en cours de création
    </h1>
    <p style="color: #868e96; font-size: 14px; margin-bottom: 24px;">
      Merci ${data.clientName} ! Voici un récapitulatif de votre demande.
    </p>

    <div style="background: #f0f4ff; border-radius: 12px; padding: 16px; margin-bottom: 24px;">
      <p style="margin: 0 0 8px 0; font-size: 14px;"><strong>Assistant :</strong> ${agentName}</p>
      <p style="margin: 0 0 8px 0; font-size: 14px;"><strong>Rôle :</strong> ${role}</p>
      <p style="margin: 0; font-size: 14px;"><strong>Formule :</strong> ${formule}</p>
    </div>

    <h2 style="color: #212529; font-size: 16px; margin-bottom: 12px;">Ce qui va se passer :</h2>
    <ol style="color: #495057; font-size: 14px; padding-left: 20px; line-height: 1.8;">
      <li>Notre équipe configure ${agentName} dans les <strong>48h</strong></li>
      <li>Vous recevrez un <strong>accès direct</strong> à votre assistant</li>
      <li>Une <strong>session d'accompagnement</strong> sera planifiée pour la prise en main</li>
    </ol>

    <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e9ecef; font-size: 13px; color: #868e96;">
      Une question ? Contactez-nous à
      <a href="mailto:gilles@coachdigitalparis.com" style="color: #4c6ef5;">gilles@coachdigitalparis.com</a>
    </div>
  </div>
</body>
</html>`;
}

export async function sendEmails(
  data: OnboardingFormData,
  markdown: string
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail =
    process.env.RESEND_FROM_EMAIL || "assistant@coachdigitalparis.com";
  const internalEmail =
    process.env.INTERNAL_NOTIFICATION_EMAIL || "gilles@coachdigitalparis.com";

  if (!apiKey) {
    console.warn("[Resend] RESEND_API_KEY not configured, skipping.");
    return;
  }

  // 1. Email to client
  const clientPayload = {
    from: fromEmail,
    to: [data.clientEmail],
    subject: `Votre assistant ${data.step2.prenomAgent} est en cours de création`,
    html: buildClientEmailHtml(data),
  };

  const clientRes = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(clientPayload),
  });

  if (!clientRes.ok) {
    const err = await clientRes.text();
    console.error(`[Resend] Client email failed: ${err}`);
  }

  // 2. Internal email
  const formule = PLAN_LABELS[data.step7.formule as string] || data.step7.formule;
  const internalPayload = {
    from: fromEmail,
    to: [internalEmail],
    subject: `[ONBOARDING] Nouveau — ${data.clientName} — ${data.step2.prenomAgent} — ${formule}`,
    html: `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"></head>
<body style="font-family: monospace; background: #f8f9fa; padding: 20px;">
  <div style="max-width: 700px; margin: 0 auto; background: white; border-radius: 12px; padding: 24px;">
    <h1 style="font-size: 18px;">Nouvel onboarding : ${data.clientName}</h1>
    <pre style="background: #f1f3f5; padding: 16px; border-radius: 8px; font-size: 13px; white-space: pre-wrap; overflow-x: auto;">${markdown}</pre>
  </div>
</body>
</html>`,
  };

  const internalRes = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(internalPayload),
  });

  if (!internalRes.ok) {
    const err = await internalRes.text();
    console.error(`[Resend] Internal email failed: ${err}`);
  }
}
