import React, { useMemo } from "react";
import {
  StepPanel,
  SectionHeader,
  StepPanelTitle,
  SummaryCardsGrid,
  SummaryCard,
  FinalCostTableWrapper,
  FinalCostTable,
  FinalCostTableHead,
  FinalCostTableRow,
  FinalCostTableCell,
  FinalCostTableFooter,
} from "../../ui/ImportationWizard.styles";
import { calculateImportation } from "../../utils/importationCalculations";

const formatBs = (value) =>
  `Bs ${Number(value || 0).toLocaleString("es-BO", {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  })}`;

const formatUsd = (value) =>
  `$ ${Number(value || 0).toLocaleString("en-US", {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  })}`;

const formatQuantity = (value) =>
  Number(value || 0).toLocaleString("en-US", {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  });

const formatFactor = (value) =>
  Number(value || 0).toLocaleString("en-US", {
    minimumFractionDigits: 7,
    maximumFractionDigits: 7,
  });

function FinalCostStep({
  generalData,
  products,
  expenses,
  bankPayments,
  additionalCosts,
}) {
  const calculations = useMemo(
    () =>
      calculateImportation({
        generalData,
        products,
        expenses,
        bankPayments,
        additionalCosts,
      }),
    [
      generalData,
      products,
      expenses,
      bankPayments,
      additionalCosts,
    ]
  );

  const {
    finalRows,
    totals,
    bankCalculation,
  } = calculations;

  return (
    <StepPanel>
      <SectionHeader>
        <StepPanelTitle>Costo final por producto</StepPanelTitle>
      </SectionHeader>

      <SummaryCardsGrid>
        <SummaryCard>
          <span>Proveedor</span>
          <strong>
            {generalData.supplier || "Sin proveedor"}
          </strong>
        </SummaryCard>

        <SummaryCard>
          <span>Referencia</span>
          <strong>
            {generalData.reference || "Sin referencia"}
          </strong>
        </SummaryCard>

        <SummaryCard>
          <span>Valor después de impuestos</span>
          <strong>
            {formatBs(
              totals.totalValueAfterTaxesBs
            )}
          </strong>
        </SummaryCard>

        <SummaryCard>
          <span>Comisiones bancarias</span>
          <strong>
            {formatUsd(
              bankCalculation?.totals
                ?.totalCommissionUsd
            )}
          </strong>
        </SummaryCard>

        <SummaryCard>
          <span>ITF bancario</span>
          <strong>
            {formatUsd(
              bankCalculation?.totals
                ?.totalItfUsd
            )}
          </strong>
        </SummaryCard>

        <SummaryCard>
          <span>Gastos adicionales netos</span>
          <strong>
            {formatBs(
              totals.totalAdditionalCosts
                .netAmountBs
            )}
          </strong>
        </SummaryCard>

        <SummaryCard>
          <span>Crédito fiscal gastos</span>
          <strong>
            {formatBs(
              totals.totalAdditionalCosts
                .fiscalCreditBs
            )}
          </strong>
        </SummaryCard>

        <SummaryCard $highlight>
          <span>Costo final total</span>
          <strong>
            {formatBs(
              totals.totalFinalCostBs
            )}
          </strong>
        </SummaryCard>
      </SummaryCardsGrid>

      <FinalCostTableWrapper>
        <FinalCostTable>
          <FinalCostTableHead>
            <span>Código</span>
            <span>Producto</span>
            <span>Factor</span>
            <span>
              Valor después impuestos Bs
            </span>
            <span>
              Gastos adicionales asignados Bs
            </span>
            <span>Costo final Bs</span>
            <span>Cantidad referencial</span>
            <span>Costo unitario Bs</span>
          </FinalCostTableHead>

          {finalRows.map((item) => (
            <FinalCostTableRow key={item.id}>
              <FinalCostTableCell>{item.productCode}</FinalCostTableCell>
              <FinalCostTableCell>{item.productName}</FinalCostTableCell>
              <FinalCostTableCell>{formatFactor(item.factor)}</FinalCostTableCell>
              <FinalCostTableCell>{formatBs(item.valueAfterTaxesBs)}</FinalCostTableCell>
              <FinalCostTableCell>{formatBs(item.additionalAssignedBs)}</FinalCostTableCell>
              <FinalCostTableCell>
                <strong>
                  {formatBs(item.finalCostBs)}
                </strong>
              </FinalCostTableCell>
              <FinalCostTableCell>{formatQuantity(item.referenceQuantity)}</FinalCostTableCell>
              <FinalCostTableCell>
                <strong>
                  {item.unitCostBs !== null
                    ? formatBs(item.unitCostBs)
                    : "Sin cantidad"}
                </strong>
              </FinalCostTableCell>
            </FinalCostTableRow>
          ))}

          <FinalCostTableFooter>
            <span>Total</span>
            <span></span>
            <span></span>
            <span>
              {formatBs(totals.totalValueAfterTaxesBs)}
            </span>
            <span>
              {formatBs(totals.totalAdditionalAssignedBs)}
            </span>
            <span>
              {formatBs(totals.totalFinalCostBs)}
            </span>
            <span></span>
            <span></span>
          </FinalCostTableFooter>
        </FinalCostTable>
      </FinalCostTableWrapper>
    </StepPanel>
  );
}

export default FinalCostStep;
