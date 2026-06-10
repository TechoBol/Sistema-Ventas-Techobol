import React, { useState } from "react";
import GeneralDataStep from "./GeneralDataStep";
import ProductsStep from "./ProductsStep";
import ExpensesStep from "./ExpensesStep";
import SummaryStep from "./SummaryStep";
import AdditionalCostsStep from "./AdditionalCostsStep";
import FinalCostStep from "./FinalCostStep";
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
  StepPreviewGrid,
  StepPreviewCard,
  StepActions,
  StepActionsRight,
  StepSecondaryButton,
  StepPrimaryButton,
} from "../../ui/ImportationWizard.styles";

const STEPS = [
  "Datos generales",
  "Productos",
  "Gastos base",
  "Base imponible e impuestos",
  "Gastos adicionales",
  "Costo final",
];

// constantes para arracar con datos existentes
const emptyProduct = {
  productCode: "",
  productName: "",
  referenceQuantity: "",
  baseQuantity: "",
  priceUsd: "",
  gaPercent: "",
};

const defaultExpenses = {
  freights: [
    { name: "Flete Naviero (FLETE I)", amount: "" },
    { name: "Flete terrestre Frontera FLETE(II)", amount: "" },
  ],
  insurances: [{ name: "", amount: "" }],
  portCosts: [{ name: "", amount: "" }],
  otherCosts: [{ name: "", amount: "" }],
};

const defaultAdditionalCosts = [
  {
    concept: "Comisión aduana por despacho",
    amount: "",
    currency: "USD",
    hasFiscalCredit: true,
    creditRate: "13",
  },
  {
    concept: "Impuestos globales",
    amount: "",
    currency: "USD",
    hasFiscalCredit: false,
    creditRate: "13",
  },
  {
    concept: "Flete PISIGA-CBBA",
    amount: "",
    currency: "USD",
    hasFiscalCredit: false,
    creditRate: "13",
  },
  {
    concept: "Comisiones bancarias",
    amount: "",
    currency: "BS",
    hasFiscalCredit: true,
    creditRate: "13",
  },
  {
    concept: "ITF",
    amount: "",
    currency: "BS",
    hasFiscalCredit: false,
    creditRate: "13",
  },
  {
    concept: "SAMC",
    amount: "",
    currency: "BS",
    hasFiscalCredit: true,
    creditRate: "13",
  },
  {
    concept: "Gate In devolución",
    amount: "",
    currency: "BS",
    hasFiscalCredit: true,
    creditRate: "13",
  },
  {
    concept: "Emisión de documentos",
    amount: "",
    currency: "USD",
    hasFiscalCredit: true,
    creditRate: "13",
  },
  {
    concept: "Diferencia tipo de cambio",
    amount: "",
    currency: "BS",
    hasFiscalCredit: false,
    creditRate: "13",
  },
  {
    concept: "Pago transporte interno diferencia",
    amount: "",
    currency: "USD",
    hasFiscalCredit: false,
    creditRate: "13",
  },
];

const getDateInputValue = (value) => {
  if (!value) return "";
  const [datePart] = value.split("T");
  return datePart || "";
};

const mapApiDataToWizardState = (importation) => {
  const snapshot = importation?.snapshot ?? {};
  return {
    generalData: {
      supplier: importation?.supplierName || "",
      reference: importation?.referenceNumber || "",
      date: getDateInputValue(importation?.importationDate),
      officialExchangeRate: importation?.officialExchangeRate
        ? String(importation.officialExchangeRate)
        : "6.96",
      bankExchangeRate: importation?.bankExchangeRate
        ? String(importation.bankExchangeRate)
        : "",
    },
    products:
      Array.isArray(snapshot.products) && snapshot.products.length > 0
        ? snapshot.products.map((product) => ({
            productId: product.productId ?? null,
            productCode: product.productCode || "",
            productName: product.productName || "",
            referenceQuantity: product.referenceQuantity ?? "",
            baseQuantity: product.baseQuantity ?? "",
            priceUsd: product.priceUsd ?? "",
            gaPercent: product.gaPercent ?? "",
          }))
        : [{ ...emptyProduct }],
    expenses: {
      freights:
        snapshot.baseExpenses?.freights?.length > 0
          ? snapshot.baseExpenses.freights.map((item) => ({
              name: item.name || "",
              amount: item.amountUsd ?? "",
            }))
          : defaultExpenses.freights,
      insurances:
        snapshot.baseExpenses?.insurances?.length > 0
          ? snapshot.baseExpenses.insurances.map((item) => ({
              name: item.name || "",
              amount: item.amountUsd ?? "",
            }))
          : defaultExpenses.insurances,
      portCosts:
        snapshot.baseExpenses?.portCosts?.length > 0
          ? snapshot.baseExpenses.portCosts.map((item) => ({
              name: item.name || "",
              amount: item.amountUsd ?? "",
            }))
          : defaultExpenses.portCosts,
      otherCosts:
        snapshot.baseExpenses?.otherCosts?.length > 0
          ? snapshot.baseExpenses.otherCosts.map((item) => ({
              name: item.name || "",
              amount: item.amountUsd ?? "",
            }))
          : defaultExpenses.otherCosts,
    },
    additionalCosts:
      Array.isArray(snapshot.additionalCosts) &&
      snapshot.additionalCosts.length > 0
        ? snapshot.additionalCosts.map((cost) => ({
            concept: cost.concept || "",
            amount: cost.amount ?? "",
            currency: cost.currency || "BS",
            hasFiscalCredit: Boolean(cost.hasFiscalCredit),
            creditRate: cost.fiscalCreditPercent ?? "",
          }))
        : defaultAdditionalCosts,
  };
};
/* fin - constantes para arracar con datos existentes */

function ImportationWizard({ mode = "create", initialData = null, onCancel, onSubmit }) {
  const [currentStep, setCurrentStep] = useState(0);
  // estado de los pasos
  const initialWizardState =
    mode === "edit" && initialData
      ? mapApiDataToWizardState(initialData)
      : {
          generalData: {
            supplier: "",
            reference: "",
            date: "",
            officialExchangeRate: "6.96",
            bankExchangeRate: "",
          },
          products: [{ ...emptyProduct }],
          expenses: defaultExpenses,
          additionalCosts: defaultAdditionalCosts,
        };
  const [generalData, setGeneralData] = useState(initialWizardState.generalData);
  const [products, setProducts] = useState(initialWizardState.products);
  const [expenses, setExpenses] = useState(initialWizardState.expenses); //estados de gastos base
  const [additionalCosts, setAdditionalCosts] = useState(initialWizardState.additionalCosts); // estado de gastos adicionales
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

  const handleSubmit = (status) => {
    const payload = {
      status,
      generalData,
      products,
      expenses,
      additionalCosts,
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
    // paso -> gastos base
    if (currentStep === 2) {
      return (
        <ExpensesStep
          expenses={expenses}
          onChangeExpenses={setExpenses}
        />
      );
    }
    // paso -> base imponible e impuestos
    if (currentStep === 3) {
      return (
        <SummaryStep
          generalData={generalData}
          products={products}
          expenses={expenses}
        />
      );
    }
    // paso -> gastos adicionales
    if (currentStep === 4) {
      return (
        <AdditionalCostsStep
          additionalCosts={additionalCosts}
          onChangeAdditionalCosts={setAdditionalCosts}
          officialExchangeRate={generalData.officialExchangeRate}
        />
      );
    }
    // paso -> costo final
    return (
      <FinalCostStep
        generalData={generalData}
        products={products}
        expenses={expenses}
        additionalCosts={additionalCosts}
      />
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
            <WizardTitle>
              {mode === "edit" ? "Editar importación" : "Nueva importación"}
            </WizardTitle>
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
        {currentStep > 0 ? (
          <StepSecondaryButton type="button" onClick={handlePrevStep}>
            <ChevronLeft size={17} />
            Anterior
          </StepSecondaryButton>
        ) : (
          <div />
        )}
        <StepActionsRight>
          {currentStep < STEPS.length - 1 ? (
            <StepPrimaryButton type="button" onClick={handleNextStep}>
              Siguiente
              <ChevronRight size={17} />
            </StepPrimaryButton>
          ) : (
            <>
              <StepSecondaryButton type="button" onClick={() => handleSubmit("borrador")}>
                Guardar borrador
              </StepSecondaryButton>
              <StepPrimaryButton type="button" onClick={() => handleSubmit("verificado")}>
                Guardar verificado
              </StepPrimaryButton>
            </>
          )}
        </StepActionsRight>
      </StepActions>
    </WizardCard>
  );
}

export default ImportationWizard;
