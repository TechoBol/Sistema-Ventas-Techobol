import React, { useMemo } from "react";

import {
  StepPanel,
  SectionHeader,
  StepPanelTitle,
  SummaryCardsGrid,
  SummaryCard,
  SummaryTableWrapper,
  SummaryTable,
  SummaryTableHead,
  SummaryTableRow,
  SummaryTableCell,
  SummaryTableFooter,
} from "../../ui/ImportationWizard.styles";

const roundToTwoDecimals = (value) => {
  return Math.round((Number(value || 0) + Number.EPSILON) * 100) / 100;
};

const formatUsd = (value) =>
  `${Number(value || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} USD`;

const formatBs = (value) =>
  `Bs ${Number(value || 0).toLocaleString("es-BO", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const formatQuantity = (value) =>
  Number(value || 0).toLocaleString("en-US", {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  });

const formatFactor = (value) =>
  Number(value || 0).toLocaleString("en-US", {
    minimumFractionDigits: 7,
    maximumFractionDigits: 7,
  });

function SummaryStep({ generalData, products, expenses }) {
  const officialExchangeRate = Number(generalData.officialExchangeRate || 0);

  const getProductSubtotal = (product) => {
    const quantity = Number(product.quantity || 0);
    const priceUsd = Number(product.priceUsd || 0);

    return roundToTwoDecimals(quantity * priceUsd);
  };

  const getSectionTotal = (items = []) => {
    const total = items.reduce((acc, item) => acc + Number(item.amount || 0), 0);

    return roundToTwoDecimals(total);
  };

  const totals = useMemo(() => {
    const totalProductsUsd = products.reduce(
      (acc, product) => acc + getProductSubtotal(product),
      0
    );

    const totalQuantity = products.reduce(
      (acc, product) => acc + Number(product.quantity || 0),
      0
    );

    const totalFreights = getSectionTotal(expenses.freights);
    const totalInsurances = getSectionTotal(expenses.insurances);
    const totalPortCosts = getSectionTotal(expenses.portCosts);
    const totalOtherCosts = getSectionTotal(expenses.otherCosts);

    const totalExpensesUsd = roundToTwoDecimals(
      totalFreights + totalInsurances + totalPortCosts + totalOtherCosts
    );

    const totalEstimatedUsd = roundToTwoDecimals(
      totalProductsUsd + totalExpensesUsd
    );

    const totalEstimatedBs = roundToTwoDecimals(
      totalEstimatedUsd * officialExchangeRate
    );

    return {
      totalProductsUsd: roundToTwoDecimals(totalProductsUsd),
      totalQuantity,
      totalFreights,
      totalInsurances,
      totalPortCosts,
      totalOtherCosts,
      totalExpensesUsd,
      totalEstimatedUsd,
      totalEstimatedBs,
    };
  }, [products, expenses, officialExchangeRate]);

  const productSummary = useMemo(() => {
    return products.map((product, index) => {
      const quantity = Number(product.quantity || 0);
      const subtotalUsd = getProductSubtotal(product);

      const factor =
        totals.totalProductsUsd > 0 ? subtotalUsd / totals.totalProductsUsd : 0;

      const gaPercent = Number(product.gaPercent || 0);
      const gaRate = gaPercent / 100;

      const assignedExpenseUsd = roundToTwoDecimals(
        totals.totalExpensesUsd * factor
      );

      const cifUsd = roundToTwoDecimals(subtotalUsd + assignedExpenseUsd);
      const gaUsd = roundToTwoDecimals(cifUsd * gaRate);
      const estimatedTotalUsd = roundToTwoDecimals(cifUsd + gaUsd);

      const estimatedUnitUsd =
        quantity > 0 ? roundToTwoDecimals(estimatedTotalUsd / quantity) : 0;

      const estimatedTotalBs = roundToTwoDecimals(
        estimatedTotalUsd * officialExchangeRate
      );

      const estimatedUnitBs =
        quantity > 0 ? roundToTwoDecimals(estimatedTotalBs / quantity) : 0;

      return {
        id: index + 1,
        code: product.code || "-",
        productName: product.productName || "Sin nombre",
        quantity,
        subtotalUsd,
        factor,
        gaPercent,
        assignedExpenseUsd,
        cifUsd,
        gaUsd,
        estimatedTotalUsd,
        estimatedUnitUsd,
        estimatedTotalBs,
        estimatedUnitBs,
      };
    });
  }, [products, totals, officialExchangeRate]);

  return (
    <StepPanel>
      <SectionHeader>
        <StepPanelTitle>Resumen de importación</StepPanelTitle>
      </SectionHeader>

      <SummaryCardsGrid>
        <SummaryCard>
          <span>Proveedor</span>
          <strong>{generalData.supplier || "Sin proveedor"}</strong>
        </SummaryCard>

        <SummaryCard>
          <span>Referencia</span>
          <strong>{generalData.reference || "Sin referencia"}</strong>
        </SummaryCard>

        <SummaryCard>
          <span>Fecha</span>
          <strong>{generalData.date || "Sin fecha"}</strong>
        </SummaryCard>

        <SummaryCard>
          <span>Cantidad total</span>
          <strong>{formatQuantity(totals.totalQuantity)}</strong>
        </SummaryCard>

        <SummaryCard>
          <span>Total productos</span>
          <strong>{formatUsd(totals.totalProductsUsd)}</strong>
        </SummaryCard>

        <SummaryCard>
          <span>Total gastos</span>
          <strong>{formatUsd(totals.totalExpensesUsd)}</strong>
        </SummaryCard>

        <SummaryCard $highlight>
          <span>Total estimado USD</span>
          <strong>{formatUsd(totals.totalEstimatedUsd)}</strong>
        </SummaryCard>

        <SummaryCard $highlight>
          <span>Total estimado Bs</span>
          <strong>
            {officialExchangeRate > 0
              ? formatBs(totals.totalEstimatedBs)
              : "Sin tipo de cambio"}
          </strong>
        </SummaryCard>
      </SummaryCardsGrid>

      <SummaryTableWrapper>
        <SummaryTable>
          <SummaryTableHead>
            <span>Código</span>
            <span>Producto</span>
            <span>Cantidad</span>
            <span>Subtotal USD</span>
            <span>Factor</span>
            <span>Gasto asignado</span>
            <span>CIF estimado</span>
            <span>GA %</span>
            <span>GA USD</span>
            <span>Costo total USD</span>
            <span>Costo unit. USD</span>
            <span>Costo total Bs</span>
            <span>Costo unit. Bs</span>
          </SummaryTableHead>

          {productSummary.map((item) => (
            <SummaryTableRow key={item.id}>
              <SummaryTableCell>{item.code}</SummaryTableCell>
              <SummaryTableCell>{item.productName}</SummaryTableCell>
              <SummaryTableCell>{formatQuantity(item.quantity)}</SummaryTableCell>
              <SummaryTableCell>{formatUsd(item.subtotalUsd)}</SummaryTableCell>
              <SummaryTableCell>{formatFactor(item.factor)}</SummaryTableCell>
              <SummaryTableCell>
                {formatUsd(item.assignedExpenseUsd)}
              </SummaryTableCell>
              <SummaryTableCell>
                {formatUsd(item.cifUsd)}
              </SummaryTableCell>
              <SummaryTableCell>
                {Number(item.gaPercent || 0).toFixed(2)}%
              </SummaryTableCell>
              <SummaryTableCell>
                {formatUsd(item.gaUsd)}
              </SummaryTableCell>
              <SummaryTableCell>
                <strong>{formatUsd(item.estimatedTotalUsd)}</strong>
              </SummaryTableCell>
              <SummaryTableCell>
                <strong>{formatUsd(item.estimatedUnitUsd)}</strong>
              </SummaryTableCell>
              <SummaryTableCell>
                {officialExchangeRate > 0
                  ? formatBs(item.estimatedTotalBs)
                  : "-"}
              </SummaryTableCell>
              <SummaryTableCell>
                {officialExchangeRate > 0
                  ? formatBs(item.estimatedUnitBs)
                  : "-"}
              </SummaryTableCell>
            </SummaryTableRow>
          ))}

          <SummaryTableFooter>
            <span></span>
            <span>Total</span>
            <span>{formatQuantity(totals.totalQuantity)}</span>
            <span>{formatUsd(totals.totalProductsUsd)}</span>
            <span></span>
            <span>{formatUsd(totals.totalExpensesUsd)}</span>
            <span>{formatUsd(totals.totalEstimatedUsd)}</span>
            <span></span>
            <span>
              {officialExchangeRate > 0
                ? formatBs(totals.totalEstimatedBs)
                : "-"}
            </span>
            <span></span>
          </SummaryTableFooter>
        </SummaryTable>
      </SummaryTableWrapper>
    </StepPanel>
  );
}

export default SummaryStep;
