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
import { calculateImportation } from "../../utils/importationCalculations";

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

function SummaryStep({
  generalData,
  products,
  expenses,
}) {
  const calculations = useMemo(
    () =>
      calculateImportation({
        generalData,
        products,
        expenses,
        additionalCosts: [],
      }),
    [generalData, products, expenses]
  );

  const {
    officialExchangeRate,
    productRows,
    totals,
  } = calculations;

  return (
    <StepPanel>
      <SectionHeader>
        <StepPanelTitle>
          Base imponible e impuestos
        </StepPanelTitle>
      </SectionHeader>

      <SummaryCardsGrid>
        <SummaryCard>
          <span>Proveedor</span>
          <strong>
            {generalData.supplier ||
              "Sin proveedor"}
          </strong>
        </SummaryCard>

        <SummaryCard>
          <span>Referencia</span>
          <strong>
            {generalData.reference ||
              "Sin referencia"}
          </strong>
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
          <strong>
            {formatUsd(
              totals.totalProductsUsd
            )}
          </strong>
        </SummaryCard>

        <SummaryCard>
          <span>Total productos Bs</span>
          <strong>
            {formatBs(
              totals.totalProductsBs
            )}
          </strong>
        </SummaryCard>

        <SummaryCard>
          <span>Gastos base USD</span>
          <strong>
            {formatUsd(
              totals.totalBaseExpensesUsd
            )}
          </strong>
        </SummaryCard>

        <SummaryCard $highlight>
          <span>Base imponible total</span>
          <strong>
            {formatBs(totals.totalCifBs)}
          </strong>
        </SummaryCard>

        <SummaryCard $highlight>
          <span>
            Valor después de impuestos
          </span>
          <strong>
            {formatBs(
              totals.totalValueAfterTaxesBs
            )}
          </strong>
        </SummaryCard>
      </SummaryCardsGrid>

      <SummaryTableWrapper>
        <SummaryTable>
          <SummaryTableHead>
            <span>Código</span>
            <span>Producto</span>
            <span>Factor</span>
            <span>Mercancía Bs</span>
            <span>Fletes Bs</span>
            <span>Seguro Bs</span>
            <span>
              Gastos portuarios Bs
            </span>
            <span>
              Base imponible CIF Bs
            </span>
            <span>GA alícuota</span>
            <span>GA Bs</span>
            <span>IVA 14.94% Bs</span>
            <span>
              Valor después impuestos Bs
            </span>
          </SummaryTableHead>

          {productRows.map((item) => (
            <SummaryTableRow key={item.id}>
              <SummaryTableCell>
                {item.productCode}
              </SummaryTableCell>

              <SummaryTableCell>
                {item.productName}
              </SummaryTableCell>

              <SummaryTableCell>
                {formatFactor(item.factor)}
              </SummaryTableCell>

              <SummaryTableCell>
                {formatBs(
                  item.productValueBs
                )}
              </SummaryTableCell>

              <SummaryTableCell>
                {formatBs(item.freightsBs)}
              </SummaryTableCell>

              <SummaryTableCell>
                {formatBs(
                  item.insurancesBs
                )}
              </SummaryTableCell>

              <SummaryTableCell>
                {formatBs(item.portCostsBs)}
              </SummaryTableCell>

              <SummaryTableCell>
                <strong>
                  {formatBs(item.cifBs)}
                </strong>
              </SummaryTableCell>

              <SummaryTableCell>
                {formatPercent(
                  item.gaPercent
                )}
              </SummaryTableCell>

              <SummaryTableCell>
                {formatBs(item.gaBs)}
              </SummaryTableCell>

              <SummaryTableCell>
                {formatBs(item.ivaBs)}
              </SummaryTableCell>

              <SummaryTableCell>
                <strong>
                  {formatBs(
                    item.valueAfterTaxesBs
                  )}
                </strong>
              </SummaryTableCell>
            </SummaryTableRow>
          ))}

          <SummaryTableFooter>
            <span>Total</span>
            <span></span>
            <span></span>
            <span>
              {formatBs(
                totals.totalProductsBs
              )}
            </span>
            <span>
              {formatBs(
                totals.totalFreightsBs
              )}
            </span>
            <span>
              {formatBs(
                totals.totalInsurancesBs
              )}
            </span>
            <span>
              {formatBs(
                totals.totalPortCostsBs
              )}
            </span>
            <span>
              {formatBs(
                totals.totalCifBs
              )}
            </span>
            <span></span>
            <span>
              {formatBs(
                totals.totalGaBs
              )}
            </span>
            <span>
              {formatBs(
                totals.totalIvaBs
              )}
            </span>
            <span>
              {formatBs(
                totals.totalValueAfterTaxesBs
              )}
            </span>
          </SummaryTableFooter>
        </SummaryTable>
      </SummaryTableWrapper>
    </StepPanel>
  );
}

export default SummaryStep;
