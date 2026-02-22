"use client";

import { useState } from "react";
import { Check } from "lucide-react";

interface CheckboxOption {
  label: string;
  value: string;
  defaultChecked?: boolean;
}

interface CheckboxGroupProps {
  options: CheckboxOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
  showOther?: boolean;
  otherValue?: string;
  onOtherChange?: (value: string) => void;
  otherPlaceholder?: string;
}

export default function CheckboxGroup({
  options,
  selected,
  onChange,
  showOther = false,
  otherValue = "",
  onOtherChange,
  otherPlaceholder = "Précisez...",
}: CheckboxGroupProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const toggleOption = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  return (
    <div className="space-y-2">
      {options.map((option, index) => {
        const isSelected = selected.includes(option.value);
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
              onChange={() => toggleOption(option.value)}
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

      {showOther && (
        <div
          className="flex items-start gap-3 p-3 rounded-xl transition-all duration-200"
          style={{
            background: otherValue
              ? "rgba(79,125,243,0.1)"
              : "rgba(255,255,255,0.03)",
            border: otherValue
              ? "1px solid rgba(79,125,243,0.4)"
              : "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <input
            type="checkbox"
            checked={!!otherValue}
            readOnly
            className="sr-only"
          />
          {/* Custom checkbox square */}
          <div
            className="mt-1.5 w-[18px] h-[18px] rounded flex items-center justify-center flex-shrink-0 transition-all duration-200"
            style={{
              background: otherValue ? "#4f7df3" : "transparent",
              border: otherValue
                ? "2px solid #4f7df3"
                : "2px solid rgba(255,255,255,0.2)",
            }}
          >
            {otherValue && <Check className="w-3 h-3 text-white" />}
          </div>
          <input
            type="text"
            value={otherValue}
            onChange={(e) => onOtherChange?.(e.target.value)}
            placeholder={otherPlaceholder}
            className="flex-1 text-sm text-txt-primary bg-transparent border-none
                       outline-none placeholder-txt-muted py-1"
          />
        </div>
      )}
    </div>
  );
}
