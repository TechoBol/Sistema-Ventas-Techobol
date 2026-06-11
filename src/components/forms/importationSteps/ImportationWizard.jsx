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
  StepActions,
  StepActionsRight,
  StepSecondaryButton,
  StepPrimaryButton,
} from "../../ui/ImportationWizard.styles";
import BanksStep from "./BanksStep";

const STEPS = [
  "Datos generales",
  "Productos",
  "Gastos base",
  "Base imponible e impuestos",
  "Pagos de bancos",
  "Gastos adicionales",
  "Costo final",
];

function ImportationWizard({ onCancel, onSubmit }) {
  const [currentStep, setCurrentStep] = useState(0);
  // estado de los pasos
  const [generalData, setGeneralData] = useState({
    supplier: "",
    reference: "",
    date: "",
    officialExchangeRate: "6.96",
    bankExchangeRate: "",
  });
  const [products, setProducts] = useState([
    {
      productCode: "",
      productName: "",
      referenceQuantity: "",
      baseQuantity: "",
      priceUsd: "",
      gaPercent: "",
    },
  ]);
  // estados de gastos base
  const [expenses, setExpenses] = useState({
    freights: [
      { name: "Flete Naviero (FLETE I)", amount: "" },
      { name: "Flete terrestre Frontera FLETE(II)", amount: "" },
    ],
    insurances: [{ name: "", amount: "" }],
    portCosts: [{ name: "", amount: "" }],
    otherCosts: [{ name: "", amount: "" }],
  });
  // estado de gastos adicionales
  const [additionalCosts, setAdditionalCosts] = useState([
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
  ]);
  // funciones del contenido los pasos
  const handleGeneralDataChange = (field, value) => {
    setGeneralData((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleNextStep = () =>
    setCurrentStep((p) => Math.min(p + 1, STEPS.length - 1));
  const handlePrevStep = () => setCurrentStep((p) => Math.max(p - 1, 0));
  const handleGoToStep = (i) => setCurrentStep(i);

  const handleSubmit = (status) => {
    onSubmit?.({
      status,
      generalData,
      products,
      expenses,
      additionalCosts,
      bankBlocks,
    });
  };

  const renderStepContent = () => {
    if (currentStep === 0)
      return (
        <GeneralDataStep
          formData={generalData}
          onChange={handleGeneralDataChange}
        />
      );

    if (currentStep === 1)
      return (
        <ProductsStep products={products} onChangeProducts={setProducts} />
      );

    if (currentStep === 2)
      return (
        <ExpensesStep expenses={expenses} onChangeExpenses={setExpenses} />
      );

    if (currentStep === 3)
      return (
        <SummaryStep
          generalData={generalData}
          products={products}
          expenses={expenses}
          setTotalProductosUsd={setTotalProductosUsd}
        />
      );

    if (currentStep === 4)
      return (
        <BanksStep
          blocks={bankBlocks}
          onChangeBlocks={setBankBlocks}
          totalAnticipo={bankTotals.montoUsd}
          totalComision={bankTotals.comisionUsd}
          totalItf={bankTotals.itfUsd}
          totalAnticipoBs={bankTotals.montoBs}
          totalComisionBs={bankTotals.comisionBs}
          totalItfBs={bankTotals.itfBs}
          diferenciaTC={diferenciaTC}
        />
      );

    return (
      <AdditionalCostsStep
        additionalCosts={additionalCosts}
        onChangeAdditionalCosts={setAdditionalCosts}
        officialExchangeRate={generalData.officialExchangeRate}
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
              Siguiente <ChevronRight size={17} />
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
