"use client";

import { Step3Data, RoleType } from "@/types/onboarding";
import CheckboxGroup from "@/components/ui/CheckboxGroup";
import ExampleHint from "@/components/ui/ExampleHint";

const MISSION_PLACEHOLDERS: Record<
  string,
  { m1: string; m2: string; m3: string }
> = {
  juridique: {
    m1: "ex: Rechercher la jurisprudence pertinente sur Judilibre et me faire une synthèse de 10 lignes",
    m2: "ex: Rédiger des projets de conclusions à partir de mes notes",
    m3: "ex: Préparer des chronologies de faits pour chaque dossier",
  },
  admin: {
    m1: "ex: Rédiger et envoyer les courriers de relance clients",
    m2: "ex: Tenir à jour le tableau de suivi des dossiers et échéances",
    m3: "ex: Préparer les factures et suivre les impayés",
  },
  commercial: {
    m1: "ex: Identifier des prospects avocats sur LinkedIn",
    m2: "ex: Rédiger des messages de prospection personnalisés",
    m3: "ex: Suivre les relances et qualifier les leads",
  },
  polyvalent: {
    m1: "ex: Recherche juridique et synthèse de jurisprudence",
    m2: "ex: Suivi des échéances et gestion des relances",
    m3: "ex: Préparation des documents pour les audiences",
  },
  autre: {
    m1: "ex: Décrivez la première mission principale",
    m2: "ex: Décrivez la deuxième mission principale",
    m3: "ex: Décrivez la troisième mission principale",
  },
};

const SOURCES_OPTIONS = [
  { label: "Légifrance", value: "legifrance" },
  { label: "Judilibre", value: "judilibre" },
  { label: "EUR-Lex / CJUE / CEDH", value: "eurlex" },
  { label: "Doctrine.fr", value: "doctrine" },
  { label: "Dalloz", value: "dalloz" },
  { label: "LexisNexis", value: "lexisnexis" },
  { label: "Code du travail (spécifique)", value: "code_travail" },
  { label: "Code civil (spécifique)", value: "code_civil" },
  { label: "Code de commerce (spécifique)", value: "code_commerce" },
];

interface Step3Props {
  data: Step3Data;
  role: RoleType | "";
  onChange: (data: Step3Data) => void;
}

export default function Step3Missions({ data, role, onChange }: Step3Props) {
  const placeholders = MISSION_PLACEHOLDERS[role || "autre"] || MISSION_PLACEHOLDERS.autre;

  const update = (field: keyof Step3Data, value: string | string[]) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6">
      {/* 3.1 — 3 missions principales */}
      <div>
        <label className="label-field">
          Quelles sont ses 3 missions principales ?{" "}
          <span className="text-red-500">*</span>
        </label>

        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-dark-500 mb-1 block">
              Mission 1
            </label>
            <input
              type="text"
              value={data.mission1}
              onChange={(e) => update("mission1", e.target.value)}
              placeholder={placeholders.m1}
              className="input-field"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-dark-500 mb-1 block">
              Mission 2
            </label>
            <input
              type="text"
              value={data.mission2}
              onChange={(e) => update("mission2", e.target.value)}
              placeholder={placeholders.m2}
              className="input-field"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-dark-500 mb-1 block">
              Mission 3
            </label>
            <input
              type="text"
              value={data.mission3}
              onChange={(e) => update("mission3", e.target.value)}
              placeholder={placeholders.m3}
              className="input-field"
            />
          </div>
        </div>
      </div>

      {/* 3.2 — Missions bonus */}
      <div>
        <label className="label-field">Missions bonus (optionnel)</label>
        <textarea
          value={data.missionsBonus}
          onChange={(e) => update("missionsBonus", e.target.value)}
          placeholder="ex: Veille juridique hebdomadaire sur mon domaine"
          className="textarea-field"
          rows={3}
        />
        <p className="help-text">
          Des tâches secondaires qu&apos;il pourrait prendre en charge.
        </p>
        <ExampleHint
          examples={[
            "Veille juridique hebdomadaire sur mon domaine",
            "Résumé quotidien de mes emails importants",
            "Traduction de documents anglais-français",
            "Préparation des notes d'honoraires",
          ]}
        />
      </div>

      {/* 3.3 — Sources */}
      <div>
        <label className="label-field">
          Quelles sources doit-il utiliser ?{" "}
          <span className="text-red-500">*</span>
        </label>
        <p className="help-text mb-3">Sélectionnez au moins une source.</p>
        <CheckboxGroup
          options={SOURCES_OPTIONS}
          selected={data.sources}
          onChange={(selected) => update("sources", selected)}
          showOther
          otherValue={data.sourcesAutre}
          onOtherChange={(value) => update("sourcesAutre", value)}
          otherPlaceholder="Autre source..."
        />
      </div>
    </div>
  );
}
