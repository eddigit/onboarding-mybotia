"use client";

import { Step6Data, RecurringTask } from "@/types/onboarding";
import RadioOption from "@/components/ui/RadioOption";
import DynamicTaskList from "@/components/ui/DynamicTaskList";
import InfoBox from "@/components/ui/InfoBox";
import ExampleHint from "@/components/ui/ExampleHint";

interface Step6Props {
  data: Step6Data;
  onChange: (data: Step6Data) => void;
}

export default function Step6Routine({ data, onChange }: Step6Props) {
  const update = (
    field: keyof Step6Data,
    value: boolean | null | RecurringTask[] | string
  ) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6">
      {/* 6.1 — Tâches récurrentes */}
      <div>
        <label className="label-field">
          Votre assistant a-t-il des tâches récurrentes ?{" "}
          <span className="text-red-500">*</span>
        </label>
        <div className="space-y-2">
          <RadioOption
            name="hasTachesRecurrentes"
            value="true"
            selected={data.hasTachesRecurrentes === true}
            onChange={() => {
              update("hasTachesRecurrentes", true);
              if (data.tachesRecurrentes.length === 0) {
                update("tachesRecurrentes", [
                  {
                    quoi: "",
                    quand: "",
                    quandPersonnalise: "",
                    resultat: "",
                  },
                ]);
              }
            }}
            label="Oui"
          />
          <RadioOption
            name="hasTachesRecurrentes"
            value="false"
            selected={data.hasTachesRecurrentes === false}
            onChange={() => update("hasTachesRecurrentes", false)}
            label="Non, je lui donnerai les instructions au fil de l'eau"
          />
        </div>
      </div>

      {data.hasTachesRecurrentes === true && (
        <>
          <InfoBox variant="info">
            <strong>Exemples de tâches récurrentes :</strong>
            <ul className="mt-2 space-y-1 list-disc list-inside">
              <li>Chaque lundi : récap des échéances de la semaine</li>
              <li>Chaque matin : signaler les emails urgents</li>
              <li>Chaque vendredi : synthèse de l&apos;avancement des dossiers</li>
              <li>Tous les 15 du mois : rappel des factures impayées</li>
            </ul>
          </InfoBox>

          <DynamicTaskList
            tasks={data.tachesRecurrentes}
            onChange={(tasks) => update("tachesRecurrentes", tasks)}
          />
        </>
      )}

      {/* 6.2 — Rituel matin */}
      <div>
        <label className="label-field">
          Rituel de début de journée (optionnel)
        </label>
        <textarea
          value={data.rituelMatin}
          onChange={(e) => update("rituelMatin", e.target.value)}
          placeholder="ex: Toujours commencer par me donner les 3 priorités du jour"
          className="textarea-field"
          rows={3}
        />
        <ExampleHint
          examples={[
            "Me donner les 3 priorités du jour",
            "Vérifier le calendrier des audiences de la semaine",
            "Me résumer les derniers échanges email avec le client principal",
          ]}
        />
      </div>
    </div>
  );
}
