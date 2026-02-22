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

export default function PlanCard({ name, price, description, features, value, selected, recommended = false, onChange }: PlanCardProps) {
  return (
    <button
      type="button"
      onClick={() => onChange(value)}
      className="w-full text-left p-5 rounded-xl transition-all duration-300 relative"
      style={{
        background: selected ? "rgba(79,125,243,0.1)" : "rgba(255,255,255,0.03)",
        border: selected ? "1px solid rgba(79,125,243,0.4)" : recommended ? "1px solid rgba(99,91,255,0.3)" : "1px solid rgba(255,255,255,0.06)",
        boxShadow: selected ? "0 0 30px rgba(79,125,243,0.12)" : "none",
      }}
    >
      {recommended && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold text-white"
          style={{ background: "linear-gradient(135deg, #4f7df3, #635bff)" }}>
          <Star className="w-3 h-3" /> Le plus choisi
        </div>
      )}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-lg font-bold text-txt-primary">{name}</h3>
          <p className="text-xs text-txt-secondary mt-0.5">{description}</p>
        </div>
        <span className="text-lg font-bold bg-gradient-to-r from-accent-blue to-accent-indigo bg-clip-text text-transparent">{price}</span>
      </div>
      <ul className="space-y-1.5">
        {features.map((f, i) => (
          <li key={i} className="flex items-center gap-2 text-sm text-txt-secondary">
            <Check className="w-3.5 h-3.5 text-accent-blue flex-shrink-0" /> {f}
          </li>
        ))}
      </ul>
      {/* Selection indicator */}
      <div className="absolute top-5 right-5">
        <div className="w-5 h-5 rounded-full flex items-center justify-center"
          style={{
            border: selected ? "2px solid #4f7df3" : "2px solid rgba(255,255,255,0.15)",
            background: selected ? "#4f7df3" : "transparent",
          }}>
          {selected && <Check className="w-3 h-3 text-white" />}
        </div>
      </div>
    </button>
  );
}
