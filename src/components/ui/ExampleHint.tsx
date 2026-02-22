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
          className="text-xs text-dark-400 italic bg-dark-50 px-2 py-1 rounded-md"
        >
          {example}
        </span>
      ))}
    </div>
  );
}
