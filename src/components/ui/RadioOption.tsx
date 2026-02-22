"use client";

import { useState } from "react";

interface RadioOptionProps {
  name: string;
  value: string;
  selected: boolean;
  onChange: (value: string) => void;
  label: string;
  description?: string;
  example?: string;
}

export default function RadioOption({
  name,
  value,
  selected,
  onChange,
  label,
  description,
  example,
}: RadioOptionProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <label
      className="flex items-start gap-3 p-4 rounded-xl cursor-pointer transition-all duration-200"
      style={{
        background: selected
          ? "rgba(79,125,243,0.1)"
          : hovered
            ? "rgba(255,255,255,0.06)"
            : "rgba(255,255,255,0.03)",
        border: selected
          ? "1px solid rgba(79,125,243,0.4)"
          : hovered
            ? "1px solid rgba(255,255,255,0.12)"
            : "1px solid rgba(255,255,255,0.06)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={selected}
        onChange={() => onChange(value)}
        className="sr-only"
      />
      {/* Custom radio circle */}
      <div
        className="mt-0.5 w-[18px] h-[18px] rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200"
        style={{
          border: selected
            ? "2px solid #4f7df3"
            : "2px solid rgba(255,255,255,0.2)",
        }}
      >
        {selected && (
          <div
            className="w-2.5 h-2.5 rounded-full"
            style={{ background: "#4f7df3" }}
          />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <span className="block text-sm font-medium text-txt-primary">
          {label}
        </span>
        {description && (
          <span className="block text-xs text-txt-secondary mt-1">
            {description}
          </span>
        )}
        {example && (
          <span className="block text-xs text-txt-muted italic mt-1.5">
            {example}
          </span>
        )}
      </div>
    </label>
  );
}
