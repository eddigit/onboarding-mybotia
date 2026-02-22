"use client";

import { ChevronLeft, ChevronRight, Loader2, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface StepContainerProps {
  title: string;
  subtitle: string;
  currentStep: number;
  totalSteps: number;
  canProceed: boolean;
  onPrevious: () => void;
  onNext: () => void;
  isSubmitting?: boolean;
  children: React.ReactNode;
}

export default function StepContainer({
  title,
  subtitle,
  currentStep,
  totalSteps,
  canProceed,
  onPrevious,
  onNext,
  isSubmitting = false,
  children,
}: StepContainerProps) {
  const isLastStep = currentStep === totalSteps;

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-txt-primary mb-2">
          {title}
        </h2>
        <p className="text-txt-secondary text-sm sm:text-base">{subtitle}</p>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
        >
          <div className="space-y-6">{children}</div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="mt-10 flex items-center justify-between">
        {currentStep > 1 ? (
          <button
            type="button"
            onClick={onPrevious}
            className="btn-secondary gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Précédent
          </button>
        ) : (
          <div />
        )}

        <button
          type="button"
          onClick={onNext}
          disabled={!canProceed || isSubmitting}
          className="btn-primary gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Envoi en cours...
            </>
          ) : isLastStep ? (
            <>
              Valider et envoyer
              <Send className="w-4 h-4" />
            </>
          ) : (
            <>
              Suivant
              <ChevronRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
