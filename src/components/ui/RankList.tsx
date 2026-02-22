"use client";

import { GripVertical, ChevronUp, ChevronDown } from "lucide-react";
import { QualityKey } from "@/types/onboarding";

const QUALITY_LABELS: Record<QualityKey, string> = {
  exactitude: "Exactitude (zéro erreur)",
  rapidite: "Rapidité (livraison rapide)",
  initiative: "Initiative (propose sans qu'on demande)",
  discretion: "Discrétion (confidentialité absolue)",
  clarte: "Clarté (explications limpides)",
};

interface RankListProps {
  items: QualityKey[];
  onChange: (items: QualityKey[]) => void;
}

export default function RankList({ items, onChange }: RankListProps) {
  const moveUp = (index: number) => {
    if (index === 0) return;
    const newItems = [...items];
    [newItems[index - 1], newItems[index]] = [
      newItems[index],
      newItems[index - 1],
    ];
    onChange(newItems);
  };

  const moveDown = (index: number) => {
    if (index === items.length - 1) return;
    const newItems = [...items];
    [newItems[index], newItems[index + 1]] = [
      newItems[index + 1],
      newItems[index],
    ];
    onChange(newItems);
  };

  return (
    <div className="space-y-2">
      <p className="text-xs text-dark-500 mb-3">
        Utilisez les flèches pour classer par ordre d&apos;importance (1 = le
        plus important)
      </p>
      {items.map((item, index) => (
        <div
          key={item}
          className="flex items-center gap-3 p-3 bg-white rounded-xl border-2 border-dark-200"
        >
          <GripVertical className="w-4 h-4 text-dark-400 flex-shrink-0" />
          <span className="w-6 h-6 flex items-center justify-center rounded-full bg-primary-100 text-primary-700 text-xs font-bold flex-shrink-0">
            {index + 1}
          </span>
          <span className="flex-1 text-sm text-dark-800">
            {QUALITY_LABELS[item]}
          </span>
          <div className="flex flex-col gap-0.5">
            <button
              type="button"
              onClick={() => moveUp(index)}
              disabled={index === 0}
              className="p-0.5 rounded hover:bg-dark-100 disabled:opacity-30 transition-colors"
              aria-label="Monter"
            >
              <ChevronUp className="w-4 h-4 text-dark-600" />
            </button>
            <button
              type="button"
              onClick={() => moveDown(index)}
              disabled={index === items.length - 1}
              className="p-0.5 rounded hover:bg-dark-100 disabled:opacity-30 transition-colors"
              aria-label="Descendre"
            >
              <ChevronDown className="w-4 h-4 text-dark-600" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
