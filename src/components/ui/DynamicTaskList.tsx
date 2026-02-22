"use client";

import { Plus, Trash2 } from "lucide-react";
import { RecurringTask } from "@/types/onboarding";

const FREQUENCY_OPTIONS = [
  "Chaque matin",
  "Chaque lundi",
  "Chaque vendredi",
  "Le 1er du mois",
  "Le 15 du mois",
  "Personnalisé",
];

interface DynamicTaskListProps {
  tasks: RecurringTask[];
  onChange: (tasks: RecurringTask[]) => void;
  maxTasks?: number;
}

export default function DynamicTaskList({
  tasks,
  onChange,
  maxTasks = 5,
}: DynamicTaskListProps) {
  const addTask = () => {
    if (tasks.length >= maxTasks) return;
    onChange([
      ...tasks,
      { quoi: "", quand: "", quandPersonnalise: "", resultat: "" },
    ]);
  };

  const removeTask = (index: number) => {
    onChange(tasks.filter((_, i) => i !== index));
  };

  const updateTask = (
    index: number,
    field: keyof RecurringTask,
    value: string
  ) => {
    const updated = tasks.map((task, i) =>
      i === index ? { ...task, [field]: value } : task
    );
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      {tasks.map((task, index) => (
        <div
          key={index}
          className="p-4 bg-white rounded-xl border border-dark-200 space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-dark-700">
              Tâche {index + 1}
            </span>
            <button
              type="button"
              onClick={() => removeTask(index)}
              className="p-1 text-dark-400 hover:text-red-500 transition-colors"
              aria-label="Supprimer la tâche"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div>
            <label className="label-field">Quoi ?</label>
            <input
              type="text"
              value={task.quoi}
              onChange={(e) => updateTask(index, "quoi", e.target.value)}
              placeholder="ex: Vérifier les nouvelles décisions Judilibre dans mon domaine"
              className="input-field"
            />
          </div>

          <div>
            <label className="label-field">Quand ?</label>
            <select
              value={task.quand}
              onChange={(e) => updateTask(index, "quand", e.target.value)}
              className="input-field"
            >
              <option value="">Sélectionnez une fréquence</option>
              {FREQUENCY_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            {task.quand === "Personnalisé" && (
              <input
                type="text"
                value={task.quandPersonnalise}
                onChange={(e) =>
                  updateTask(index, "quandPersonnalise", e.target.value)
                }
                placeholder="ex: Tous les mercredis et vendredis"
                className="input-field mt-2"
              />
            )}
          </div>

          <div>
            <label className="label-field">Résultat attendu ?</label>
            <input
              type="text"
              value={task.resultat}
              onChange={(e) => updateTask(index, "resultat", e.target.value)}
              placeholder="ex: Un résumé de 5 lignes des décisions pertinentes"
              className="input-field"
            />
          </div>
        </div>
      ))}

      {tasks.length < maxTasks && (
        <button
          type="button"
          onClick={addTask}
          className="w-full flex items-center justify-center gap-2 p-3
                     border-2 border-dashed border-dark-300 rounded-xl
                     text-sm text-dark-500 hover:border-primary-400 hover:text-primary-600
                     transition-all duration-200"
        >
          <Plus className="w-4 h-4" />
          Ajouter une tâche récurrente
        </button>
      )}
    </div>
  );
}
