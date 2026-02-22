// ============================================================
// Types for the 7-step onboarding form
// ============================================================

/** Step 1 — Votre profil */
export type TechLevel = "basic" | "intermediate" | "advanced";
export type LanguageOption = "fr" | "fr_en" | "multilingual";

export interface Step1Data {
  metier: string;
  specialite: string;
  cabinet: string;
  niveauTechnique: TechLevel | "";
  langue: LanguageOption | "";
  languesDetail: string; // only if langue === "multilingual"
}

/** Step 2 — Votre assistant */
export type RoleType =
  | "juridique"
  | "admin"
  | "commercial"
  | "polyvalent"
  | "autre";
export type PersonalityType =
  | "methodique"
  | "proactif"
  | "creatif"
  | "executant";

export interface Step2Data {
  prenomAgent: string;
  role: RoleType | "";
  roleDetail: string;
  personnalite: PersonalityType | "";
}

/** Step 3 — Ses missions */
export interface Step3Data {
  mission1: string;
  mission2: string;
  mission3: string;
  missionsBonus: string;
  sources: string[];
  sourcesAutre: string;
}

/** Step 4 — Son caractère */
export type TonType = "direct" | "diplomate" | "pedagogue";
export type ErrorHandling = "silent_fix" | "brief_explain" | "full_explain";
export type ChallengeLevel =
  | "no_challenge"
  | "moderate_challenge"
  | "strong_challenge";
export type QualityKey =
  | "exactitude"
  | "rapidite"
  | "initiative"
  | "discretion"
  | "clarte";

export interface Step4Data {
  ton: TonType | "";
  gestionErreurs: ErrorHandling | "";
  challenge: ChallengeLevel | "";
  qualitesClassement: QualityKey[];
}

/** Step 5 — Les règles absolues */
export type ConfidentialityLevel = "high" | "partial" | "low";
export type ValidationMode = "direct" | "validation";
export type CommunicationType = "solo" | "team" | "external";

export interface Step5Data {
  confidentialite: ConfidentialityLevel | "";
  interdits: string[];
  interditsAutre: string;
  validation: ValidationMode | "";
  validationDetail: string;
  communication: CommunicationType | "";
  communicationDetail: string;
}

/** Step 6 — Sa routine quotidienne */
export interface RecurringTask {
  quoi: string;
  quand: string;
  quandPersonnalise: string;
  resultat: string;
}

export interface Step6Data {
  hasTachesRecurrentes: boolean | null;
  tachesRecurrentes: RecurringTask[];
  rituelMatin: string;
}

/** Step 7 — L'écosystème */
export type EcosystemType = "single" | "multi";
export type CoordinationType = "manual" | "supervisor";
export type PlanType = "starter" | "pro" | "cabinet";

export interface Step7Data {
  nombreAssistants: EcosystemType | "";
  nombreAssistantsCount: number;
  nombreAssistantsRoles: string;
  coordination: CoordinationType | "";
  coordinationDetail: string;
  formule: PlanType | "";
}

/** Complete form data */
export interface OnboardingFormData {
  step1: Step1Data;
  step2: Step2Data;
  step3: Step3Data;
  step4: Step4Data;
  step5: Step5Data;
  step6: Step6Data;
  step7: Step7Data;
  // Extra fields for submission
  clientName: string;
  clientEmail: string;
}

/** Initial empty state */
export const initialFormData: OnboardingFormData = {
  step1: {
    metier: "",
    specialite: "",
    cabinet: "",
    niveauTechnique: "",
    langue: "",
    languesDetail: "",
  },
  step2: {
    prenomAgent: "",
    role: "",
    roleDetail: "",
    personnalite: "",
  },
  step3: {
    mission1: "",
    mission2: "",
    mission3: "",
    missionsBonus: "",
    sources: [],
    sourcesAutre: "",
  },
  step4: {
    ton: "",
    gestionErreurs: "",
    challenge: "",
    qualitesClassement: [
      "exactitude",
      "rapidite",
      "initiative",
      "discretion",
      "clarte",
    ],
  },
  step5: {
    confidentialite: "",
    interdits: [
      "Ne jamais donner de conseil juridique définitif à un tiers",
      "Ne jamais engager le cabinet auprès d'un client",
      "Ne jamais commenter un dossier en cours à l'extérieur",
    ],
    interditsAutre: "",
    validation: "",
    validationDetail: "",
    communication: "",
    communicationDetail: "",
  },
  step6: {
    hasTachesRecurrentes: null,
    tachesRecurrentes: [],
    rituelMatin: "",
  },
  step7: {
    nombreAssistants: "",
    nombreAssistantsCount: 2,
    nombreAssistantsRoles: "",
    coordination: "",
    coordinationDetail: "",
    formule: "",
  },
  clientName: "",
  clientEmail: "",
};

/** Step metadata */
export interface StepMeta {
  number: number;
  title: string;
  subtitle: string;
}

export const STEPS: StepMeta[] = [
  {
    number: 1,
    title: "Parlons de vous",
    subtitle: "Pour que votre assistant s'adapte parfaitement à votre pratique.",
  },
  {
    number: 2,
    title: "Créez votre collaborateur virtuel",
    subtitle: "Donnez-lui une identité. C'est votre bras droit au quotidien.",
  },
  {
    number: 3,
    title: "Ses missions au quotidien",
    subtitle: "Ce qu'il va faire concrètement pour vous, chaque jour.",
  },
  {
    number: 4,
    title: "Sa personnalité professionnelle",
    subtitle: "Comment il se comporte avec vous au quotidien.",
  },
  {
    number: 5,
    title: "Les règles non négociables",
    subtitle:
      "Ce qu'il ne doit JAMAIS faire. C'est la partie la plus importante.",
  },
  {
    number: 6,
    title: "Ses automatismes",
    subtitle:
      "Les tâches qu'il fait automatiquement, sans que vous ayez à le demander.",
  },
  {
    number: 7,
    title: "Un assistant ou une équipe ?",
    subtitle: "Si vous avez besoin de plusieurs assistants spécialisés.",
  },
];
