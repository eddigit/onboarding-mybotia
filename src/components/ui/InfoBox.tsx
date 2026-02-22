"use client";

import { Info, AlertTriangle } from "lucide-react";

interface InfoBoxProps {
  children: React.ReactNode;
  variant?: "info" | "warning";
}

export default function InfoBox({ children, variant = "info" }: InfoBoxProps) {
  const isWarning = variant === "warning";

  return (
    <div
      className="flex gap-3 p-4 rounded-xl"
      style={{
        background: isWarning
          ? "rgba(245,158,11,0.08)"
          : "rgba(79,125,243,0.08)",
        border: isWarning
          ? "1px solid rgba(245,158,11,0.2)"
          : "1px solid rgba(79,125,243,0.2)",
      }}
    >
      {isWarning ? (
        <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5 text-amber-400" />
      ) : (
        <Info className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "#4f7df3" }} />
      )}
      <div
        className="text-sm leading-relaxed"
        style={{ color: isWarning ? "#fbbf24" : "#93adf5" }}
      >
        {children}
      </div>
    </div>
  );
}
