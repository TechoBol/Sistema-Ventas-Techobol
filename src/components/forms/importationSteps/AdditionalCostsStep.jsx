import React, { useMemo } from "react";
import { Plus, Trash2, LockKeyhole } from "lucide-react";
import {
  StepPanel,
  SectionHeader,
  StepPanelTitle,
  AddButton,
  AdditionalCostsTableWrapper,
  AdditionalCostsTableHeader,
  AdditionalCostsTableRow,
  WizardInput,
  WizardSelect,
  CreditCheckLabel,
  IconButton,
  AdditionalCostsTotals,
} from "../../ui/ImportationWizard.styles";
import { buildBankAdditionalCosts, calculateAdditionalCost, roundToFourDecimals } from "../../utils/importationCalculations";

const emptyAdditionalCost = {
  concept: "",
  amount: "",
  currency: "USD",
  hasFiscalCredit: false,
  creditRate: "13",
  source: "MANUAL",
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

function AdditionalCostsStep({
  additionalCosts,
  onChangeAdditionalCosts,
  officialExchangeRate,
  bankPayments = [],
}) {
  const exchangeRate = Number(officialExchangeRate || 0);

  /*
   * Genera automáticamente:
   * - Comisiones Bancarias DÓLARES
   * - ITF USD
   * Sus montos se obtienen desde el paso Pagos bancarios
   */
  const bankAdditionalCosts = useMemo(
    () =>
      buildBankAdditionalCosts(
        bankPayments,
        exchangeRate
      ),
    [bankPayments, exchangeRate]
  );

  /*
   * Las filas manuales vienen del estado del wizard.
   * Las filas bancarias solo se agregan para visualización y cálculo.
   */
  const displayedCosts = useMemo(
    () => [
      ...(Array.isArray(additionalCosts)
        ? additionalCosts
        : []),
      ...bankAdditionalCosts,
    ],
    [additionalCosts, bankAdditionalCosts]
  );

  /* Todos los cálculos, tanto manuales como bancarios, usan la misma función centralizada */
  const calculatedRows = useMemo(
    () =>
      displayedCosts.map((cost) => ({
        ...cost,
        calculation: calculateAdditionalCost(
          cost,
          exchangeRate
        ),
      })),
    [displayedCosts, exchangeRate]
  );

  const totals = useMemo(() => {
    return calculatedRows.reduce(
      (accumulator, row) => {
        const calculation = row.calculation;

        return {
          amountUsd: roundToFourDecimals(accumulator.amountUsd + calculation.amountUsd),
          amountBs: roundToFourDecimals(accumulator.amountBs + calculation.amountBs),
          fiscalCreditBs: roundToFourDecimals(accumulator.fiscalCreditBs + calculation.fiscalCreditBs),
          netAmountBs: roundToFourDecimals(accumulator.netAmountBs + calculation.netAmountBs),
        };
      },
      {
        amountUsd: 0,
        amountBs: 0,
        fiscalCreditBs: 0,
        netAmountBs: 0,
      }
    );
  }, [calculatedRows]);

  /* Solo modifica las filas manuales, las bancarias nunca entran a este estado */
  const handleChange = (index, field, value) => {
    const updatedCosts = additionalCosts.map(
      (cost, costIndex) =>
        costIndex === index
          ? {
              ...cost,
              [field]: value,
            }
          : cost
    );
    onChangeAdditionalCosts(updatedCosts);
  };

  const handleCheckChange = (
    index,
    checked
  ) => {
    const updatedCosts = additionalCosts.map(
      (cost, costIndex) =>
        costIndex === index
          ? {
              ...cost,
              hasFiscalCredit: checked,
            }
          : cost
    );
    onChangeAdditionalCosts(updatedCosts);
  };

  const handleAddCost = () => {
    onChangeAdditionalCosts([
      ...additionalCosts,
      { ...emptyAdditionalCost },
    ]);
  };

  const handleRemoveCost = (index) => {
    if (additionalCosts.length === 1) return;
    const updatedCosts =
      additionalCosts.filter(
        (_, costIndex) =>
          costIndex !== index
      );
    onChangeAdditionalCosts(updatedCosts);
  };

  return (
    <StepPanel>
      <SectionHeader>
        <StepPanelTitle>Gastos adicionales de importación</StepPanelTitle>
        <AddButton
          type="button"
          onClick={handleAddCost}
        >
          <Plus size={15} />
          Agregar gasto
        </AddButton>
      </SectionHeader>

      <AdditionalCostsTableWrapper>
        <AdditionalCostsTableHeader>
          <span>Concepto</span>
          <span>Monto</span>
          <span>Moneda</span>
          <span>Importe USD</span>
          <span>Importe Bs</span>
          <span>Crédito fiscal</span>
          <span>Crédito fiscal Bs</span>
          <span>Importe neto Bs</span>
          <span></span>
        </AdditionalCostsTableHeader>

        {calculatedRows.map(
          (row, index) => {
            const isBankCost = row.source === "BANK";
            const manualIndex = index;

            return (
              <AdditionalCostsTableRow
                key={`${row.source}-${row.concept}-${index}`}
                style={
                  isBankCost
                    ? { background: "#f8fafc" }
                    : undefined
                }
              >
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                  }}
                >
                  <WizardInput
                    type="text"
                    placeholder="Concepto del gasto..."
                    value={row.concept}
                    disabled={isBankCost}
                    onChange={(event) =>
                      handleChange(
                        manualIndex,
                        "concept",
                        event.target.value
                      )
                    }
                  />

                  {isBankCost && (
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        marginTop: "4px",
                        color: "#64748b",
                        fontSize: "10px",
                        fontWeight: 600,
                      }}
                    >
                      <LockKeyhole size={11} />
                      Calculado desde pagos bancarios
                    </span>
                  )}
                </div>

                <WizardInput
                  type="number"
                  min="0"
                  step="0.0001"
                  placeholder="0"
                  value={row.amount}
                  disabled={isBankCost}
                  onChange={(event) =>
                    handleChange(
                      manualIndex,
                      "amount",
                      event.target.value
                    )
                  }
                />

                <WizardSelect
                  value={row.currency}
                  disabled={isBankCost}
                  onChange={(event) =>
                    handleChange(
                      manualIndex,
                      "currency",
                      event.target.value
                    )
                  }
                >
                  <option value="USD">USD</option>
                  <option value="BS">Bs</option>
                </WizardSelect>

                <strong>{formatUsd(row.calculation.amountUsd)}</strong>
                <strong>{formatBs(row.calculation.amountBs)}</strong>

                <CreditCheckLabel>
                  <input
                    type="checkbox"
                    checked={row.hasFiscalCredit}
                    disabled={isBankCost}
                    onChange={(event) =>
                      handleCheckChange(
                        manualIndex,
                        event.target.checked
                      )
                    }
                  />

                  <span>
                    {row.hasFiscalCredit
                      ? "Aplica"
                      : "No aplica"}
                  </span>

                  <WizardInput
                    type="number"
                    min="0"
                    step="0.01"
                    value={row.creditRate}
                    disabled={
                      isBankCost ||
                      !row.hasFiscalCredit
                    }
                    onChange={(event) =>
                      handleChange(
                        manualIndex,
                        "creditRate",
                        event.target.value
                      )
                    }
                  />
                </CreditCheckLabel>

                <strong>{formatBs(row.calculation.fiscalCreditBs)}</strong>
                <strong>{formatBs(row.calculation.netAmountBs)}</strong>

                {isBankCost ? (
                  <IconButton
                    type="button"
                    title="Calculado automáticamente"
                    disabled
                  >
                    <LockKeyhole size={15} />
                  </IconButton>
                ) : (
                  <IconButton
                    type="button"
                    title="Eliminar gasto"
                    disabled={
                      additionalCosts.length === 1
                    }
                    onClick={() =>
                      handleRemoveCost(
                        manualIndex
                      )
                    }
                  >
                    <Trash2 size={16} />
                  </IconButton>
                )}
              </AdditionalCostsTableRow>
            );
          }
        )}
      </AdditionalCostsTableWrapper>

      <AdditionalCostsTotals>
        <div>
          <span>Total importe USD:</span>
          <strong>{formatUsd(totals.amountUsd)}</strong>
        </div>

        <div>
          <span>Total importe Bs:</span>
          <strong>{formatBs(totals.amountBs)}</strong>
        </div>

        <div>
          <span>Total crédito fiscal:</span>
          <strong>{formatBs(totals.fiscalCreditBs)}</strong>
        </div>

        <div className="highlight">
          <span>Total neto distribuible:</span>
          <strong>{formatBs(totals.netAmountBs)}</strong>
        </div>
      </AdditionalCostsTotals>
    </StepPanel>
  );
}

export default AdditionalCostsStep;
