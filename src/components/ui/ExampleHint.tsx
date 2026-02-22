"use client";

interface ExampleHintProps {
  examples: string[];
}

export default function ExampleHint({ examples }: ExampleHintProps) {
  return (
    <div className="mt-2 flex flex-wrap gap-1.5">
      {examples.map((example, i) => (
        <span
          key={i}
          className="text-xs text-txt-muted italic px-2 py-1 rounded-md"
          style={{ background: "rgba(255,255,255,0.04)" }}
        >
          {example}
        </span>
      ))}
    </div>
  );
}
