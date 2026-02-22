"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  OnboardingFormData,
  initialFormData,
  STEPS,
} from "@/types/onboarding";
import { canProceedFromStep } from "@/lib/validation";
import StepProgress from "@/components/ui/StepProgress";
import StepContainer from "@/components/ui/StepContainer";
import Step1Profile from "@/components/steps/Step1Profile";
import Step2Assistant from "@/components/steps/Step2Assistant";
import Step3Missions from "@/components/steps/Step3Missions";
import Step4Character from "@/components/steps/Step4Character";
import Step5Rules from "@/components/steps/Step5Rules";
import Step6Routine from "@/components/steps/Step6Routine";
import Step7Ecosystem from "@/components/steps/Step7Ecosystem";

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<OnboardingFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalSteps = STEPS.length;
  const stepMeta = STEPS[currentStep - 1];

  const canProceed = canProceedFromStep(currentStep, formData);

  const goToPrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setError(null);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goToNext = async () => {
    if (!canProceed) return;

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      setError(null);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // Submit
      await handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || "Une erreur est survenue. Veuillez réessayer."
        );
      }

      // Redirect to confirmation
      const params = new URLSearchParams({
        name: formData.clientName,
        agent: formData.step2.prenomAgent,
      });
      router.push(`/onboarding/confirmation?${params.toString()}`);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Une erreur est survenue. Veuillez réessayer."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1Profile
            data={formData.step1}
            onChange={(step1) => setFormData({ ...formData, step1 })}
          />
        );
      case 2:
        return (
          <Step2Assistant
            data={formData.step2}
            onChange={(step2) => setFormData({ ...formData, step2 })}
          />
        );
      case 3:
        return (
          <Step3Missions
            data={formData.step3}
            role={formData.step2.role}
            onChange={(step3) => setFormData({ ...formData, step3 })}
          />
        );
      case 4:
        return (
          <Step4Character
            data={formData.step4}
            onChange={(step4) => setFormData({ ...formData, step4 })}
          />
        );
      case 5:
        return (
          <Step5Rules
            data={formData.step5}
            onChange={(step5) => setFormData({ ...formData, step5 })}
          />
        );
      case 6:
        return (
          <Step6Routine
            data={formData.step6}
            onChange={(step6) => setFormData({ ...formData, step6 })}
          />
        );
      case 7:
        return (
          <Step7Ecosystem
            data={formData.step7}
            onChange={(step7) => setFormData({ ...formData, step7 })}
          />
        );
      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen relative py-8 px-4">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] opacity-30 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center, rgba(79,125,243,0.15) 0%, transparent 70%)" }}
      />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center, rgba(124,58,237,0.2) 0%, transparent 70%)" }}
      />

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <h1 className="font-brand text-2xl text-txt-primary tracking-wide">
            MyBotIA
          </h1>
          <p className="text-sm text-txt-secondary mt-1">
            Créez votre assistant IA personnalisé
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <StepProgress currentStep={currentStep} totalSteps={totalSteps} />
        </div>

        {/* Form Card */}
        <div className="glass-card p-6 sm:p-8">
          {/* Contact info on last step */}
          {currentStep === 7 && (
            <div className="mb-8 pb-6"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <h3 className="text-sm font-semibold text-txt-primary mb-4">
                Vos coordonnées
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="label-field">
                    Votre nom <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.clientName}
                    onChange={(e) =>
                      setFormData({ ...formData, clientName: e.target.value })
                    }
                    placeholder="ex: Maître Dupont"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="label-field">
                    Votre email <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.clientEmail}
                    onChange={(e) =>
                      setFormData({ ...formData, clientEmail: e.target.value })
                    }
                    placeholder="ex: contact@cabinet-dupont.fr"
                    className="input-field"
                  />
                </div>
              </div>
            </div>
          )}

          <StepContainer
            title={stepMeta.title}
            subtitle={stepMeta.subtitle}
            currentStep={currentStep}
            totalSteps={totalSteps}
            canProceed={canProceed}
            onPrevious={goToPrevious}
            onNext={goToNext}
            isSubmitting={isSubmitting}
          >
            {renderStep()}
          </StepContainer>

          {/* Error message */}
          {error && (
            <div
              className="mt-6 p-4 rounded-xl text-sm text-red-300"
              style={{
                background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.2)",
              }}
            >
              {error}
              <button
                type="button"
                onClick={handleSubmit}
                className="ml-2 underline font-medium hover:text-red-200"
              >
                Réessayer
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="text-center text-xs text-txt-muted mt-6 space-y-1">
          <p>Vos données sont traitées de manière confidentielle.</p>
          <p>
            <span className="font-brand text-sm tracking-wide">MyBotIA</span>
            <span className="mx-2">|</span>
            MyBotIA.com &copy; {new Date().getFullYear()} &mdash; Gilles KORZEC, CEO Fondateur
          </p>
        </footer>
      </div>
    </main>
  );
}
