import React, { useState } from "react";
import GeneralDataStep from "./GeneralDataStep";
import ProductsStep from "./ProductsStep";
import ExpensesStep from "./ExpensesStep";
import SummaryStep from "./SummaryStep";
import AdditionalCostsStep from "./AdditionalCostsStep";
import { ArrowLeft, Check, ChevronLeft, ChevronRight } from "lucide-react";
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
];

function ImportationWizard({ onCancel, onSubmit }) {
  const [currentStep, setCurrentStep] = useState(0);

  const [generalData, setGeneralData] = useState({
    supplier: "",
    reference: "",
    date: "",
    officialExchangeRate: 6.96,
    bankExchangeRate: "",
  });

  const [products, setProducts] = useState([
    {
      productName: "",
      baseQuantity: "",
      referenceQuantity: "",
      priceUsd: "",
      gaPercent: "",
    },
  ]);

  const [expenses, setExpenses] = useState({
    freights: [{ name: "", amount: "" }],
    insurances: [{ name: "", amount: "" }],
    portCosts: [{ name: "", amount: "" }],
    otherCosts: [{ name: "", amount: "" }],
  });

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

  // ── Estado de bancos ──────────────────────────────────────────────
  const [bankBlocks, setBankBlocks] = useState([
    {
      id: 1,
      type: "anticipo",
      banco: "",
      monto: "",
      tc: "",
      comisionUsd: "",
      itfSalidaUsd: "",
      itfIngresoUsd: "",
    },
  ]);

  // ── totalProductosUsd viene de SummaryStep ────────────────────────
  const [totalProductosUsd, setTotalProductosUsd] = useState(0);

  // ── Función de cálculo por bloque ─────────────────────────────────
  function calcBlockTotals({
    monto,
    tc,
    comisionUsd,
    itfSalidaUsd,
    itfIngresoUsd,
  }) {
    const m = parseFloat(monto) || 0;
    const t = parseFloat(tc) || 1;
    const com = parseFloat(comisionUsd) || 0;
    const its = parseFloat(itfSalidaUsd) || 0;
    const iti = parseFloat(itfIngresoUsd) || 0;
    const comisionBs = com * 6.97;
    const itfSalidaBs = its * t;
    const itfIngresoBs = iti * t;
    const total1Usd = m + com;
    const total1Bs = m * t + comisionBs;
    return {
      totalUsd: total1Usd + its + iti,
      totalBs: total1Bs + itfSalidaBs + itfIngresoBs,
      comisionUsd: com,
      comisionBs,
      itfUsd: its + iti,
      itfBs: itfSalidaBs + itfIngresoBs,
    };
  }

  // ── Totales bancarios ─────────────────────────────────────────────
  const bankTotals = bankBlocks.reduce(
    (acc, b) => {
      const c = calcBlockTotals(b);
      acc.montoUsd += parseFloat(b.monto) || 0;
      acc.montoBs += (parseFloat(b.monto) || 0) * (parseFloat(b.tc) || 1);
      acc.comisionUsd += c.comisionUsd;
      acc.comisionBs += c.comisionBs;
      acc.itfUsd += c.itfUsd;
      acc.itfBs += c.itfBs;
      return acc;
    },
    {
      montoUsd: 0,
      montoBs: 0,
      comisionUsd: 0,
      comisionBs: 0,
      itfUsd: 0,
      itfBs: 0,
    },
  );

  // ── Variables para diferencia TC ──────────────────────────────────
  const tcOficial = parseFloat(generalData.officialExchangeRate) || 1;
  const tcBancario = parseFloat(generalData.bankExchangeRate) || 1;

  const totalFletes = expenses.freights.reduce(
    (acc, f) => acc + Number(f.amount || 0),
    0,
  );
  const totalSeguros = expenses.insurances.reduce(
    (acc, s) => acc + Number(s.amount || 0),
    0,
  );
  const totalPortCosts = expenses.portCosts.reduce(
    (acc, p) => acc + Number(p.amount || 0),
    0,
  );

  const flete1Usd = Number(expenses.freights[0]?.amount || 0);
  const flete2Usd = Number(expenses.freights[1]?.amount || 0);
  const flete1Bs = flete1Usd * tcBancario; // flete 1 × tipo de cambio bancario
  const flete2Bs = flete2Usd * tcOficial; // flete 2 × tipo de cambio oficial

  const fletes = flete1Bs + flete2Bs;

  const baseImponibleBs =
    (totalProductosUsd + totalFletes + totalSeguros + totalPortCosts) *
    tcOficial;
ñ
  const segurosBs = totalSeguros * tcOficial;
  const restaFinal = bankTotals.montoBs + segurosBs + fletes;
  const diferenciaTC = baseImponibleBs - restaFinal;

  // ── Handlers ──────────────────────────────────────────────────────
  const handleGeneralDataChange = (field, value) =>
    setGeneralData((cur) => ({ ...cur, [field]: value }));

  const handleNextStep = () =>
    setCurrentStep((p) => Math.min(p + 1, STEPS.length - 1));
  const handlePrevStep = () => setCurrentStep((p) => Math.max(p - 1, 0));
  const handleGoToStep = (i) => setCurrentStep(i);

  const handleSubmit = () => {
    onSubmit?.({
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
              <ChevronLeft size={17} /> Anterior
            </StepSecondaryButton>
          )}
          {currentStep < STEPS.length - 1 ? (
            <StepPrimaryButton type="button" onClick={handleNextStep}>
              Siguiente <ChevronRight size={17} />
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
