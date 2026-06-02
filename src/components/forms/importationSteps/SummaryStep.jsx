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

const IVA_RATE = 0.1494;

const roundToFourDecimals = (value) => {
  return Math.round((Number(value || 0) + Number.EPSILON) * 10000) / 10000;
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

const formatPercent = (value) =>
  `${Number(value || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}%`;

const formatFactor = (value) =>
  Number(value || 0).toLocaleString("en-US", {
    minimumFractionDigits: 7,
    maximumFractionDigits: 7,
  });

function SummaryStep({ generalData, products, expenses }) {
  const officialExchangeRate = Number(generalData.officialExchangeRate || 0);

  /*
    Subtotal USD = Cantidad base * Precio USD
    Este subtotal es el equivalente a COMMODITIES en dólares.
  */
  const getProductSubtotalUsd = (product) => {
    const baseQuantity = Number(product.baseQuantity || 0);
    const priceUsd = Number(product.priceUsd || 0);

    return roundToFourDecimals(baseQuantity * priceUsd);
  };

  /*
    Total de una sección de gastos en USD.
    En este cálculo base usamos:
    - Fletes
    - Seguros
    - Gastos portuarios

    Otros gastos NO entran todavía aquí porque en el Excel aparecen
    en pasos posteriores al valor después de impuestos.
  */
  const getSectionTotalUsd = (items = []) => {
    const total = items.reduce((acc, item) => acc + Number(item.amount || 0), 0);

    return roundToFourDecimals(total);
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

    const totalBaseExpensesUsd = roundToFourDecimals(
      totalFreightsUsd + totalInsurancesUsd + totalPortCostsUsd
    );

    const totalProductsBs = roundToFourDecimals(
      totalProductsUsd * officialExchangeRate
    );

    const totalFreightsBs = roundToFourDecimals(
      totalFreightsUsd * officialExchangeRate
    );

    const totalInsurancesBs = roundToFourDecimals(
      totalInsurancesUsd * officialExchangeRate
    );

    const totalPortCostsBs = roundToFourDecimals(
      totalPortCostsUsd * officialExchangeRate
    );

    const totalBaseExpensesBs = roundToFourDecimals(
      totalBaseExpensesUsd * officialExchangeRate
    );

    return {
      totalProductsUsd,
      totalFreightsUsd,
      totalInsurancesUsd,
      totalPortCostsUsd,
      totalBaseExpensesUsd,
      totalProductsBs,
      totalFreightsBs,
      totalInsurancesBs,
      totalPortCostsBs,
      totalBaseExpensesBs,
    };
  }, [products, expenses, officialExchangeRate]);

  const productCalculations = useMemo(() => {
    const rows = products.map((product, index) => {
      const subtotalUsd = getProductSubtotalUsd(product);

      /*
        Factor = Subtotal USD del producto / Total USD de productos
        Es el mismo factor que se usa para distribuir fletes, seguros
        y gastos portuarios entre los productos.
      */
      const factor =
        totals.totalProductsUsd > 0
          ? subtotalUsd / totals.totalProductsUsd
          : 0;

      /*
        COMMODITIES en Bs por producto:
        Subtotal USD * tipo de cambio
      */
      const commoditiesBs = roundToFourDecimals(
        subtotalUsd * officialExchangeRate
      );

      /*
        Distribución proporcional de gastos base:
        Total gasto USD * tipo de cambio * factor
      */
      const freightsBs = roundToFourDecimals(
        totals.totalFreightsUsd * officialExchangeRate * factor
      );

      const insurancesBs = roundToFourDecimals(
        totals.totalInsurancesUsd * officialExchangeRate * factor
      );

      const portCostsBs = roundToFourDecimals(
        totals.totalPortCostsUsd * officialExchangeRate * factor
      );

      /*
        BASE IMPONIBLE (CIF) Bs:
        Commodities Bs + fletes Bs + seguros Bs + gastos portuarios Bs
      */
      const cifBs = roundToFourDecimals(
        commoditiesBs + freightsBs + insurancesBs + portCostsBs
      );

      /*
        GA alícuota:
        En productos lo capturamos como porcentaje visible:
        Ej: 15 significa 15%
      */
      const gaPercent = Number(product.gaPercent || 0);
      const gaRate = gaPercent / 100;

      /*
        GA Bs:
        Base imponible CIF Bs * GA alícuota
      */
      const gaBs = roundToFourDecimals(cifBs * gaRate);

      /*
        IVA 14.94%:
        Según la explicación: se calcula sobre Base imponible + GA
      */
      const ivaBs = roundToFourDecimals((cifBs + gaBs) * IVA_RATE);

      /*
        VALOR DESPUÉS DE IMPUESTOS:
        En la hoja Calculodecostos, hasta la fila 14,
        este valor corresponde a Base imponible + GA.
        El IVA se muestra como crédito fiscal, pero no se suma aquí.
      */
      const valueAfterTaxesBs = roundToFourDecimals(cifBs + gaBs);

      return {
        id: index + 1,
        productName: product.productName || "Sin nombre",
        factor,
        commoditiesBs,
        freightsBs,
        insurancesBs,
        portCostsBs,
        cifBs,
        gaPercent,
        gaBs,
        ivaBs,
        valueAfterTaxesBs,
      };
    });

    const totalCifBs = roundToFourDecimals(
      rows.reduce((acc, row) => acc + row.cifBs, 0)
    );

    const totalGaBs = roundToFourDecimals(
      rows.reduce((acc, row) => acc + row.gaBs, 0)
    );

    const totalIvaBs = roundToFourDecimals(
      rows.reduce((acc, row) => acc + row.ivaBs, 0)
    );

    const totalValueAfterTaxesBs = roundToFourDecimals(
      rows.reduce((acc, row) => acc + row.valueAfterTaxesBs, 0)
    );

    return {
      rows,
      totalCifBs,
      totalGaBs,
      totalIvaBs,
      totalValueAfterTaxesBs,
    };
  }, [products, totals, officialExchangeRate]);

  return (
    <StepPanel>
      <SectionHeader>
        <StepPanelTitle>Base imponible e impuestos</StepPanelTitle>
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
          <span>Tipo de cambio</span>
          <strong>
            {officialExchangeRate > 0
              ? officialExchangeRate.toFixed(4)
              : "Sin tipo de cambio"}
          </strong>
        </SummaryCard>

        <SummaryCard>
          <span>Total productos USD</span>
          <strong>{formatUsd(totals.totalProductsUsd)}</strong>
        </SummaryCard>

        <SummaryCard>
          <span>Total productos Bs</span>
          <strong>{formatBs(totals.totalProductsBs)}</strong>
        </SummaryCard>

        <SummaryCard>
          <span>Gastos base USD</span>
          <strong>{formatUsd(totals.totalBaseExpensesUsd)}</strong>
        </SummaryCard>

        <SummaryCard $highlight>
          <span>Base imponible total</span>
          <strong>{formatBs(productCalculations.totalCifBs)}</strong>
        </SummaryCard>

        <SummaryCard $highlight>
          <span>Valor después de impuestos</span>
          <strong>{formatBs(productCalculations.totalValueAfterTaxesBs)}</strong>
        </SummaryCard>
      </SummaryCardsGrid>

      <SummaryTableWrapper>
        <SummaryTable>
          <SummaryTableHead>
            <span>Producto</span>
            <span>Factor</span>
            <span>Mercacía Bs</span>
            <span>Fletes Bs</span>
            <span>Seguro Bs</span>
            <span>Gastos portuarios Bs</span>
            <span>Base imponible CIF Bs</span>
            <span>GA alícuota</span>
            <span>GA Bs</span>
            <span>IVA 14.94% Bs</span>
            <span>Valor después impuestos Bs</span>
          </SummaryTableHead>

          {productCalculations.rows.map((item) => (
            <SummaryTableRow key={item.id}>
              <SummaryTableCell>{item.productName}</SummaryTableCell>

              <SummaryTableCell>{formatFactor(item.factor)}</SummaryTableCell>

              <SummaryTableCell>{formatBs(item.commoditiesBs)}</SummaryTableCell>

              <SummaryTableCell>{formatBs(item.freightsBs)}</SummaryTableCell>

              <SummaryTableCell>{formatBs(item.insurancesBs)}</SummaryTableCell>

              <SummaryTableCell>{formatBs(item.portCostsBs)}</SummaryTableCell>

              <SummaryTableCell>
                <strong>{formatBs(item.cifBs)}</strong>
              </SummaryTableCell>

              <SummaryTableCell>
                {formatPercent(item.gaPercent)}
              </SummaryTableCell>

              <SummaryTableCell>{formatBs(item.gaBs)}</SummaryTableCell>

              <SummaryTableCell>{formatBs(item.ivaBs)}</SummaryTableCell>

              <SummaryTableCell>
                <strong>{formatBs(item.valueAfterTaxesBs)}</strong>
              </SummaryTableCell>
            </SummaryTableRow>
          ))}

          <SummaryTableFooter>
            <span>Total</span>
            <span></span>
            <span>{formatBs(totals.totalProductsBs)}</span>
            <span>{formatBs(totals.totalFreightsBs)}</span>
            <span>{formatBs(totals.totalInsurancesBs)}</span>
            <span>{formatBs(totals.totalPortCostsBs)}</span>
            <span>{formatBs(productCalculations.totalCifBs)}</span>
            <span></span>
            <span>{formatBs(productCalculations.totalGaBs)}</span>
            <span>{formatBs(productCalculations.totalIvaBs)}</span>
            <span>{formatBs(productCalculations.totalValueAfterTaxesBs)}</span>
          </SummaryTableFooter>
        </SummaryTable>
      </SummaryTableWrapper>
    </StepPanel>
  );
}

export default SummaryStep;
