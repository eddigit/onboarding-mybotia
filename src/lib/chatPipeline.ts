import { OnboardingState, WebhookPayload } from "@/types/onboarding";

// ============================================================
// Label maps for display values
// ============================================================

const ROLE_LABELS: Record<string, string> = {
  expert: "Expert métier",
  admin: "Assistant administratif",
  commercial: "Assistant commercial",
  polyvalent: "Assistant polyvalent",
  autre: "Autre",
};

const PERSONALITY_LABELS: Record<string, string> = {
  methodique: "Le méthodique",
  proactif: "Le proactif",
  creatif: "Le créatif",
  executant: "L'exécutant fiable",
};

const TON_LABELS: Record<string, string> = {
  direct: "Direct et sans détour",
  diplomate: "Professionnel et diplomate",
  pedagogue: "Pédagogue et patient",
};

const ERROR_LABELS: Record<string, string> = {
  silent_fix: "Corriger sans commentaire",
  brief_explain: "Expliquer brièvement et corriger",
  full_explain: "Expliquer en détail",
};

const CHALLENGE_LABELS: Record<string, string> = {
  no_challenge: "Non — exécute ce qui est demandé",
  moderate_challenge: "Oui, modérément",
  strong_challenge: "Oui, fortement",
};

const CONF_LABELS: Record<string, string> = {
  high: "Haute (dossiers clients, données sensibles)",
  partial: "Partielle",
  low: "Non sensible",
};

const LANG_LABELS: Record<string, string> = {
  fr: "Français uniquement",
  fr_en: "Français + anglais professionnel",
  multilingual: "Multilingue",
};

const TECH_LABELS: Record<string, string> = {
  basic: "Basique",
  intermediate: "Intermédiaire",
  advanced: "Avancé",
};

const PLAN_LABELS: Record<string, string> = {
  starter: "Essentiel (69€/mois)",
  pro: "Professionnel (149€/mois)",
  cabinet: "Cabinet (299€/mois)",
};

const PLAN_DISPLAY: Record<string, string> = {
  starter: "Starter",
  pro: "Pro",
  cabinet: "Cabinet",
};

const ROLE_DISPLAY: Record<string, string> = {
  expert: "expert",
  admin: "admin",
  commercial: "commercial",
  polyvalent: "polyvalent",
  autre: "autre",
};

// ============================================================
// Markdown generation
// ============================================================

export function generateChatMarkdown(state: OnboardingState): string {
  const now = new Date().toISOString();

  const langueStr =
    state.profil.langue === "multilingual" && state.profil.langues_detail
      ? `${LANG_LABELS["multilingual"]} (${state.profil.langues_detail})`
      : LANG_LABELS[state.profil.langue as string] || state.profil.langue || "Non défini";

  const sourcesStr =
    state.missions.sources.length > 0
      ? state.missions.sources.join(", ")
      : "Aucune";

  const interditsStr =
    state.regles.interdits.length > 0
      ? state.regles.interdits.map((i) => `  - ${i}`).join("\n")
      : "  - Aucun défini";

  const prioritesStr =
    state.caractere.priorites.length > 0
      ? state.caractere.priorites.map((p, i) => `${i + 1}. ${p}`).join(", ")
      : "Non définies";

  const validationStr =
    state.regles.validation === "validation"
      ? `Oui — ${state.regles.validation_detail || "détails non précisés"}`
      : "Non — réponse directe";

  let communicationStr = "Non défini";
  if (state.regles.communication_tiers === "solo") {
    communicationStr = "Uniquement avec le client";
  } else if (state.regles.communication_tiers === "team") {
    communicationStr = `Équipe/associés — ${state.regles.communication_detail || ""}`;
  } else if (state.regles.communication_tiers === "external") {
    communicationStr = `Clients/tiers — ${state.regles.communication_detail || ""}`;
  }

  let routineStr = "";
  if (state.routine.taches.length > 0) {
    routineStr = state.routine.taches
      .filter((t) => t.quoi.trim())
      .map((t) => `  - ${t.quoi} | ${t.quand} | ${t.resultat}`)
      .join("\n");
  }
  if (!routineStr) {
    routineStr = "  - Aucune — instructions au fil de l'eau";
  }

  let ecosystemStr = "";
  if (state.ecosysteme.nombre_agents === "multi") {
    const count = state.ecosysteme.nombre_agents_detail || "plusieurs";
    ecosystemStr = `Multi (${count} assistants)${state.ecosysteme.roles_detail ? ` — ${state.ecosysteme.roles_detail}` : ""}`;
  } else {
    ecosystemStr = "Un seul assistant polyvalent";
  }

  let coordinationStr = "";
  if (state.ecosysteme.nombre_agents === "multi") {
    coordinationStr =
      state.ecosysteme.coordination === "supervisor"
        ? `Superviseur : ${state.ecosysteme.coordination_detail || "non précisé"}`
        : "Manuel (le client coordonne)";
  } else {
    coordinationStr = "N/A (agent unique)";
  }

  return `# Cahier des Charges Agent — ${state.identite_agent.prenom || "Non défini"}

**Date** : ${now}
**Client** : ${state.client.name || "Non défini"} / ${state.client.email || "Non défini"}
**Formule** : ${PLAN_LABELS[state.ecosysteme.formule as string] || state.ecosysteme.formule || "Non défini"}
**Template** : ${state.identite_agent.role || "Non défini"}
**Source** : Onboarding conversationnel

---

## Profil Client
- **Métier** : ${state.profil.metier || "Non défini"}
- **Spécialité** : ${state.profil.specialite || "Non défini"}
- **Cabinet** : ${state.profil.cabinet || "Non défini"}
- **Niveau technique** : ${TECH_LABELS[state.profil.niveau_tech as string] || state.profil.niveau_tech || "Non défini"}
- **Langue** : ${langueStr}

## Identité Agent
- **Prénom** : ${state.identite_agent.prenom || "Non défini"}
- **Rôle** : ${ROLE_LABELS[state.identite_agent.role as string] || state.identite_agent.role || "Non défini"}${state.identite_agent.role_detail ? ` — ${state.identite_agent.role_detail}` : ""}
- **Profil** : ${PERSONALITY_LABELS[state.identite_agent.profil_comportemental as string] || state.identite_agent.profil_comportemental || "Non défini"}

## Missions
- **Mission 1** : ${state.missions.principale_1 || "Non définie"}
- **Mission 2** : ${state.missions.principale_2 || "Non définie"}
- **Mission 3** : ${state.missions.principale_3 || "Non définie"}
- **Bonus** : ${state.missions.bonus || "Aucune"}
- **Sources** : ${sourcesStr}

## Caractère
- **Ton** : ${TON_LABELS[state.caractere.ton as string] || state.caractere.ton || "Non défini"}
- **Gestion erreurs** : ${ERROR_LABELS[state.caractere.gestion_erreurs as string] || state.caractere.gestion_erreurs || "Non défini"}
- **Challenge** : ${CHALLENGE_LABELS[state.caractere.challenge as string] || state.caractere.challenge || "Non défini"}
- **Priorités (classement)** : ${prioritesStr}

## Règles Absolues
- **Confidentialité** : ${CONF_LABELS[state.regles.confidentialite as string] || state.regles.confidentialite || "Non défini"}
- **Interdits** :
${interditsStr}
- **Validation** : ${validationStr}
- **Communication tiers** : ${communicationStr}

## Routine
- **Tâches récurrentes** :
${routineStr}
- **Rituel matin** : ${state.routine.rituel_matin || "Aucun défini"}

## Écosystème
- **Nombre d'agents** : ${ecosystemStr}
- **Coordination** : ${coordinationStr}
- **Formule** : ${PLAN_LABELS[state.ecosysteme.formule as string] || state.ecosysteme.formule || "Non défini"}
`;
}

// ============================================================
// Webhook
// ============================================================

export async function sendChatWebhook(
  sessionId: string,
  state: OnboardingState,
  markdown: string,
  conversationLength: number
): Promise<void> {
  const webhookUrl = process.env.ATLAS_WEBHOOK_URL;
  const webhookSecret = process.env.ATLAS_WEBHOOK_SECRET;

  if (!webhookUrl || !webhookSecret) {
    console.warn(
      "[ChatPipeline/Webhook] ATLAS_WEBHOOK_URL or ATLAS_WEBHOOK_SECRET not configured, skipping."
    );
    return;
  }

  const payload: WebhookPayload = {
    session_id: sessionId,
    client_email: state.client.email || "",
    client_name: state.client.name || "",
    agent_name: state.identite_agent.prenom || "",
    template: state.identite_agent.role || "polyvalent",
    plan: state.ecosysteme.formule || "starter",
    markdown,
    raw_state: state,
    conversation_length: conversationLength,
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

// ============================================================
// Notion
// ============================================================

export async function createChatNotionEntry(
  sessionId: string,
  state: OnboardingState,
  markdown: string,
  conversationLength: number
): Promise<void> {
  const notionApiKey = process.env.NOTION_API_KEY;
  const databaseId = process.env.NOTION_ONBOARDING_DB_ID;

  if (!notionApiKey || !databaseId) {
    console.warn(
      "[ChatPipeline/Notion] NOTION_API_KEY or NOTION_ONBOARDING_DB_ID not configured, skipping."
    );
    return;
  }

  const response = await fetch("https://api.notion.com/v1/pages", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${notionApiKey}`,
      "Content-Type": "application/json",
      "Notion-Version": "2022-06-28",
    },
    body: JSON.stringify({
      parent: { database_id: databaseId },
      properties: {
        Client: {
          title: [
            { text: { content: state.client.name || "Inconnu" } },
          ],
        },
        Email: {
          email: state.client.email || "",
        },
        Agent: {
          rich_text: [
            { text: { content: state.identite_agent.prenom || "" } },
          ],
        },
        Rôle: {
          select: {
            name:
              ROLE_DISPLAY[state.identite_agent.role as string] || "polyvalent",
          },
        },
        Formule: {
          select: {
            name:
              PLAN_DISPLAY[state.ecosysteme.formule as string] || "Starter",
          },
        },
        Statut: {
          status: { name: "Nouveau" },
        },
        Date: {
          date: { start: new Date().toISOString() },
        },
        "Session ID": {
          rich_text: [{ text: { content: sessionId } }],
        },
        "Cahier des charges": {
          rich_text: [
            {
              text: {
                content:
                  markdown.length > 2000
                    ? markdown.substring(0, 2000)
                    : markdown,
              },
            },
          ],
        },
        Messages: {
          number: conversationLength,
        },
      },
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Notion API error ${response.status}: ${errorBody}`);
  }
}

// ============================================================
// Emails via Resend
// ============================================================

function buildClientEmailHtml(state: OnboardingState): string {
  const agentName = state.identite_agent.prenom || "votre assistant";
  const formule =
    PLAN_LABELS[state.ecosysteme.formule as string] ||
    state.ecosysteme.formule ||
    "Non définie";
  const role =
    ROLE_LABELS[state.identite_agent.role as string] ||
    state.identite_agent.role ||
    "Assistant";
  const clientName = state.client.name || "cher client";

  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin: 0; padding: 0; font-family: 'Inter', 'Segoe UI', Arial, sans-serif; background-color: #040714;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 32px;">
      <h1 style="color: #ffffff; font-size: 24px; font-weight: 700; margin: 0 0 8px 0;">
        Coach Digital Paris
      </h1>
      <div style="width: 60px; height: 3px; background: #4f7df3; margin: 0 auto;"></div>
    </div>

    <!-- Main Card -->
    <div style="background: #0d1332; border-radius: 16px; padding: 32px; border: 1px solid rgba(79, 125, 243, 0.2);">
      <h2 style="color: #ffffff; font-size: 20px; font-weight: 600; margin: 0 0 8px 0;">
        Votre assistant ${agentName} est en cours de cr\u00e9ation
      </h2>
      <p style="color: #a0aec0; font-size: 15px; line-height: 1.6; margin: 0 0 24px 0;">
        Merci ${clientName} ! Voici un r\u00e9capitulatif de votre demande.
      </p>

      <!-- Info Box -->
      <div style="background: rgba(79, 125, 243, 0.1); border-radius: 12px; padding: 20px; margin-bottom: 24px; border: 1px solid rgba(79, 125, 243, 0.15);">
        <p style="margin: 0 0 10px 0; font-size: 14px; color: #e2e8f0;">
          <strong style="color: #4f7df3;">Assistant :</strong> ${agentName}
        </p>
        <p style="margin: 0 0 10px 0; font-size: 14px; color: #e2e8f0;">
          <strong style="color: #4f7df3;">R\u00f4le :</strong> ${role}
        </p>
        <p style="margin: 0; font-size: 14px; color: #e2e8f0;">
          <strong style="color: #4f7df3;">Formule :</strong> ${formule}
        </p>
      </div>

      <!-- Timeline -->
      <h3 style="color: #ffffff; font-size: 16px; font-weight: 600; margin: 0 0 16px 0;">
        Ce qui va se passer :
      </h3>
      <ol style="color: #e2e8f0; font-size: 14px; padding-left: 20px; line-height: 2; margin: 0 0 24px 0;">
        <li>Notre \u00e9quipe configure ${agentName} dans les <strong style="color: #4f7df3;">48h</strong></li>
        <li>Vous recevrez un <strong style="color: #4f7df3;">acc\u00e8s direct</strong> \u00e0 votre assistant</li>
        <li>Une <strong style="color: #4f7df3;">session d'accompagnement</strong> sera planifi\u00e9e pour la prise en main</li>
      </ol>

      <!-- Footer -->
      <div style="border-top: 1px solid rgba(79, 125, 243, 0.15); padding-top: 20px; margin-top: 8px;">
        <p style="font-size: 13px; color: #718096; margin: 0;">
          Une question ? Contactez-nous \u00e0
          <a href="mailto:gilles@coachdigitalparis.com" style="color: #4f7df3; text-decoration: none;">gilles@coachdigitalparis.com</a>
        </p>
      </div>
    </div>

    <!-- Bottom branding -->
    <p style="text-align: center; font-size: 12px; color: #4a5568; margin-top: 24px;">
      Coach Digital Paris — Assistants IA sur mesure
    </p>
  </div>
</body>
</html>`;
}

export async function sendChatEmails(
  state: OnboardingState,
  markdown: string
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail =
    process.env.RESEND_FROM_EMAIL || "assistant@coachdigitalparis.com";
  const internalEmail =
    process.env.INTERNAL_NOTIFICATION_EMAIL || "gilles@coachdigitalparis.com";

  if (!apiKey) {
    console.warn(
      "[ChatPipeline/Resend] RESEND_API_KEY not configured, skipping."
    );
    return;
  }

  const agentName = state.identite_agent.prenom || "Assistant";
  const clientEmail = state.client.email;

  if (!clientEmail) {
    console.warn(
      "[ChatPipeline/Resend] Client email not available, skipping client email."
    );
  } else {
    // 1. Email to client
    const clientPayload = {
      from: fromEmail,
      to: [clientEmail],
      subject: `Votre assistant ${agentName} est en cours de création`,
      html: buildClientEmailHtml(state),
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
      console.error(`[ChatPipeline/Resend] Client email failed: ${err}`);
    }
  }

  // 2. Internal email
  const formule =
    PLAN_LABELS[state.ecosysteme.formule as string] ||
    state.ecosysteme.formule ||
    "N/A";
  const clientName = state.client.name || "Inconnu";

  const internalPayload = {
    from: fromEmail,
    to: [internalEmail],
    subject: `[ONBOARDING] ${clientName} — ${agentName} — ${formule}`,
    html: `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"></head>
<body style="font-family: monospace; background: #f8f9fa; padding: 20px;">
  <div style="max-width: 700px; margin: 0 auto; background: white; border-radius: 12px; padding: 24px;">
    <h1 style="font-size: 18px;">Nouvel onboarding conversationnel : ${clientName}</h1>
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
    console.error(`[ChatPipeline/Resend] Internal email failed: ${err}`);
  }
}

// ============================================================
// Completion pipeline (orchestrator)
// ============================================================

export async function runCompletionPipeline(
  sessionId: string,
  state: OnboardingState,
  conversationLength: number
): Promise<void> {
  const markdown = generateChatMarkdown(state);

  const results = await Promise.allSettled([
    sendChatWebhook(sessionId, state, markdown, conversationLength),
    createChatNotionEntry(sessionId, state, markdown, conversationLength),
    sendChatEmails(state, markdown),
  ]);

  const labels = ["Webhook", "Notion", "Emails"];
  results.forEach((r, i) => {
    if (r.status === "rejected") {
      console.error(
        `[ChatPipeline] ${labels[i]} failed:`,
        r.reason
      );
    } else {
      console.log(`[ChatPipeline] ${labels[i]} succeeded.`);
    }
  });
}
