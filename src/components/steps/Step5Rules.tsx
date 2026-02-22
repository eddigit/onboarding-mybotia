"use client";

import { useState } from "react";
import { Check } from "lucide-react";
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
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

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
          <span className="text-red-400">*</span>
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
          <span className="text-red-400">*</span>
        </label>
        <p className="help-text mb-3">
          Cochez tout ce qui s&apos;applique. Les 3 premiers sont pré-cochés par
          défaut.
        </p>
        <div className="space-y-2">
          {INTERDIT_OPTIONS.map((option, index) => {
            const isSelected = data.interdits.includes(option.value);
            const isHovered = hoveredIndex === index;

            return (
              <label
                key={option.value}
                className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200"
                style={{
                  background: isSelected
                    ? "rgba(79,125,243,0.1)"
                    : isHovered
                      ? "rgba(255,255,255,0.06)"
                      : "rgba(255,255,255,0.03)",
                  border: isSelected
                    ? "1px solid rgba(79,125,243,0.4)"
                    : isHovered
                      ? "1px solid rgba(255,255,255,0.12)"
                      : "1px solid rgba(255,255,255,0.06)",
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleInterdit(option.value)}
                  className="sr-only"
                />
                {/* Custom checkbox square */}
                <div
                  className="w-[18px] h-[18px] rounded flex items-center justify-center flex-shrink-0 transition-all duration-200"
                  style={{
                    background: isSelected ? "#4f7df3" : "transparent",
                    border: isSelected
                      ? "2px solid #4f7df3"
                      : "2px solid rgba(255,255,255,0.2)",
                  }}
                >
                  {isSelected && <Check className="w-3 h-3 text-white" />}
                </div>
                <span className="text-sm text-txt-primary">{option.label}</span>
              </label>
            );
          })}

          {/* Autre interdit */}
          <div
            className="flex items-start gap-3 p-3 rounded-xl transition-all duration-200"
            style={{
              background: data.interditsAutre
                ? "rgba(79,125,243,0.1)"
                : "rgba(255,255,255,0.03)",
              border: data.interditsAutre
                ? "1px solid rgba(79,125,243,0.4)"
                : "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <input
              type="checkbox"
              checked={!!data.interditsAutre}
              readOnly
              className="sr-only"
            />
            {/* Custom checkbox square */}
            <div
              className="mt-1.5 w-[18px] h-[18px] rounded flex items-center justify-center flex-shrink-0 transition-all duration-200"
              style={{
                background: data.interditsAutre ? "#4f7df3" : "transparent",
                border: data.interditsAutre
                  ? "2px solid #4f7df3"
                  : "2px solid rgba(255,255,255,0.2)",
              }}
            >
              {data.interditsAutre && <Check className="w-3 h-3 text-white" />}
            </div>
            <input
              type="text"
              value={data.interditsAutre}
              onChange={(e) => update("interditsAutre", e.target.value)}
              placeholder="Autre interdit..."
              className="flex-1 text-sm text-txt-primary bg-transparent border-none
                         outline-none placeholder-txt-muted py-1"
            />
          </div>
        </div>
      </div>

      {/* 5.3 — Circuit de validation */}
      <div>
        <label className="label-field">
          Circuit de validation <span className="text-red-400">*</span>
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
          <span className="text-red-400">*</span>
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
