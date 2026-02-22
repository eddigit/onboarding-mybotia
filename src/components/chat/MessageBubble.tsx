"use client";

import { motion } from "framer-motion";
import AgentAvatar from "./AgentAvatar";
import { ChatMessage } from "@/types/onboarding";

interface MessageBubbleProps {
  message: ChatMessage;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isAgent = message.role === "agent";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`flex items-end gap-3 ${isAgent ? "" : "flex-row-reverse"}`}
    >
      {isAgent && <AgentAvatar />}

      <div
        className={`max-w-[80%] px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
          isAgent
            ? "rounded-2xl rounded-bl-md text-txt-primary"
            : "rounded-2xl rounded-br-md text-white"
        }`}
        style={
          isAgent
            ? {
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.06)",
              }
            : {
                background:
                  "linear-gradient(135deg, #4f7df3 0%, #635bff 60%, #7c3aed 100%)",
              }
        }
      >
        {formatContent(message.content)}
      </div>
    </motion.div>
  );
}

function formatContent(text: string) {
  // Simple markdown-like formatting for bold
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}
