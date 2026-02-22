"use client";

interface RecapFieldProps {
  label: string;
  value: string | null;
}

export default function RecapField({ label, value }: RecapFieldProps) {
  return (
    <div className="flex items-start gap-2 text-xs">
      <span className="text-txt-muted flex-shrink-0">{label} :</span>
      {value ? (
        <span className="text-txt-primary font-medium">{value}</span>
      ) : (
        <span className="text-txt-muted italic">—</span>
      )}
    </div>
  );
}
