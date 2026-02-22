import { OnboardingFormData } from "@/types/onboarding";

/** Validates whether the user can proceed from a given step */
export function canProceedFromStep(
  step: number,
  data: OnboardingFormData
): boolean {
  switch (step) {
    case 1:
      return (
        data.step1.metier.trim() !== "" &&
        data.step1.specialite.trim() !== "" &&
        data.step1.cabinet.trim() !== "" &&
        data.step1.niveauTechnique !== "" &&
        data.step1.langue !== "" &&
        (data.step1.langue !== "multilingual" ||
          data.step1.languesDetail.trim() !== "")
      );

    case 2:
      return (
        data.step2.prenomAgent.trim() !== "" &&
        data.step2.role !== "" &&
        data.step2.personnalite !== ""
      );

    case 3:
      return (
        data.step3.mission1.trim() !== "" &&
        data.step3.mission2.trim() !== "" &&
        data.step3.mission3.trim() !== "" &&
        (data.step3.sources.length > 0 ||
          data.step3.sourcesAutre.trim() !== "")
      );

    case 4:
      return (
        data.step4.ton !== "" &&
        data.step4.gestionErreurs !== "" &&
        data.step4.challenge !== "" &&
        data.step4.qualitesClassement.length === 5
      );

    case 5:
      return (
        data.step5.confidentialite !== "" &&
        (data.step5.interdits.length > 0 ||
          data.step5.interditsAutre.trim() !== "") &&
        data.step5.validation !== "" &&
        (data.step5.validation !== "validation" ||
          data.step5.validationDetail.trim() !== "") &&
        data.step5.communication !== "" &&
        (data.step5.communication === "solo" ||
          data.step5.communicationDetail.trim() !== "")
      );

    case 6:
      return data.step6.hasTachesRecurrentes !== null;

    case 7:
      return (
        data.step7.nombreAssistants !== "" &&
        data.step7.formule !== "" &&
        data.clientName.trim() !== "" &&
        data.clientEmail.trim() !== "" &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.clientEmail)
      );

    default:
      return false;
  }
}
