"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { OnboardingState } from "@/types/onboarding";
import RecapSection from "./RecapSection";
import RecapProgress from "./RecapProgress";

interface SidebarRecapProps {
  state: OnboardingState;
  isOpen: boolean;
  onClose: () => void;
}

function buildSections(state: OnboardingState) {
  const { profil, identite_agent, missions, caractere, regles, routine, ecosysteme } = state;

  const tonLabels: Record<string, string> = {
    direct: "Direct",
    diplomate: "Diplomate",
    pedagogue: "Pédagogue",
  };
  const errorLabels: Record<string, string> = {
    silent_fix: "Correction silencieuse",
    brief_explain: "Explication brève",
    full_explain: "Explication détaillée",
  };
  const challengeLabels: Record<string, string> = {
    no_challenge: "Pas de challenge",
    moderate_challenge: "Modéré",
    strong_challenge: "Fort",
  };
  const confLabels: Record<string, string> = {
    high: "Haute",
    partial: "Partielle",
    low: "Faible",
  };
  const planLabels: Record<string, string> = {
    starter: "Essentiel (69€/mois)",
    pro: "Professionnel (149€/mois)",
    cabinet: "Cabinet (299€/mois)",
  };

  return [
    {
      id: "profil",
      label: "Profil",
      icon: "user",
      completed: !!(profil.metier && profil.specialite && profil.cabinet),
      fields: [
        { label: "Métier", value: profil.metier },
        { label: "Spécialité", value: profil.specialite },
        { label: "Cabinet", value: profil.cabinet },
      ],
    },
    {
      id: "agent",
      label: "Assistant",
      icon: "bot",
      completed: !!(identite_agent.prenom && identite_agent.role),
      fields: [
        { label: "Prénom", value: identite_agent.prenom },
        { label: "Rôle", value: identite_agent.role },
        { label: "Profil", value: identite_agent.profil_comportemental },
      ],
    },
    {
      id: "missions",
      label: "Missions",
      icon: "target",
      completed: !!(missions.principale_1 && missions.principale_2 && missions.principale_3),
      fields: [
        { label: "Mission 1", value: missions.principale_1 },
        { label: "Mission 2", value: missions.principale_2 },
        { label: "Mission 3", value: missions.principale_3 },
        { label: "Sources", value: missions.sources.length > 0 ? missions.sources.join(", ") : null },
      ],
    },
    {
      id: "caractere",
      label: "Caractère",
      icon: "palette",
      completed: !!(caractere.ton && caractere.gestion_erreurs && caractere.challenge),
      fields: [
        { label: "Ton", value: caractere.ton ? tonLabels[caractere.ton] || caractere.ton : null },
        { label: "Erreurs", value: caractere.gestion_erreurs ? errorLabels[caractere.gestion_erreurs] || caractere.gestion_erreurs : null },
        { label: "Challenge", value: caractere.challenge ? challengeLabels[caractere.challenge] || caractere.challenge : null },
      ],
    },
    {
      id: "regles",
      label: "Règles",
      icon: "shield",
      completed: !!(regles.confidentialite && regles.validation),
      fields: [
        { label: "Confidentialité", value: regles.confidentialite ? confLabels[regles.confidentialite] || regles.confidentialite : null },
        { label: "Interdits", value: regles.interdits.length > 0 ? `${regles.interdits.length} règle(s)` : null },
        { label: "Validation", value: regles.validation },
      ],
    },
    {
      id: "routine",
      label: "Routine",
      icon: "calendar",
      completed: !!(routine.taches.length > 0 || routine.rituel_matin),
      fields: [
        { label: "Tâches", value: routine.taches.length > 0 ? `${routine.taches.length} tâche(s)` : null },
        { label: "Rituel matin", value: routine.rituel_matin },
      ],
    },
    {
      id: "ecosysteme",
      label: "Écosystème",
      icon: "users",
      completed: !!(ecosysteme.formule),
      fields: [
        { label: "Agents", value: ecosysteme.nombre_agents === "single" ? "1 agent" : ecosysteme.nombre_agents === "multi" ? "Multi-agents" : null },
        { label: "Formule", value: ecosysteme.formule ? planLabels[ecosysteme.formule] || ecosysteme.formule : null },
      ],
    },
  ];
}

export default function SidebarRecap({
  state,
  isOpen,
  onClose,
}: SidebarRecapProps) {
  const sections = buildSections(state);
  const completed = sections.filter((s) => s.completed).length;
  const total = sections.length;

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <h2 className="text-sm font-bold text-txt-primary">
          Votre assistant
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="lg:hidden p-1.5 rounded-lg transition-colors hover:bg-white/5"
        >
          <X className="w-4 h-4 text-txt-muted" />
        </button>
      </div>

      <div className="px-4">
        <RecapProgress completed={completed} total={total} />
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2 scrollbar-thin">
        {sections.map((section) => (
          <RecapSection
            key={section.id}
            id={section.id}
            label={section.label}
            icon={section.icon}
            fields={section.fields}
            completed={section.completed}
          />
        ))}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className="hidden lg:block w-72 flex-shrink-0 rounded-2xl overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, rgba(15,20,50,0.7) 0%, rgba(10,14,35,0.85) 100%)",
          border: "1px solid rgba(255,255,255,0.06)",
          backdropFilter: "blur(20px)",
        }}
      >
        {sidebarContent}
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 z-40 bg-black/60"
              onClick={onClose}
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="lg:hidden fixed right-0 top-0 bottom-0 w-80 max-w-[85vw] z-50"
              style={{
                background:
                  "linear-gradient(135deg, rgba(15,20,50,0.95) 0%, rgba(10,14,35,0.98) 100%)",
                borderLeft: "1px solid rgba(255,255,255,0.06)",
                backdropFilter: "blur(20px)",
              }}
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
