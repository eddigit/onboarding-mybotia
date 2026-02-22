// ============================================================
// Types for the conversational chat onboarding (v2)
// ============================================================

// ---- Onboarding State (maintained throughout conversation) ----

export interface OnboardingState {
  phase:
    | "profil"
    | "identite"
    | "missions"
    | "caractere"
    | "regles"
    | "routine"
    | "ecosysteme"
    | "recap"
    | "termine";
  client: {
    name: string | null;
    email: string | null;
  };
  profil: {
    metier: string | null;
    specialite: string | null;
    cabinet: string | null;
    niveau_tech: "basic" | "intermediate" | "advanced" | null;
    langue: "fr" | "fr_en" | "multilingual" | null;
    langues_detail?: string;
  };
  identite_agent: {
    prenom: string | null;
    role:
      | "juridique"
      | "admin"
      | "commercial"
      | "polyvalent"
      | "autre"
      | null;
    role_detail: string | null;
    profil_comportemental:
      | "methodique"
      | "proactif"
      | "creatif"
      | "executant"
      | null;
  };
  missions: {
    principale_1: string | null;
    principale_2: string | null;
    principale_3: string | null;
    bonus: string | null;
    sources: string[];
  };
  caractere: {
    ton: "direct" | "diplomate" | "pedagogue" | null;
    gestion_erreurs: "silent_fix" | "brief_explain" | "full_explain" | null;
    challenge:
      | "no_challenge"
      | "moderate_challenge"
      | "strong_challenge"
      | null;
    priorites: string[];
  };
  regles: {
    confidentialite: "high" | "partial" | "low" | null;
    interdits: string[];
    validation: "direct" | "validation" | null;
    validation_detail: string | null;
    communication_tiers: "solo" | "team" | "external" | null;
    communication_detail: string | null;
  };
  routine: {
    taches: Array<{
      quoi: string;
      quand: string;
      resultat: string;
    }>;
    rituel_matin: string | null;
  };
  ecosysteme: {
    nombre_agents: "single" | "multi" | null;
    nombre_agents_detail?: number;
    roles_detail?: string;
    coordination: "manual" | "supervisor" | null;
    coordination_detail?: string;
    formule: "starter" | "pro" | "cabinet" | null;
  };
}

export const initialOnboardingState: OnboardingState = {
  phase: "profil",
  client: { name: null, email: null },
  profil: {
    metier: null,
    specialite: null,
    cabinet: null,
    niveau_tech: null,
    langue: null,
  },
  identite_agent: {
    prenom: null,
    role: null,
    role_detail: null,
    profil_comportemental: null,
  },
  missions: {
    principale_1: null,
    principale_2: null,
    principale_3: null,
    bonus: null,
    sources: [],
  },
  caractere: {
    ton: null,
    gestion_erreurs: null,
    challenge: null,
    priorites: [],
  },
  regles: {
    confidentialite: null,
    interdits: [],
    validation: null,
    validation_detail: null,
    communication_tiers: null,
    communication_detail: null,
  },
  routine: {
    taches: [],
    rituel_matin: null,
  },
  ecosysteme: {
    nombre_agents: null,
    coordination: null,
    formule: null,
  },
};

// ---- Chat Message ----

export interface ChatMessage {
  id: string;
  role: "agent" | "client";
  content: string;
  timestamp: Date;
  quick_replies?: string[];
}

// ---- API Types ----

export interface ChatRequestBody {
  session_id: string;
  message: string;
  conversation_history: Array<{
    role: "user" | "assistant";
    content: string;
  }>;
  current_state: OnboardingState | null;
}

export interface SSEEvent {
  type:
    | "message_chunk"
    | "message_end"
    | "state_update"
    | "quick_replies"
    | "onboarding_complete"
    | "done"
    | "error";
  content?: string;
  state?: OnboardingState;
  options?: string[];
  data?: OnboardingState;
}

// ---- Webhook Payload ----

export interface WebhookPayload {
  session_id: string;
  client_email: string;
  client_name: string;
  agent_name: string;
  template: string;
  plan: string;
  markdown: string;
  raw_state: OnboardingState;
  conversation_length: number;
  submitted_at: string;
}

// ---- Sidebar Recap Sections ----

export interface RecapSectionData {
  id: string;
  label: string;
  icon: string;
  fields: RecapFieldData[];
  completed: boolean;
}

export interface RecapFieldData {
  label: string;
  value: string | null;
}

// ---- Welcome message (hardcoded, not from API) ----

export const WELCOME_MESSAGE: ChatMessage = {
  id: "welcome",
  role: "agent",
  content:
    "Bonjour !\n\nJe suis votre conseiller pour la création de votre assistant IA sur mesure. En quelques minutes de conversation, on va construire ensemble un collaborateur virtuel parfaitement adapté à votre pratique.\n\nVous pouvez me répondre en tapant ou en utilisant le micro 🎙️\n\nPour commencer : quel est votre métier et votre domaine de spécialité ?",
  timestamp: new Date(),
};
