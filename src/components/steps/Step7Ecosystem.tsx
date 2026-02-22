"use client";

import { Step7Data } from "@/types/onboarding";
import RadioOption from "@/components/ui/RadioOption";
import PlanCard from "@/components/ui/PlanCard";

interface Step7Props {
  data: Step7Data;
  onChange: (data: Step7Data) => void;
}

export default function Step7Ecosystem({ data, onChange }: Step7Props) {
  const update = (field: keyof Step7Data, value: string | number) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6">
      {/* 7.1 — Nombre d'assistants */}
      <div>
        <label className="label-field">
          Combien d&apos;assistants avez-vous besoin ?{" "}
          <span className="text-red-500">*</span>
        </label>
        <div className="space-y-2">
          <RadioOption
            name="nombreAssistants"
            value="single"
            selected={data.nombreAssistants === "single"}
            onChange={(v) => update("nombreAssistants", v)}
            label="Un seul — polyvalent, il gère tout"
          />
          <RadioOption
            name="nombreAssistants"
            value="multi"
            selected={data.nombreAssistants === "multi"}
            onChange={(v) => update("nombreAssistants", v)}
            label="Plusieurs — chacun spécialisé"
          />
        </div>

        {data.nombreAssistants === "multi" && (
          <div className="mt-3 space-y-3">
            <div>
              <label className="label-field">Combien ?</label>
              <input
                type="number"
                min={2}
                max={5}
                value={data.nombreAssistantsCount}
                onChange={(e) =>
                  update("nombreAssistantsCount", parseInt(e.target.value) || 2)
                }
                className="input-field w-24"
              />
            </div>
            <div>
              <label className="label-field">Quels rôles ?</label>
              <textarea
                value={data.nombreAssistantsRoles}
                onChange={(e) =>
                  update("nombreAssistantsRoles", e.target.value)
                }
                placeholder="ex: Un assistant juridique + un assistant administratif + un commercial"
                className="textarea-field"
                rows={2}
              />
            </div>
          </div>
        )}
      </div>

      {/* 7.2 — Coordination (si multi) */}
      {data.nombreAssistants === "multi" && (
        <div>
          <label className="label-field">Qui coordonne ?</label>
          <div className="space-y-2">
            <RadioOption
              name="coordination"
              value="manual"
              selected={data.coordination === "manual"}
              onChange={(v) => update("coordination", v)}
              label="Moi — je donne les instructions à chacun"
            />
            <RadioOption
              name="coordination"
              value="supervisor"
              selected={data.coordination === "supervisor"}
              onChange={(v) => update("coordination", v)}
              label="Un assistant principal supervise les autres"
            />
          </div>
          {data.coordination === "supervisor" && (
            <div className="mt-3">
              <label className="label-field">Lequel ?</label>
              <input
                type="text"
                value={data.coordinationDetail}
                onChange={(e) =>
                  update("coordinationDetail", e.target.value)
                }
                placeholder="ex: L'assistant juridique supervise les autres"
                className="input-field"
              />
            </div>
          )}
        </div>
      )}

      {/* 7.3 — Formule */}
      <div>
        <label className="label-field">
          Quelle formule vous convient ?{" "}
          <span className="text-red-500">*</span>
        </label>
        <div className="space-y-4 mt-3">
          <PlanCard
            name="Essentiel"
            price="69€/mois"
            description="Efficace et fiable pour les tâches courantes"
            features={["1 assistant", "Missions de base"]}
            value="starter"
            selected={data.formule === "starter"}
            onChange={(v) => update("formule", v)}
          />
          <PlanCard
            name="Professionnel"
            price="149€/mois"
            description="Haute performance, gère la complexité"
            features={[
              "1 assistant avancé",
              "Routines automatiques",
              "Sources juridiques complètes",
            ]}
            value="pro"
            selected={data.formule === "pro"}
            recommended
            onChange={(v) => update("formule", v)}
          />
          <PlanCard
            name="Cabinet"
            price="299€/mois"
            description="Le maximum de puissance"
            features={[
              "Jusqu'à 3 assistants",
              "Coordination automatique",
              "Autonomie étendue",
            ]}
            value="cabinet"
            selected={data.formule === "cabinet"}
            onChange={(v) => update("formule", v)}
          />
        </div>
        <p className="text-xs text-txt-muted text-center mt-4 italic">
          Tous les forfaits incluent un accompagnement personnalisé pour la prise
          en main.
        </p>
      </div>
    </div>
  );
}
