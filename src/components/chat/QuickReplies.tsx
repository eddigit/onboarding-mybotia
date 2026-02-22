"use client";

import { motion } from "framer-motion";

interface QuickRepliesProps {
  options: string[];
  onSelect: (option: string) => void;
  disabled?: boolean;
}

export default function QuickReplies({
  options,
  onSelect,
  disabled,
}: QuickRepliesProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: 0.1 }}
      className="flex flex-wrap gap-2 ml-11"
    >
      {options.map((option) => (
        <button
          key={option}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(option)}
          className="px-4 py-2 rounded-full text-sm font-medium text-accent-blue transition-all duration-200 hover:scale-[1.03] disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            background: "rgba(79,125,243,0.1)",
            border: "1px solid rgba(79,125,243,0.25)",
          }}
          onMouseEnter={(e) => {
            if (!disabled) {
              e.currentTarget.style.background = "rgba(79,125,243,0.18)";
              e.currentTarget.style.borderColor = "rgba(79,125,243,0.4)";
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(79,125,243,0.1)";
            e.currentTarget.style.borderColor = "rgba(79,125,243,0.25)";
          }}
        >
          {option}
        </button>
      ))}
    </motion.div>
  );
}
