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

const roundToFourDecimals = (value) => {
  return Math.round((Number(value || 0) + Number.EPSILON) * 10000) / 10000;
};

const formatBs = (value) =>
  `Bs ${Number(value || 0).toLocaleString("es-BO", {
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
  additionalCosts,
}) {
  const officialExchangeRate = Number(generalData.officialExchangeRate || 0);

  const getProductSubtotalUsd = (product) => {
    const baseQuantity = Number(product.baseQuantity || 0);
    const priceUsd = Number(product.priceUsd || 0);

    return roundToFourDecimals(baseQuantity * priceUsd);
  };

  const getSectionTotalUsd = (items = []) => {
    const total = items.reduce((acc, item) => acc + Number(item.amount || 0), 0);

    return roundToFourDecimals(total);
  };

  const getAdditionalCostCalculation = (cost) => {
    const amount = Number(cost.amount || 0);
    const creditRate = Number(cost.creditRate || 0) / 100;

    const amountUsd =
      cost.currency === "USD"
        ? roundToFourDecimals(amount)
        : officialExchangeRate > 0
          ? roundToFourDecimals(amount / officialExchangeRate)
          : 0;

    const amountBs =
      cost.currency === "BS"
        ? roundToFourDecimals(amount)
        : roundToFourDecimals(amount * officialExchangeRate);

    const fiscalCreditBs = cost.hasFiscalCredit
      ? roundToFourDecimals(amountBs * creditRate)
      : 0;

    const netAmountBs = roundToFourDecimals(amountBs - fiscalCreditBs);

    return {
      amountUsd,
      amountBs,
      fiscalCreditBs,
      netAmountBs,
    };
  };

  const totals = useMemo(() => {
    const totalProductsUsd = roundToFourDecimals(
      products.reduce(
        (acc, product) => acc + getProductSubtotalUsd(product),
        0
      )
    );

    const totalFreightsUsd = getSectionTotalUsd(expenses.freights);
    const totalInsurancesUsd = getSectionTotalUsd(expenses.insurances);
    const totalPortCostsUsd = getSectionTotalUsd(expenses.portCosts);

    const totalAdditionalCosts = additionalCosts.reduce(
      (acc, cost) => {
        const calculation = getAdditionalCostCalculation(cost);

        return {
          amountUsd: roundToFourDecimals(acc.amountUsd + calculation.amountUsd),
          amountBs: roundToFourDecimals(acc.amountBs + calculation.amountBs),
          fiscalCreditBs: roundToFourDecimals(
            acc.fiscalCreditBs + calculation.fiscalCreditBs
          ),
          netAmountBs: roundToFourDecimals(
            acc.netAmountBs + calculation.netAmountBs
          ),
        };
      },
      {
        amountUsd: 0,
        amountBs: 0,
        fiscalCreditBs: 0,
        netAmountBs: 0,
      }
    );

    return {
      totalProductsUsd,
      totalFreightsUsd,
      totalInsurancesUsd,
      totalPortCostsUsd,
      totalAdditionalCosts,
    };
  }, [products, expenses, additionalCosts, officialExchangeRate]);

  const finalRows = useMemo(() => {
    const rows = products.map((product, index) => {
      const subtotalUsd = getProductSubtotalUsd(product);

      const factor =
        totals.totalProductsUsd > 0
          ? subtotalUsd / totals.totalProductsUsd
          : 0;

      const productValueBs = roundToFourDecimals(
        subtotalUsd * officialExchangeRate
      );

      const freightsBs = roundToFourDecimals(
        totals.totalFreightsUsd * officialExchangeRate * factor
      );

      const insurancesBs = roundToFourDecimals(
        totals.totalInsurancesUsd * officialExchangeRate * factor
      );

      const portCostsBs = roundToFourDecimals(
        totals.totalPortCostsUsd * officialExchangeRate * factor
      );

      const cifBs = roundToFourDecimals(
        productValueBs + freightsBs + insurancesBs + portCostsBs
      );

      const gaPercent = Number(product.gaPercent || 0);
      const gaRate = gaPercent / 100;

      const gaBs = roundToFourDecimals(cifBs * gaRate);

      const valueAfterTaxesBs = roundToFourDecimals(cifBs + gaBs);

      const additionalAssignedBs = roundToFourDecimals(
        totals.totalAdditionalCosts.netAmountBs * factor
      );

      const finalCostBs = roundToFourDecimals(
        valueAfterTaxesBs + additionalAssignedBs
      );

      const referenceQuantity = Number(product.referenceQuantity || 0);
      const unitCostBs =
        referenceQuantity > 0
          ? roundToFourDecimals(finalCostBs / referenceQuantity)
          : null;

      return {
        id: index + 1,
        productCode: product.productCode || "Sin código",
        productName: product.productName || "Sin nombre",
        factor,
        valueAfterTaxesBs,
        additionalAssignedBs,
        finalCostBs,
        referenceQuantity,
        unitCostBs,
      };
    });

    const totalValueAfterTaxesBs = roundToFourDecimals(
      rows.reduce((acc, row) => acc + row.valueAfterTaxesBs, 0)
    );

    const totalAdditionalAssignedBs = roundToFourDecimals(
      rows.reduce((acc, row) => acc + row.additionalAssignedBs, 0)
    );

    const totalFinalCostBs = roundToFourDecimals(
      rows.reduce((acc, row) => acc + row.finalCostBs, 0)
    );

    return {
      rows,
      totalValueAfterTaxesBs,
      totalAdditionalAssignedBs,
      totalFinalCostBs,
    };
  }, [products, totals, officialExchangeRate]);

  return (
    <StepPanel>
      <SectionHeader>
        <StepPanelTitle>Costo final por producto</StepPanelTitle>
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
          <span>Valor después de impuestos</span>
          <strong>{formatBs(finalRows.totalValueAfterTaxesBs)}</strong>
        </SummaryCard>

        <SummaryCard>
          <span>Gastos adicionales netos</span>
          <strong>{formatBs(totals.totalAdditionalCosts.netAmountBs)}</strong>
        </SummaryCard>

        <SummaryCard>
          <span>Crédito fiscal gastos</span>
          <strong>{formatBs(totals.totalAdditionalCosts.fiscalCreditBs)}</strong>
        </SummaryCard>

        <SummaryCard $highlight>
          <span>Costo final total</span>
          <strong>{formatBs(finalRows.totalFinalCostBs)}</strong>
        </SummaryCard>
      </SummaryCardsGrid>

      <FinalCostTableWrapper>
        <FinalCostTable>
          <FinalCostTableHead>
            <span>Código</span>
            <span>Producto</span>
            <span>Factor</span>
            <span>Valor después impuestos Bs</span>
            <span>Gastos adicionales asignados Bs</span>
            <span>Costo final Bs</span>
            <span>Cantidad para costo unitario</span>
            <span>Costo unitario Bs</span>
          </FinalCostTableHead>

          {finalRows.rows.map((item) => (
            <FinalCostTableRow key={item.id}>
              <FinalCostTableCell>{item.productCode}</FinalCostTableCell>
              <FinalCostTableCell>{item.productName}</FinalCostTableCell>

              <FinalCostTableCell>{formatFactor(item.factor)}</FinalCostTableCell>

              <FinalCostTableCell>
                {formatBs(item.valueAfterTaxesBs)}
              </FinalCostTableCell>

              <FinalCostTableCell>
                {formatBs(item.additionalAssignedBs)}
              </FinalCostTableCell>

              <FinalCostTableCell>
                <strong>{formatBs(item.finalCostBs)}</strong>
              </FinalCostTableCell>

              <FinalCostTableCell>
                {formatQuantity(item.referenceQuantity)}
              </FinalCostTableCell>

              <FinalCostTableCell>
                <strong>{formatBs(item.unitCostBs)}</strong>
              </FinalCostTableCell>
            </FinalCostTableRow>
          ))}

          <FinalCostTableFooter>
            <span>Total</span>
            <span></span>
            <span></span>
            <span>{formatBs(finalRows.totalValueAfterTaxesBs)}</span>
            <span>{formatBs(finalRows.totalAdditionalAssignedBs)}</span>
            <span>{formatBs(finalRows.totalFinalCostBs)}</span>
            <span></span>
            <span></span>
          </FinalCostTableFooter>
        </FinalCostTable>
      </FinalCostTableWrapper>
    </StepPanel>
  );
}

export default FinalCostStep;
