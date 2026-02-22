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
      {/* Mobile: simple text */}
      <div className="sm:hidden text-center mb-4">
        <span className="text-sm font-medium text-primary-600">
          Étape {currentStep} sur {totalSteps}
        </span>
        <div className="mt-2 h-2 bg-dark-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary-600 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Desktop: step indicators */}
      <div className="hidden sm:flex items-center justify-center gap-0">
        {Array.from({ length: totalSteps }, (_, i) => {
          const step = i + 1;
          const isActive = step === currentStep;
          const isCompleted = step < currentStep;

          return (
            <div key={step} className="flex items-center">
              <div
                className={`
                  flex items-center justify-center w-9 h-9 rounded-full text-sm font-semibold
                  transition-all duration-300
                  ${
                    isCompleted
                      ? "bg-primary-600 text-white"
                      : isActive
                        ? "bg-primary-600 text-white ring-4 ring-primary-100"
                        : "bg-dark-100 text-dark-400"
                  }
                `}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : step}
              </div>
              {step < totalSteps && (
                <div
                  className={`w-8 lg:w-12 h-0.5 transition-all duration-300 ${
                    isCompleted ? "bg-primary-600" : "bg-dark-200"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
