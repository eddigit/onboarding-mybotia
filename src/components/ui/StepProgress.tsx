"use client";

import { Check } from "lucide-react";

interface StepProgressProps {
  currentStep: number;
  totalSteps: number;
}

export default function StepProgress({
  currentStep,
  totalSteps,
}: StepProgressProps) {
  return (
    <div className="w-full">
      {/* Mobile: simple text + gradient bar */}
      <div className="sm:hidden text-center mb-4">
        <span className="text-sm font-medium text-accent-blue">
          Étape {currentStep} sur {totalSteps}
        </span>
        <div
          className="mt-2 h-2 rounded-full overflow-hidden"
          style={{ background: "rgba(255,255,255,0.06)" }}
        >
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${(currentStep / totalSteps) * 100}%`,
              background: "linear-gradient(90deg, #4f7df3, #635bff, #7c3aed)",
            }}
          />
        </div>
      </div>

      {/* Desktop: step indicators with gradient circles */}
      <div className="hidden sm:flex items-center justify-center gap-0">
        {Array.from({ length: totalSteps }, (_, i) => {
          const step = i + 1;
          const isActive = step === currentStep;
          const isCompleted = step < currentStep;

          return (
            <div key={step} className="flex items-center">
              <div
                className="flex items-center justify-center w-9 h-9 rounded-full text-sm font-semibold transition-all duration-300"
                style={{
                  background:
                    isCompleted || isActive
                      ? "linear-gradient(135deg, #4f7df3, #635bff)"
                      : "rgba(255,255,255,0.06)",
                  color:
                    isCompleted || isActive
                      ? "#ffffff"
                      : "rgba(255,255,255,0.3)",
                  boxShadow: isActive
                    ? "0 0 20px rgba(79,125,243,0.4)"
                    : "none",
                }}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : step}
              </div>
              {step < totalSteps && (
                <div
                  className="w-8 lg:w-12 h-0.5 transition-all duration-300"
                  style={{
                    background: isCompleted
                      ? "linear-gradient(90deg, #4f7df3, #635bff)"
                      : "rgba(255,255,255,0.06)",
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
