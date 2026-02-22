import { OnboardingFormData } from "@/types/onboarding";

const ROLE_LABELS: Record<string, string> = {
  juridique: "Assistant juridique",
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

const QUALITY_LABELS: Record<string, string> = {
  exactitude: "Exactitude",
  rapidite: "Rapidité",
  initiative: "Initiative",
  discretion: "Discrétion",
  clarte: "Clarté",
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

const SOURCE_LABELS: Record<string, string> = {
  legifrance: "Légifrance",
  judilibre: "Judilibre",
  eurlex: "EUR-Lex / CJUE / CEDH",
  doctrine: "Doctrine.fr",
  dalloz: "Dalloz",
  lexisnexis: "LexisNexis",
  code_travail: "Code du travail",
  code_civil: "Code civil",
  code_commerce: "Code de commerce",
};

export function generateMarkdown(data: OnboardingFormData): string {
  const now = new Date().toISOString();
  const { step1, step2, step3, step4, step5, step6, step7 } = data;

  const sourcesStr = [
    ...step3.sources.map((s) => SOURCE_LABELS[s] || s),
    ...(step3.sourcesAutre ? [step3.sourcesAutre] : []),
  ].join(", ");

  const interditsStr = [
    ...step5.interdits,
    ...(step5.interditsAutre ? [step5.interditsAutre] : []),
  ]
    .map((i) => `  - ${i}`)
    .join("\n");

  const qualitesStr = step4.qualitesClassement
    .map((q, i) => `${i + 1}. ${QUALITY_LABELS[q] || q}`)
    .join(", ");

  let routineStr = "";
  if (step6.hasTachesRecurrentes && step6.tachesRecurrentes.length > 0) {
    routineStr = step6.tachesRecurrentes
      .filter((t) => t.quoi.trim())
      .map((t) => {
        const quand =
          t.quand === "Personnalisé" ? t.quandPersonnalise : t.quand;
        return `  - ${t.quoi} | ${quand} | ${t.resultat}`;
      })
      .join("\n");
  } else {
    routineStr = "  - Aucune — instructions au fil de l'eau";
  }

  const langueStr =
    step1.langue === "multilingual"
      ? `${LANG_LABELS[step1.langue]} (${step1.languesDetail})`
      : LANG_LABELS[step1.langue as string] || step1.langue;

  let ecosystemStr = "";
  if (step7.nombreAssistants === "multi") {
    ecosystemStr = `Multi (${step7.nombreAssistantsCount} assistants) — ${step7.nombreAssistantsRoles}`;
  } else {
    ecosystemStr = "Un seul assistant polyvalent";
  }

  let coordinationStr = "";
  if (step7.nombreAssistants === "multi") {
    coordinationStr =
      step7.coordination === "supervisor"
        ? `Superviseur : ${step7.coordinationDetail}`
        : "Manuel (le client coordonne)";
  } else {
    coordinationStr = "N/A (agent unique)";
  }

  const validationStr =
    step5.validation === "validation"
      ? `Oui — ${step5.validationDetail}`
      : "Non — réponse directe";

  let communicationStr = "";
  if (step5.communication === "solo") {
    communicationStr = "Uniquement avec le client";
  } else if (step5.communication === "team") {
    communicationStr = `Équipe/associés — ${step5.communicationDetail}`;
  } else if (step5.communication === "external") {
    communicationStr = `Clients/tiers — ${step5.communicationDetail}`;
  }

  return `# Cahier des Charges Agent — ${step2.prenomAgent}

**Date** : ${now}
**Client** : ${data.clientName} / ${data.clientEmail}
**Formule** : ${PLAN_LABELS[step7.formule as string] || step7.formule}
**Template** : ${step2.role}

---

## Profil Client
- **Métier** : ${step1.metier}
- **Spécialité** : ${step1.specialite}
- **Cabinet** : ${step1.cabinet}
- **Niveau technique** : ${TECH_LABELS[step1.niveauTechnique as string] || step1.niveauTechnique}
- **Langue** : ${langueStr}

## Identité Agent
- **Prénom** : ${step2.prenomAgent}
- **Rôle** : ${ROLE_LABELS[step2.role as string] || step2.role}${step2.roleDetail ? ` — ${step2.roleDetail}` : ""}
- **Profil** : ${PERSONALITY_LABELS[step2.personnalite as string] || step2.personnalite}

## Missions
- **Mission 1** : ${step3.mission1}
- **Mission 2** : ${step3.mission2}
- **Mission 3** : ${step3.mission3}
- **Bonus** : ${step3.missionsBonus || "Aucune"}
- **Sources** : ${sourcesStr}

## Caractère
- **Ton** : ${TON_LABELS[step4.ton as string] || step4.ton}
- **Gestion erreurs** : ${ERROR_LABELS[step4.gestionErreurs as string] || step4.gestionErreurs}
- **Challenge** : ${CHALLENGE_LABELS[step4.challenge as string] || step4.challenge}
- **Priorités (classement)** : ${qualitesStr}

## Règles Absolues
- **Confidentialité** : ${CONF_LABELS[step5.confidentialite as string] || step5.confidentialite}
- **Interdits** :
${interditsStr}
- **Validation** : ${validationStr}
- **Communication tiers** : ${communicationStr}

## Routine
- **Tâches récurrentes** :
${routineStr}
- **Rituel matin** : ${step6.rituelMatin || "Aucun défini"}

## Écosystème
- **Nombre d'agents** : ${ecosystemStr}
- **Coordination** : ${coordinationStr}
- **Formule** : ${PLAN_LABELS[step7.formule as string] || step7.formule}
`;
}
