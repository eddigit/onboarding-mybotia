"use client";

import { Step1Data } from "@/types/onboarding";
import RadioOption from "@/components/ui/RadioOption";
import ExampleHint from "@/components/ui/ExampleHint";

interface Step1Props {
  data: Step1Data;
  onChange: (data: Step1Data) => void;
}

export default function Step1Profile({ data, onChange }: Step1Props) {
  const update = (field: keyof Step1Data, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6">
      {/* 1.1 — Métier */}
      <div>
        <label className="label-field">
          Quel est votre métier ? <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={data.metier}
          onChange={(e) => update("metier", e.target.value)}
          placeholder="ex: Avocat en droit des affaires"
          className="input-field"
        />
        <p className="help-text">
          Soyez précis — cela détermine la spécialisation de votre assistant.
        </p>
        <ExampleHint
          examples={[
            "Avocat en droit des affaires",
            "Avocate pénaliste",
            "Notaire associé",
            "Directrice juridique PME",
          ]}
        />
      </div>

      {/* 1.2 — Spécialité */}
      <div>
        <label className="label-field">
          Quel est votre domaine de spécialité ?{" "}
          <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={data.specialite}
          onChange={(e) => update("specialite", e.target.value)}
          placeholder="ex: Droit du travail côté employeur"
          className="input-field"
        />
        <ExampleHint
          examples={[
            "Droit du travail côté employeur",
            "M&A et restructurations",
            "Contentieux commercial",
            "Droit de la famille — divorces complexes",
            "Droit pénal des affaires",
          ]}
        />
      </div>

      {/* 1.3 — Cabinet */}
      <div>
        <label className="label-field">
          Décrivez votre cabinet en une phrase{" "}
          <span className="text-red-400">*</span>
        </label>
        <textarea
          value={data.cabinet}
          onChange={(e) => {
            if (e.target.value.length <= 200) update("cabinet", e.target.value);
          }}
          placeholder="ex: Cabinet individuel, 120 dossiers actifs, clientèle PME"
          className="textarea-field"
          rows={2}
        />
        <div className="flex justify-between mt-1">
          <ExampleHint
            examples={[
              "Cabinet individuel, 120 dossiers actifs, clientèle PME",
              "Associée dans un cabinet de 5 avocats, spécialisé contentieux",
            ]}
          />
          <span className="text-xs text-txt-muted flex-shrink-0 ml-2">
            {data.cabinet.length}/200
          </span>
        </div>
      </div>

      {/* 1.4 — Niveau technique */}
      <div>
        <label className="label-field">
          Êtes-vous à l&apos;aise avec les outils numériques ?{" "}
          <span className="text-red-400">*</span>
        </label>
        <div className="space-y-2">
          <RadioOption
            name="niveauTechnique"
            value="basic"
            selected={data.niveauTechnique === "basic"}
            onChange={(v) => update("niveauTechnique", v)}
            label="J'utilise le strict minimum (email, Word)"
          />
          <RadioOption
            name="niveauTechnique"
            value="intermediate"
            selected={data.niveauTechnique === "intermediate"}
            onChange={(v) => update("niveauTechnique", v)}
            label="Je suis à l'aise avec les outils courants (agenda en ligne, outils collaboratifs)"
          />
          <RadioOption
            name="niveauTechnique"
            value="advanced"
            selected={data.niveauTechnique === "advanced"}
            onChange={(v) => update("niveauTechnique", v)}
            label="J'utilise déjà des outils avancés (automatisations, IA, gestion de projet)"
          />
        </div>
      </div>

      {/* 1.5 — Langue */}
      <div>
        <label className="label-field">
          Langue de travail <span className="text-red-400">*</span>
        </label>
        <div className="space-y-2">
          <RadioOption
            name="langue"
            value="fr"
            selected={data.langue === "fr"}
            onChange={(v) => update("langue", v)}
            label="Français uniquement"
          />
          <RadioOption
            name="langue"
            value="fr_en"
            selected={data.langue === "fr_en"}
            onChange={(v) => update("langue", v)}
            label="Français + anglais professionnel"
          />
          <RadioOption
            name="langue"
            value="multilingual"
            selected={data.langue === "multilingual"}
            onChange={(v) => update("langue", v)}
            label="Multilingue"
          />
        </div>
        {data.langue === "multilingual" && (
          <div className="mt-3">
            <input
              type="text"
              value={data.languesDetail}
              onChange={(e) => update("languesDetail", e.target.value)}
              placeholder="Précisez les langues (ex: français, anglais, allemand)"
              className="input-field"
            />
          </div>
        )}
      </div>
    </div>
  );
}
