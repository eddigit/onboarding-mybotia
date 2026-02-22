"use client";

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
  return (
    <label
      className={`
        flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer
        transition-all duration-200
        ${
          selected
            ? "border-primary-500 bg-primary-50"
            : "border-dark-200 bg-white hover:border-dark-300"
        }
      `}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={selected}
        onChange={() => onChange(value)}
        className="mt-0.5 w-4 h-4 text-primary-600 focus:ring-primary-500"
      />
      <div className="flex-1 min-w-0">
        <span className="block text-sm font-medium text-dark-800">
          {label}
        </span>
        {description && (
          <span className="block text-xs text-dark-500 mt-1">
            {description}
          </span>
        )}
        {example && (
          <span className="block text-xs text-dark-400 italic mt-1.5">
            {example}
          </span>
        )}
      </div>
    </label>
  );
}
