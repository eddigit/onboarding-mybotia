"use client";

import { useRef, useEffect } from "react";
import { ChatMessage } from "@/types/onboarding";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import QuickReplies from "./QuickReplies";

interface ChatContainerProps {
  messages: ChatMessage[];
  isStreaming: boolean;
  streamingText: string;
  quickReplies: string[] | null;
  onQuickReply: (option: string) => void;
}

export default function ChatContainer({
  messages,
  isStreaming,
  streamingText,
  quickReplies,
  onQuickReply,
}: ChatContainerProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages or streaming text
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingText, isStreaming]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 scrollbar-thin">
      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} />
      ))}

      {/* Streaming message (agent is still typing) */}
      {isStreaming && streamingText && (
        <MessageBubble
          message={{
            id: "streaming",
            role: "agent",
            content: streamingText,
            timestamp: new Date(),
          }}
        />
      )}

      {/* Typing indicator (waiting for first chunk) */}
      {isStreaming && !streamingText && <TypingIndicator />}

      {/* Quick replies under the last agent message */}
      {!isStreaming && quickReplies && quickReplies.length > 0 && (
        <QuickReplies options={quickReplies} onSelect={onQuickReply} />
      )}

      <div ref={bottomRef} />
    </div>
  );
}
