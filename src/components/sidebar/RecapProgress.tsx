"use client";

interface RecapProgressProps {
  completed: number;
  total: number;
}

export default function RecapProgress({
  completed,
  total,
}: RecapProgressProps) {
  const pct = Math.round((completed / total) * 100);

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-txt-secondary">
          Progression
        </span>
        <span className="text-xs text-txt-muted">
          {completed}/{total}
        </span>
      </div>
      <div
        className="h-1.5 rounded-full overflow-hidden"
        style={{ background: "rgba(255,255,255,0.06)" }}
      >
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${pct}%`,
            background:
              "linear-gradient(90deg, #4f7df3 0%, #635bff 60%, #7c3aed 100%)",
          }}
        />
      </div>
    </div>
  );
}
