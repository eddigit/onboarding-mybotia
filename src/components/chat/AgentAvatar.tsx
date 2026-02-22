"use client";

import { Bot } from "lucide-react";

export default function AgentAvatar() {
  return (
    <div
      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
      style={{
        background: "linear-gradient(135deg, #4f7df3 0%, #635bff 100%)",
      }}
    >
      <Bot className="w-4 h-4 text-white" />
    </div>
  );
}
