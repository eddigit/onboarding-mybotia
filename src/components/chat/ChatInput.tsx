"use client";

import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import MicButton from "./MicButton";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  speechRecognition: {
    isSupported: boolean;
    isListening: boolean;
    transcript: string;
    error: string | null;
    startListening: () => void;
    stopListening: () => void;
    resetTranscript: () => void;
  };
}

export default function ChatInput({
  onSend,
  disabled,
  speechRecognition,
}: ChatInputProps) {
  const [text, setText] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const {
    isSupported,
    isListening,
    transcript,
    error: micError,
    startListening,
    stopListening,
    resetTranscript,
  } = speechRecognition;

  // Sync voice transcript into the text field
  useEffect(() => {
    if (transcript) {
      setText(transcript);
    }
  }, [transcript]);

  // Auto-focus input
  useEffect(() => {
    if (!disabled && inputRef.current) {
      inputRef.current.focus();
    }
  }, [disabled]);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setText("");
    resetTranscript();
    if (isListening) stopListening();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleMic = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div
      className="flex items-end gap-2 p-3 rounded-xl"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <textarea
        ref={inputRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Votre message..."
        disabled={disabled}
        rows={1}
        className="flex-1 bg-transparent text-txt-primary text-sm placeholder-txt-muted resize-none outline-none max-h-32 py-1.5"
        style={{ minHeight: "28px" }}
        onInput={(e) => {
          const target = e.target as HTMLTextAreaElement;
          target.style.height = "28px";
          target.style.height = Math.min(target.scrollHeight, 128) + "px";
        }}
      />

      <div className="flex items-center gap-1.5">
        <MicButton
          isSupported={isSupported}
          isListening={isListening}
          error={micError}
          onToggle={toggleMic}
        />

        <button
          type="button"
          onClick={handleSend}
          disabled={!text.trim() || disabled}
          className="flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
          style={{
            background:
              text.trim() && !disabled
                ? "linear-gradient(135deg, #4f7df3 0%, #635bff 100%)"
                : "rgba(255,255,255,0.06)",
          }}
        >
          <Send className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  );
}
