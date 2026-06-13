import React, { useMemo } from "react";
import { Plus, Trash2 } from "lucide-react";
import {
  StepPanel,
  SectionHeader,
  StepPanelTitle,
  AddButton,
  WizardInput,
  IconButton,
} from "../../ui/ImportationWizard.styles";
import {
  BankTableWrapper,
  BankTableHead,
  BankTableRow,
  BankSelect,
  CalculatedValue,
  BankSummaryGrid,
  BankSummaryCard,
} from "../../ui/BanksStep.styles";
import { calculateBankPayments } from "../../utils/importationCalculations";

export const emptyBankPayment = {
  paymentType: "PAYMENT",
  date: "",
  bankName: "BCP",
  amountUsd: "",
  bankExchangeRate: "",
  commissionUsd: "",
  itfEntryUsd: "",
};

const formatUsd = (value) =>
  `$ ${Number(value || 0).toLocaleString("en-US", {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  })}`;

const formatBs = (value) =>
  `Bs ${Number(value || 0).toLocaleString("es-BO", {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  })}`;

function BanksStep({
  bankPayments,
  onChangeBankPayments,
  officialExchangeRate,
  products = [],
  expenses = {},
  maritimeFreightExchangeRate,
  onChangeMaritimeFreightExchangeRate,
}) {
  const calculations = useMemo(
    () =>
      calculateBankPayments({
        payments: bankPayments,
        officialExchangeRate,
        products,
        expenses,
        maritimeFreightExchangeRate,
      }),
    [
      bankPayments,
      officialExchangeRate,
      products,
      expenses,
      maritimeFreightExchangeRate,
    ]
  );

  const handleAddPayment = () => {
    onChangeBankPayments([
      ...bankPayments,
      {
        ...emptyBankPayment,
        bankExchangeRate: "",
      },
    ]);
  };

  const handleChange = (index, field, value) => {
    const updatedPayments = bankPayments.map((payment, paymentIndex) =>
      paymentIndex === index
        ? {
            ...payment,
            [field]: value,
          }
        : payment
    );
    onChangeBankPayments(updatedPayments);
  };

  const handleRemove = (index) => {
    if (bankPayments.length === 1) return;
    onChangeBankPayments(
      bankPayments.filter((_, paymentIndex) => paymentIndex !== index)
    );
  };

  return (
    <StepPanel>
      <SectionHeader>
        <StepPanelTitle>Pagos bancarios</StepPanelTitle>
        <AddButton type="button" onClick={handleAddPayment}>
          <Plus size={15} />
          Agregar pago
        </AddButton>
      </SectionHeader>

      <BankTableWrapper>
        <BankTableHead>
          <span>Tipo de pago</span>
          <span>Fecha</span>
          <span>Banco</span>
          <span>Monto USD</span>
          <span>T/C banco</span>
          <span>Pago Bs</span>
          <span>Comisión USD</span>
          <span>Comisión Bs</span>
          <span>ITF entrada USD</span>
          <span>ITF salida USD</span>
          <span></span>
        </BankTableHead>

        {calculations.rows.map((row, index) => (
          <BankTableRow key={row.id}>
            <BankSelect
              value={bankPayments[index]?.paymentType || "PAYMENT"}
              onChange={(event) =>
                handleChange(index, "paymentType", event.target.value)
              }
            >
              <option value="ADVANCE">Anticipo</option>
              <option value="PAYMENT">Pago</option>
              <option value="FINAL_PAYMENT">Pago final</option>
            </BankSelect>

            <WizardInput
              type="date"
              value={bankPayments[index]?.date || ""}
              onChange={(event) =>
                handleChange(index, "date", event.target.value)
              }
            />

            <WizardInput
              type="text"
              placeholder="Ej: BCP"
              value={bankPayments[index]?.bankName || ""}
              onChange={(event) =>
                handleChange(index, "bankName", event.target.value)
              }
            />

            <WizardInput
              type="number"
              min="0"
              step="0.0001"
              placeholder="0.0000"
              value={bankPayments[index]?.amountUsd || ""}
              onChange={(event) =>
                handleChange(index, "amountUsd", event.target.value)
              }
            />

            <WizardInput
              type="number"
              min="0"
              step="0.0001"
              placeholder="Ej: 12.0000"
              value={bankPayments[index]?.bankExchangeRate || ""}
              onChange={(event) =>
                handleChange(index, "bankExchangeRate", event.target.value)
              }
            />

            <CalculatedValue>{formatBs(row.paymentAmountBs)}</CalculatedValue>

            <WizardInput
              type="number"
              min="0"
              step="0.0001"
              placeholder="Según banco"
              value={bankPayments[index]?.commissionUsd || ""}
              onChange={(event) =>
                handleChange(index, "commissionUsd", event.target.value)
              }
            />

            <CalculatedValue>{formatBs(row.commissionBs)}</CalculatedValue>

            <WizardInput
              type="number"
              min="0"
              step="0.0001"
              placeholder="Según banco"
              value={bankPayments[index]?.itfEntryUsd || ""}
              onChange={(event) =>
                handleChange(index, "itfEntryUsd", event.target.value)
              }
            />

            <CalculatedValue>{formatUsd(row.itfExitUsd)}</CalculatedValue>

            <IconButton
              type="button"
              title="Eliminar pago"
              disabled={bankPayments.length === 1}
              onClick={() => handleRemove(index)}
            >
              <Trash2 size={16} />
            </IconButton>
          </BankTableRow>
        ))}
      </BankTableWrapper>

      <BankSummaryGrid>
        <BankSummaryCard>
          <span>Total pagado al proveedor</span>
          <strong>{formatUsd(calculations.totals.totalPaymentUsd)}</strong>
        </BankSummaryCard>

        <BankSummaryCard>
          <span>Total pagado en bolivianos</span>
          <strong>{formatBs(calculations.totals.totalPaymentBs)}</strong>
        </BankSummaryCard>

        <BankSummaryCard $highlight>
          <span>Comisiones bancarias USD</span>
          <strong>{formatUsd(calculations.totals.totalCommissionUsd)}</strong>
        </BankSummaryCard>

        <BankSummaryCard $highlight>
          <span>Comisiones bancarias Bs</span>
          <strong>{formatBs(calculations.totals.totalCommissionBs)}</strong>
        </BankSummaryCard>

        <BankSummaryCard $highlight>
          <span>ITF total USD</span>
          <strong>{formatUsd(calculations.totals.totalItfUsd)}</strong>
        </BankSummaryCard>

        <BankSummaryCard $highlight>
          <span>ITF total Bs</span>
          <strong>{formatBs(calculations.totals.totalItfBs)}</strong>
        </BankSummaryCard>
      </BankSummaryGrid>

      {/* tipo de cambio naviero */}
      <div style={{ marginTop: "24px", maxWidth: "300px" }}>
        <span
          style={{
            display: "block",
            marginBottom: "6px",
            fontSize: "12px",
            fontWeight: 700,
            color: "#475569",
          }}
        >
          T/C flete naviero
        </span>
        <WizardInput
          type="number"
          min="0"
          step="0.0001"
          placeholder="Opcional"
          value={maritimeFreightExchangeRate || ""}
          onChange={(event) =>
            onChangeMaritimeFreightExchangeRate?.(event.target.value)
          }
        />
      </div>

      <BankSummaryGrid>
        {/* tipo de cambio */}
        <BankSummaryCard>
          <span>Total registro DIM Bs</span>
          <strong>
            {formatBs(calculations.totals.totalRegisteredDimBs)}
          </strong>
        </BankSummaryCard>
        <BankSummaryCard>
          <span>Total real pagos Bs</span>
          <strong>
            {formatBs(calculations.totals.totalRealPaymentsBs)}
          </strong>
        </BankSummaryCard>
        <BankSummaryCard $highlight>
          <span>Diferencia tipo de cambio Bs</span>
          <strong>
            {formatBs(calculations.totals.totalExchangeDifferenceBs)}
          </strong>
        </BankSummaryCard>
      </BankSummaryGrid>
    </StepPanel>
  );
}

export default BanksStep;
