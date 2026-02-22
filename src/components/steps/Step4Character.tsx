"use client";

import { Step4Data, QualityKey } from "@/types/onboarding";
import RadioOption from "@/components/ui/RadioOption";
import RankList from "@/components/ui/RankList";

interface Step4Props {
  data: Step4Data;
  onChange: (data: Step4Data) => void;
}

export default function Step4Character({ data, onChange }: Step4Props) {
  const update = (field: keyof Step4Data, value: string | QualityKey[]) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6">
      {/* 4.1 — Ton */}
      <div>
        <label className="label-field">
          Quel ton doit-il adopter avec vous ?{" "}
          <span className="text-red-500">*</span>
        </label>
        <div className="space-y-2">
          <RadioOption
            name="ton"
            value="direct"
            selected={data.ton === "direct"}
            onChange={(v) => update("ton", v)}
            label="Direct et sans détour"
            example={`"Ce projet de conclusions a 3 faiblesses : voici lesquelles."`}
          />
          <RadioOption
            name="ton"
            value="diplomate"
            selected={data.ton === "diplomate"}
            onChange={(v) => update("ton", v)}
            label="Professionnel et diplomate"
            example={`"Ce projet est solide sur le fond, je suggère toutefois de renforcer 3 points."`}
          />
          <RadioOption
            name="ton"
            value="pedagogue"
            selected={data.ton === "pedagogue"}
            onChange={(v) => update("ton", v)}
            label="Pédagogue et patient"
            example={`"Voici le résultat. Je vous explique ma démarche étape par étape pour que vous puissiez valider."`}
          />
        </div>
      </div>

      {/* 4.2 — Gestion erreurs */}
      <div>
        <label className="label-field">
          Quand il se trompe, comment doit-il réagir ?{" "}
          <span className="text-red-500">*</span>
        </label>
        <div className="space-y-2">
          <RadioOption
            name="gestionErreurs"
            value="silent_fix"
            selected={data.gestionErreurs === "silent_fix"}
            onChange={(v) => update("gestionErreurs", v)}
            label="Corriger immédiatement sans commentaire"
          />
          <RadioOption
            name="gestionErreurs"
            value="brief_explain"
            selected={data.gestionErreurs === "brief_explain"}
            onChange={(v) => update("gestionErreurs", v)}
            label="Me dire brièvement ce qui s'est passé, corriger, avancer"
          />
          <RadioOption
            name="gestionErreurs"
            value="full_explain"
            selected={data.gestionErreurs === "full_explain"}
            onChange={(v) => update("gestionErreurs", v)}
            label="M'expliquer en détail pour que je comprenne et que ça ne se reproduise pas"
          />
        </div>
      </div>

      {/* 4.3 — Challenge */}
      <div>
        <label className="label-field">
          Doit-il vous challenger ?{" "}
          <span className="text-red-500">*</span>
        </label>
        <div className="space-y-2">
          <RadioOption
            name="challenge"
            value="no_challenge"
            selected={data.challenge === "no_challenge"}
            onChange={(v) => update("challenge", v)}
            label="Non — il exécute ce que je demande"
          />
          <RadioOption
            name="challenge"
            value="moderate_challenge"
            selected={data.challenge === "moderate_challenge"}
            onChange={(v) => update("challenge", v)}
            label="Oui, modérément — il signale un risque s'il en voit un"
            example={`"Attention, cette stratégie pourrait être contestée au motif que..."`}
          />
          <RadioOption
            name="challenge"
            value="strong_challenge"
            selected={data.challenge === "strong_challenge"}
            onChange={(v) => update("challenge", v)}
            label="Oui, fortement — je veux qu'il me dise quand je fais fausse route"
            example={`"Je déconseille cette approche. Voici pourquoi et voici mon alternative."`}
          />
        </div>
      </div>

      {/* 4.4 — Classement qualités */}
      <div>
        <label className="label-field">
          Classez ces qualités par ordre d&apos;importance{" "}
          <span className="text-red-500">*</span>
        </label>
        <RankList
          items={data.qualitesClassement}
          onChange={(items) => update("qualitesClassement", items)}
        />
      </div>
    </div>
  );
}
