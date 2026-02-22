"use client";

import { Step2Data, RoleType } from "@/types/onboarding";
import RadioOption from "@/components/ui/RadioOption";

const NAME_SUGGESTIONS = ["Léa", "Jules", "Clara", "Max", "Alex", "Nina"];

const ROLE_EXAMPLES: Record<string, string> = {
  juridique:
    "Mon assistant pour la recherche de jurisprudence et la rédaction de projets de conclusions",
  admin: "Mon assistant pour le suivi des échéances, la facturation et les relances clients",
  commercial:
    "Mon commercial qui prospecte sur LinkedIn et gère les relances",
  polyvalent:
    "Mon assistant qui gère la recherche juridique ET le suivi administratif",
  autre: "Décrivez le rôle que vous souhaitez",
};

interface Step2Props {
  data: Step2Data;
  onChange: (data: Step2Data) => void;
}

export default function Step2Assistant({ data, onChange }: Step2Props) {
  const update = (field: keyof Step2Data, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6">
      {/* 2.1 — Prénom */}
      <div>
        <label className="label-field">
          Donnez un prénom à votre assistant{" "}
          <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={data.prenomAgent}
          onChange={(e) => update("prenomAgent", e.target.value)}
          placeholder="ex: Léa"
          className="input-field"
        />
        <p className="help-text">
          Choisissez un prénom qui vous parle. Certains préfèrent un prénom
          neutre, d&apos;autres quelque chose de plus personnel.
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {NAME_SUGGESTIONS.map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => update("prenomAgent", name)}
              className={`px-3 py-1.5 rounded-full text-sm transition-all duration-200 ${
                data.prenomAgent === name
                  ? "bg-gradient-to-r from-accent-blue to-accent-indigo text-white"
                  : "text-txt-secondary hover:text-txt-primary"
              }`}
              style={
                data.prenomAgent === name
                  ? undefined
                  : {
                      background: "rgba(255,255,255,0.06)",
                    }
              }
              onMouseEnter={(e) => {
                if (data.prenomAgent !== name) {
                  (e.target as HTMLButtonElement).style.background = "rgba(255,255,255,0.1)";
                }
              }}
              onMouseLeave={(e) => {
                if (data.prenomAgent !== name) {
                  (e.target as HTMLButtonElement).style.background = "rgba(255,255,255,0.06)";
                }
              }}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      {/* 2.2 — Rôle */}
      <div>
        <label className="label-field">
          Quel est son rôle principal ?{" "}
          <span className="text-red-400">*</span>
        </label>
        <div className="space-y-2">
          <RadioOption
            name="role"
            value="juridique"
            selected={data.role === "juridique"}
            onChange={(v) => update("role", v)}
            label="Assistant juridique — recherche, rédaction, synthèse"
          />
          <RadioOption
            name="role"
            value="admin"
            selected={data.role === "admin"}
            onChange={(v) => update("role", v)}
            label="Assistant administratif — gestion cabinet, courriers, suivi dossiers"
          />
          <RadioOption
            name="role"
            value="commercial"
            selected={data.role === "commercial"}
            onChange={(v) => update("role", v)}
            label="Assistant commercial — prospection, suivi clients, relances"
          />
          <RadioOption
            name="role"
            value="polyvalent"
            selected={data.role === "polyvalent"}
            onChange={(v) => update("role", v)}
            label="Assistant polyvalent — un peu de tout"
          />
          <RadioOption
            name="role"
            value="autre"
            selected={data.role === "autre"}
            onChange={(v) => update("role", v)}
            label="Autre"
          />
        </div>

        {data.role && (
          <div className="mt-3">
            <label className="label-field">Précisez en une phrase</label>
            <input
              type="text"
              value={data.roleDetail}
              onChange={(e) => update("roleDetail", e.target.value)}
              placeholder={
                ROLE_EXAMPLES[data.role as RoleType] ||
                "ex: Mon bras droit pour la rédaction de conclusions"
              }
              className="input-field"
            />
          </div>
        )}
      </div>

      {/* 2.3 — Personnalité */}
      <div>
        <label className="label-field">
          Si votre assistant était un collaborateur, il serait plutôt :{" "}
          <span className="text-red-400">*</span>
        </label>
        <div className="space-y-2">
          <RadioOption
            name="personnalite"
            value="methodique"
            selected={data.personnalite === "methodique"}
            onChange={(v) => update("personnalite", v)}
            label="Le méthodique"
            description="Organisé, rigoureux, ne laisse rien passer. Il tient vos deadlines, vérifie chaque détail, structure tout."
          />
          <RadioOption
            name="personnalite"
            value="proactif"
            selected={data.personnalite === "proactif"}
            onChange={(v) => update("personnalite", v)}
            label="Le proactif"
            description="Anticipe vos besoins, propose des solutions. Il vous dit 'vous avez une audience dans 3 jours, voici le résumé du dossier' avant que vous ne demandiez."
          />
          <RadioOption
            name="personnalite"
            value="creatif"
            selected={data.personnalite === "creatif"}
            onChange={(v) => update("personnalite", v)}
            label="Le créatif"
            description="Trouve des angles nouveaux, reformule, innove. Il propose des tournures ou des approches auxquelles vous n'auriez pas pensé."
          />
          <RadioOption
            name="personnalite"
            value="executant"
            selected={data.personnalite === "executant"}
            onChange={(v) => update("personnalite", v)}
            label="L'exécutant fiable"
            description="Fait exactement ce qu'on lui demande, vite et bien. Vous donnez une consigne précise, il livre. Pas de questions inutiles."
          />
        </div>
      </div>
    </div>
  );
}
