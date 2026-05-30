import React, { useState } from "react";
import {
  ArrowLeft,
  Check,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import {
  WizardCard,
  WizardHeader,
  WizardHeaderLeft,
  WizardBackButton,
  WizardTitle,
  WizardSubtitle,
  StepperWrapper,
  StepItem,
  StepCircle,
  StepLabel,
  StepConnector,
  StepContent,
  StepPanel,
  StepPanelTitle,
  StepPanelText,
  StepPreviewGrid,
  StepPreviewCard,
  StepActions,
  StepActionsRight,
  StepSecondaryButton,
  StepPrimaryButton,
} from "../ui/ImportationWizard.styles";

const STEPS = [
  "Datos generales",
  "Productos",
  "Gastos importación",
  "Resumen",
];

function ImportationWizard({ onCancel, onSubmit }) {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleGoToStep = (stepIndex) => {
    setCurrentStep(stepIndex);
  };

  const handleSubmit = () => {
    const payload = {
      message: "Aquí luego irá toda la información de la importación",
    };

    onSubmit?.(payload);
  };

  const renderStepContent = () => {
    if (currentStep === 0) {
      return (
        <StepPanel>
          
        </StepPanel>
      );
    }

    if (currentStep === 1) {
      return (
        <StepPanel>
          
        </StepPanel>
      );
    }

    if (currentStep === 2) {
      return (
        <StepPanel>
          
        </StepPanel>
      );
    }

    return (
      <StepPanel>
        
      </StepPanel>
    );
  };

  return (
    <WizardCard>
      <WizardHeader>
        <WizardHeaderLeft>
          <WizardBackButton type="button" onClick={onCancel}>
            <ArrowLeft size={20} />
          </WizardBackButton>

          <div>
            <WizardTitle>Nueva importación</WizardTitle>
            <WizardSubtitle>
              Configura paso a paso la importación y sus gastos
            </WizardSubtitle>
          </div>
        </WizardHeaderLeft>
      </WizardHeader>

      <StepperWrapper>
        {STEPS.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;

          return (
            <React.Fragment key={step}>
              <StepItem>
                <StepCircle
                  type="button"
                  $active={isActive}
                  $completed={isCompleted}
                  onClick={() => handleGoToStep(index)}
                  title={`Ir a ${step}`}
                >
                  {isCompleted ? <Check size={15} /> : index + 1}
                </StepCircle>

                <StepLabel $active={isActive}>{step}</StepLabel>
              </StepItem>

              {index < STEPS.length - 1 && (
                <StepConnector $completed={index < currentStep} />
              )}
            </React.Fragment>
          );
        })}
      </StepperWrapper>

      <StepContent>{renderStepContent()}</StepContent>

      <StepActions>
        <StepSecondaryButton type="button" onClick={onCancel}>
          Cancelar
        </StepSecondaryButton>

        <StepActionsRight>
          {currentStep > 0 && (
            <StepSecondaryButton type="button" onClick={handlePrevStep}>
              <ChevronLeft size={17} />
              Anterior
            </StepSecondaryButton>
          )}

          {currentStep < STEPS.length - 1 ? (
            <StepPrimaryButton type="button" onClick={handleNextStep}>
              Siguiente
              <ChevronRight size={17} />
            </StepPrimaryButton>
          ) : (
            <StepPrimaryButton type="button" onClick={handleSubmit}>
              Guardar importación
            </StepPrimaryButton>
          )}
        </StepActionsRight>
      </StepActions>
    </WizardCard>
  );
}

export default ImportationWizard;
