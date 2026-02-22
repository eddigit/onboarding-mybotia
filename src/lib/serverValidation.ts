import { z } from "zod";

export const onboardingSchema = z.object({
  clientName: z.string().min(1, "Le nom est requis").max(200),
  clientEmail: z.string().email("Email invalide"),

  step1: z.object({
    metier: z.string().min(1).max(500),
    specialite: z.string().min(1).max(500),
    cabinet: z.string().min(1).max(200),
    niveauTechnique: z.enum(["basic", "intermediate", "advanced"]),
    langue: z.enum(["fr", "fr_en", "multilingual"]),
    languesDetail: z.string().max(500).default(""),
  }),

  step2: z.object({
    prenomAgent: z.string().min(1).max(100),
    role: z.enum(["juridique", "admin", "commercial", "polyvalent", "autre"]),
    roleDetail: z.string().max(500).default(""),
    personnalite: z.enum(["methodique", "proactif", "creatif", "executant"]),
  }),

  step3: z.object({
    mission1: z.string().min(1).max(1000),
    mission2: z.string().min(1).max(1000),
    mission3: z.string().min(1).max(1000),
    missionsBonus: z.string().max(2000).default(""),
    sources: z.array(z.string()).default([]),
    sourcesAutre: z.string().max(500).default(""),
  }),

  step4: z.object({
    ton: z.enum(["direct", "diplomate", "pedagogue"]),
    gestionErreurs: z.enum(["silent_fix", "brief_explain", "full_explain"]),
    challenge: z.enum(["no_challenge", "moderate_challenge", "strong_challenge"]),
    qualitesClassement: z
      .array(
        z.enum(["exactitude", "rapidite", "initiative", "discretion", "clarte"])
      )
      .length(5),
  }),

  step5: z.object({
    confidentialite: z.enum(["high", "partial", "low"]),
    interdits: z.array(z.string()).min(1),
    interditsAutre: z.string().max(500).default(""),
    validation: z.enum(["direct", "validation"]),
    validationDetail: z.string().max(2000).default(""),
    communication: z.enum(["solo", "team", "external"]),
    communicationDetail: z.string().max(2000).default(""),
  }),

  step6: z.object({
    hasTachesRecurrentes: z.boolean().nullable(),
    tachesRecurrentes: z
      .array(
        z.object({
          quoi: z.string().max(500),
          quand: z.string().max(200),
          quandPersonnalise: z.string().max(200).default(""),
          resultat: z.string().max(500),
        })
      )
      .default([]),
    rituelMatin: z.string().max(2000).default(""),
  }),

  step7: z.object({
    nombreAssistants: z.enum(["single", "multi"]),
    nombreAssistantsCount: z.number().min(1).max(10).default(1),
    nombreAssistantsRoles: z.string().max(1000).default(""),
    coordination: z.enum(["manual", "supervisor", ""]).default(""),
    coordinationDetail: z.string().max(500).default(""),
    formule: z.enum(["starter", "pro", "cabinet"]),
  }),
});

export type ValidatedOnboardingData = z.infer<typeof onboardingSchema>;
