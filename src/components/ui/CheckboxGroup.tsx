"use client";

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
  const toggleOption = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  return (
    <div className="space-y-2">
      {options.map((option) => (
        <label
          key={option.value}
          className={`
            flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer
            transition-all duration-200
            ${
              selected.includes(option.value)
                ? "border-primary-500 bg-primary-50"
                : "border-dark-200 bg-white hover:border-dark-300"
            }
          `}
        >
          <input
            type="checkbox"
            checked={selected.includes(option.value)}
            onChange={() => toggleOption(option.value)}
            className="w-4 h-4 rounded text-primary-600 focus:ring-primary-500"
          />
          <span className="text-sm text-dark-800">{option.label}</span>
        </label>
      ))}

      {showOther && (
        <div
          className={`
            flex items-start gap-3 p-3 rounded-xl border-2
            transition-all duration-200
            ${
              otherValue
                ? "border-primary-500 bg-primary-50"
                : "border-dark-200 bg-white"
            }
          `}
        >
          <input
            type="checkbox"
            checked={!!otherValue}
            readOnly
            className="mt-2 w-4 h-4 rounded text-primary-600 focus:ring-primary-500"
          />
          <input
            type="text"
            value={otherValue}
            onChange={(e) => onOtherChange?.(e.target.value)}
            placeholder={otherPlaceholder}
            className="flex-1 text-sm text-dark-800 bg-transparent border-none
                       outline-none placeholder-dark-400 py-1"
          />
        </div>
      )}
    </div>
  );
}
