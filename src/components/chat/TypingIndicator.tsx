"use client";

import AgentAvatar from "./AgentAvatar";

export default function TypingIndicator() {
  return (
    <div className="flex items-end gap-3">
      <AgentAvatar />
      <div
        className="px-4 py-3 rounded-2xl rounded-bl-md flex items-center gap-1.5"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <span className="typing-dot w-2 h-2 rounded-full bg-txt-muted" style={{ animationDelay: "0ms" }} />
        <span className="typing-dot w-2 h-2 rounded-full bg-txt-muted" style={{ animationDelay: "150ms" }} />
        <span className="typing-dot w-2 h-2 rounded-full bg-txt-muted" style={{ animationDelay: "300ms" }} />
      </div>
    </div>
  );
}
