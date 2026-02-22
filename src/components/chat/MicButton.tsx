"use client";

import { Mic, MicOff } from "lucide-react";

interface MicButtonProps {
  isSupported: boolean;
  isListening: boolean;
  error: string | null;
  onToggle: () => void;
}

export default function MicButton({
  isSupported,
  isListening,
  error,
  onToggle,
}: MicButtonProps) {
  if (!isSupported) return null;

  const hasPermissionError = error?.includes("microphone");

  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={hasPermissionError}
      className={`relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 ${
        hasPermissionError
          ? "opacity-40 cursor-not-allowed"
          : "hover:scale-105"
      }`}
      style={{
        background: isListening
          ? "rgba(239,68,68,0.2)"
          : "rgba(255,255,255,0.06)",
        border: `1px solid ${
          isListening ? "rgba(239,68,68,0.4)" : "rgba(255,255,255,0.1)"
        }`,
      }}
      title={
        hasPermissionError
          ? "Autorisez l'accès au microphone"
          : isListening
          ? "Arrêter l'écoute"
          : "Parler"
      }
    >
      {isListening && (
        <span className="absolute inset-0 rounded-full mic-pulse" />
      )}
      {hasPermissionError ? (
        <MicOff className="w-4 h-4 text-txt-muted" />
      ) : (
        <Mic
          className={`w-4 h-4 relative z-10 ${
            isListening ? "text-red-400" : "text-txt-secondary"
          }`}
        />
      )}
    </button>
  );
}
