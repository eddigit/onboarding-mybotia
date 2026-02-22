"use client";

import { Info } from "lucide-react";

interface InfoBoxProps {
  children: React.ReactNode;
  variant?: "info" | "warning";
}

export default function InfoBox({ children, variant = "info" }: InfoBoxProps) {
  const styles = {
    info: "bg-primary-50 border-primary-200 text-primary-800",
    warning: "bg-amber-50 border-amber-200 text-amber-800",
  };

  return (
    <div className={`flex gap-3 p-4 rounded-xl border ${styles[variant]}`}>
      <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
      <div className="text-sm leading-relaxed">{children}</div>
    </div>
  );
}
