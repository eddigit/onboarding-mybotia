"use client";

import { Step5Data } from "@/types/onboarding";
import RadioOption from "@/components/ui/RadioOption";
import InfoBox from "@/components/ui/InfoBox";

const INTERDIT_OPTIONS = [
  {
    label: "Ne jamais donner de conseil juridique définitif à un tiers",
    value: "Ne jamais donner de conseil juridique définitif à un tiers",
  },
  {
    label: "Ne jamais engager le cabinet auprès d'un client",
    value: "Ne jamais engager le cabinet auprès d'un client",
  },
  {
    label: "Ne jamais commenter un dossier en cours à l'extérieur",
    value: "Ne jamais commenter un dossier en cours à l'extérieur",
  },
  {
    label: "Ne jamais communiquer nos tarifs",
    value: "Ne jamais communiquer nos tarifs",
  },
  {
    label: "Ne jamais contacter un client sans ma validation",
    value: "Ne jamais contacter un client sans ma validation",
  },
  {
    label: "Ne jamais écrire de mail au client sans que je relise",
    value: "Ne jamais écrire de mail au client sans que je relise",
  },
  {
    label: "Ne jamais mentionner le nom d'un autre client",
    value: "Ne jamais mentionner le nom d'un autre client",
  },
  {
    label: "Ne jamais promettre un délai sans mon accord",
    value: "Ne jamais promettre un délai sans mon accord",
  },
];

interface Step5Props {
  data: Step5Data;
  onChange: (data: Step5Data) => void;
}

export default function Step5Rules({ data, onChange }: Step5Props) {
  const update = (field: keyof Step5Data, value: string | string[]) => {
    onChange({ ...data, [field]: value });
  };

  const toggleInterdit = (value: string) => {
    if (data.interdits.includes(value)) {
      update(
        "interdits",
        data.interdits.filter((v) => v !== value)
      );
    } else {
      update("interdits", [...data.interdits, value]);
    }
  };

  return (
    <div className="space-y-6">
      <InfoBox>
        Ces règles sont gravées dans le marbre de votre assistant. Il ne pourra
        pas les transgresser. Prenez le temps de bien les définir.
      </InfoBox>

      {/* 5.1 — Confidentialité */}
      <div>
        <label className="label-field">
          Manipulera-t-il des informations confidentielles ?{" "}
          <span className="text-red-500">*</span>
        </label>
        <div className="space-y-2">
          <RadioOption
            name="confidentialite"
            value="high"
            selected={data.confidentialite === "high"}
            onChange={(v) => update("confidentialite", v)}
            label="Oui — dossiers clients, données sensibles, stratégie"
          />
          <RadioOption
            name="confidentialite"
            value="partial"
            selected={data.confidentialite === "partial"}
            onChange={(v) => update("confidentialite", v)}
            label="Partiellement — certains documents seulement"
          />
          <RadioOption
            name="confidentialite"
            value="low"
            selected={data.confidentialite === "low"}
            onChange={(v) => update("confidentialite", v)}
            label="Non — tout est interne ou non sensible"
          />
        </div>
      </div>

      {/* 5.2 — Interdits */}
      <div>
        <label className="label-field">
          Sujets INTERDITS pour votre assistant{" "}
          <span className="text-red-500">*</span>
        </label>
        <p className="help-text mb-3">
          Cochez tout ce qui s&apos;applique. Les 3 premiers sont pré-cochés par
          défaut.
        </p>
        <div className="space-y-2">
          {INTERDIT_OPTIONS.map((option) => (
            <label
              key={option.value}
              className={`
                flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer
                transition-all duration-200
                ${
                  data.interdits.includes(option.value)
                    ? "border-primary-500 bg-primary-50"
                    : "border-dark-200 bg-white hover:border-dark-300"
                }
              `}
            >
              <input
                type="checkbox"
                checked={data.interdits.includes(option.value)}
                onChange={() => toggleInterdit(option.value)}
                className="w-4 h-4 rounded text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-dark-800">{option.label}</span>
            </label>
          ))}

          {/* Autre interdit */}
          <div
            className={`
              flex items-start gap-3 p-3 rounded-xl border-2
              transition-all duration-200
              ${
                data.interditsAutre
                  ? "border-primary-500 bg-primary-50"
                  : "border-dark-200 bg-white"
              }
            `}
          >
            <input
              type="checkbox"
              checked={!!data.interditsAutre}
              readOnly
              className="mt-2 w-4 h-4 rounded text-primary-600 focus:ring-primary-500"
            />
            <input
              type="text"
              value={data.interditsAutre}
              onChange={(e) => update("interditsAutre", e.target.value)}
              placeholder="Autre interdit..."
              className="flex-1 text-sm text-dark-800 bg-transparent border-none
                         outline-none placeholder-dark-400 py-1"
            />
          </div>
        </div>
      </div>

      {/* 5.3 — Circuit de validation */}
      <div>
        <label className="label-field">
          Circuit de validation <span className="text-red-500">*</span>
        </label>
        <div className="space-y-2">
          <RadioOption
            name="validation"
            value="direct"
            selected={data.validation === "direct"}
            onChange={(v) => update("validation", v)}
            label="Non — il me répond directement, je suis le seul interlocuteur"
          />
          <RadioOption
            name="validation"
            value="validation"
            selected={data.validation === "validation"}
            onChange={(v) => update("validation", v)}
            label="Oui — certaines actions doivent être validées avant exécution"
          />
        </div>
        {data.validation === "validation" && (
          <div className="mt-3">
            <textarea
              value={data.validationDetail}
              onChange={(e) => update("validationDetail", e.target.value)}
              placeholder="ex: Tout email sortant doit être validé par moi. Les recherches sont en autonomie."
              className="textarea-field"
              rows={3}
            />
          </div>
        )}
      </div>

      {/* 5.4 — Communication */}
      <div>
        <label className="label-field">
          Communication avec d&apos;autres personnes{" "}
          <span className="text-red-500">*</span>
        </label>
        <div className="space-y-2">
          <RadioOption
            name="communication"
            value="solo"
            selected={data.communication === "solo"}
            onChange={(v) => update("communication", v)}
            label="Non — uniquement avec moi"
          />
          <RadioOption
            name="communication"
            value="team"
            selected={data.communication === "team"}
            onChange={(v) => update("communication", v)}
            label="Avec mon équipe / associés"
          />
          <RadioOption
            name="communication"
            value="external"
            selected={data.communication === "external"}
            onChange={(v) => update("communication", v)}
            label="Avec des clients ou des tiers"
          />
        </div>
        {data.communication === "team" && (
          <div className="mt-3">
            <textarea
              value={data.communicationDetail}
              onChange={(e) => update("communicationDetail", e.target.value)}
              placeholder="ex: Mon secrétariat pour les questions de planning"
              className="textarea-field"
              rows={2}
            />
          </div>
        )}
        {data.communication === "external" && (
          <div className="mt-3">
            <textarea
              value={data.communicationDetail}
              onChange={(e) => update("communicationDetail", e.target.value)}
              placeholder="ex: Réponses aux demandes simples des clients, jamais sur le fond du dossier"
              className="textarea-field"
              rows={2}
            />
            <p className="help-text">
              Précisez les limites — que peut-il dire, que ne peut-il pas dire ?
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
