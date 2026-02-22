"use client";

import { ClipboardList } from "lucide-react";

interface MobileDrawerToggleProps {
  onClick: () => void;
  completedCount: number;
  totalCount: number;
}

export default function MobileDrawerToggle({
  onClick,
  completedCount,
  totalCount,
}: MobileDrawerToggleProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="lg:hidden fixed top-4 right-4 z-50 flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-200"
      style={{
        background: "rgba(15,20,50,0.9)",
        border: "1px solid rgba(255,255,255,0.1)",
        backdropFilter: "blur(12px)",
      }}
    >
      <ClipboardList className="w-4 h-4 text-accent-blue" />
      <span className="text-xs font-medium text-txt-secondary">
        {completedCount}/{totalCount}
      </span>
    </button>
  );
}
