import React, { useState } from "react";
import GeneralDataStep from "./importationSteps/GeneralDataStep";
import ProductsStep from "./importationSteps/ProductsStep";
import ExpensesStep from "./importationSteps/ExpensesStep";
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
  // estado de los pasos
  const [generalData, setGeneralData] = useState({
    supplier: "",
    reference: "",
    date: "",
    officialExchangeRate: "",
    bankExchangeRate: "",
  });
  const [products, setProducts] = useState([
    {
      code: "",
      productName: "",
      quantity: "",
      priceUsd: "",
    },
  ]);
  const [expenses, setExpenses] = useState({
    freights: [{ name: "", amount: "" }],
    insurances: [{ name: "", amount: "" }],
    portCosts: [{ name: "", amount: "" }],
    otherCosts: [{ name: "", amount: "" }],
  });
  // funciones del contenido los pasos
  const handleGeneralDataChange = (field, value) => {
    setGeneralData((current) => ({
      ...current,
      [field]: value,
    }));
  };

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
      generalData,
      products,
      expenses,
      message: "Aquí luego irá el resumen y cálculo final",
    };
    onSubmit?.(payload);
  };

  const renderStepContent = () => {
    // paso -> datos generales
    if (currentStep === 0) {
      return (
        <GeneralDataStep
          formData={generalData}
          onChange={handleGeneralDataChange}
        />
      );
    }
    // paso -> productos
    if (currentStep === 1) {
      return (
        <ProductsStep
          products={products}
          onChangeProducts={setProducts}
        />
      );
    }
    // paso -> gastos importacion
    if (currentStep === 2) {
      return (
        <ExpensesStep
          expenses={expenses}
          onChangeExpenses={setExpenses}
        />
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
