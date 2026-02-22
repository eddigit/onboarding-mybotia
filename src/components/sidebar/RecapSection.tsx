"use client";

import { motion } from "framer-motion";
import {
  CheckCircle,
  Circle,
  User,
  Bot,
  Target,
  Palette,
  Shield,
  Calendar,
  Users,
} from "lucide-react";
import RecapField from "./RecapField";

const ICON_MAP: Record<string, React.ElementType> = {
  user: User,
  bot: Bot,
  target: Target,
  palette: Palette,
  shield: Shield,
  calendar: Calendar,
  users: Users,
};

interface RecapSectionProps {
  id: string;
  label: string;
  icon: string;
  fields: Array<{ label: string; value: string | null }>;
  completed: boolean;
}

export default function RecapSection({
  label,
  icon,
  fields,
  completed,
}: RecapSectionProps) {
  const IconComponent = ICON_MAP[icon] || Circle;
  const hasAnyValue = fields.some((f) => f.value !== null);

  return (
    <motion.div
      initial={false}
      animate={
        completed
          ? { borderColor: "rgba(79,125,243,0.2)" }
          : { borderColor: "rgba(255,255,255,0.04)" }
      }
      className="rounded-lg p-3 transition-colors duration-500"
      style={{
        background: hasAnyValue
          ? "rgba(255,255,255,0.03)"
          : "rgba(255,255,255,0.01)",
        border: "1px solid rgba(255,255,255,0.04)",
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <IconComponent
          className={`w-3.5 h-3.5 ${
            completed ? "text-accent-blue" : "text-txt-muted"
          }`}
        />
        <span
          className={`text-xs font-semibold ${
            completed ? "text-txt-primary" : "text-txt-muted"
          }`}
        >
          {label}
        </span>
        {completed ? (
          <CheckCircle className="w-3 h-3 text-green-400 ml-auto" />
        ) : (
          <Circle className="w-3 h-3 text-txt-muted/30 ml-auto" />
        )}
      </div>

      {hasAnyValue && (
        <div className="space-y-1 ml-5">
          {fields
            .filter((f) => f.value !== null)
            .map((f) => (
              <RecapField key={f.label} label={f.label} value={f.value} />
            ))}
        </div>
      )}
    </motion.div>
  );
}
