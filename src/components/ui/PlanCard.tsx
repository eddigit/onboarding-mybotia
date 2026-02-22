"use client";

import { Check, Star } from "lucide-react";

interface PlanCardProps {
  name: string;
  price: string;
  description: string;
  features: string[];
  value: string;
  selected: boolean;
  recommended?: boolean;
  onChange: (value: string) => void;
}

export default function PlanCard({
  name,
  price,
  description,
  features,
  value,
  selected,
  recommended = false,
  onChange,
}: PlanCardProps) {
  return (
    <button
      type="button"
      onClick={() => onChange(value)}
      className={`
        relative w-full text-left p-5 rounded-2xl border-2 transition-all duration-200
        ${
          selected
            ? "border-primary-500 bg-primary-50 shadow-lg shadow-primary-100"
            : recommended
              ? "border-primary-300 bg-white hover:border-primary-400"
              : "border-dark-200 bg-white hover:border-dark-300"
        }
      `}
    >
      {recommended && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary-600 text-white text-xs font-semibold rounded-full flex items-center gap-1">
          <Star className="w-3 h-3" />
          Le plus choisi
        </div>
      )}

      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-lg font-bold text-dark-900">{name}</h3>
          <p className="text-2xl font-bold text-primary-600 mt-1">{price}</p>
        </div>
        <div
          className={`
            w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1
            ${selected ? "border-primary-600 bg-primary-600" : "border-dark-300"}
          `}
        >
          {selected && <Check className="w-3 h-3 text-white" />}
        </div>
      </div>

      <p className="text-sm text-dark-500 mb-3">{description}</p>

      <ul className="space-y-1.5">
        {features.map((feature, i) => (
          <li key={i} className="flex items-center gap-2 text-sm text-dark-700">
            <Check className="w-3.5 h-3.5 text-primary-500 flex-shrink-0" />
            {feature}
          </li>
        ))}
      </ul>
    </button>
  );
}
