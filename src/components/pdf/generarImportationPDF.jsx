import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { calculateImportation, roundToFourDecimals } from "../utils/importationCalculations";

const formatDate = (value) => {
  if (!value) return "Sin fecha";
  const datePart = String(value).split("T")[0];
  const [year, month, day] = datePart.split("-");
  if (!year || !month || !day) {
    return String(value);
  }
  return `${day}/${month}/${year}`;
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

const formatPercent = (value) =>
  `${Number(value || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}%`;

const getStatusLabel = (status) => {
  return status === "VERIFIED"
    ? "Verificado"
    : "Borrador";
};

const mapImportationToCalculationData = (
  importation
) => {
  const snapshot = importation?.snapshot ?? {};
  const baseExpenses =
    snapshot?.baseExpenses ?? {};

  return {
    generalData: {
      supplier:
        importation?.supplierName || "",
      reference:
        importation?.referenceNumber || "",
      date:
        importation?.importationDate || "",
      officialExchangeRate: Number(
        importation?.officialExchangeRate || 0
      ),
      bankExchangeRate:
        importation?.bankExchangeRate !== null &&
        importation?.bankExchangeRate !== undefined
          ? Number(importation.bankExchangeRate)
          : null,
    },

    products: Array.isArray(snapshot.products)
      ? snapshot.products
      : [],

    expenses: {
      freights: Array.isArray(
        baseExpenses.freights
      )
        ? baseExpenses.freights.map((item) => ({
            name: item?.name || "",
            amount: Number(
              item?.amountUsd ?? item?.amount ?? 0
            ),
          }))
        : [],

      insurances: Array.isArray(
        baseExpenses.insurances
      )
        ? baseExpenses.insurances.map((item) => ({
            name: item?.name || "",
            amount: Number(
              item?.amountUsd ?? item?.amount ?? 0
            ),
          }))
        : [],

      portCosts: Array.isArray(
        baseExpenses.portCosts
      )
        ? baseExpenses.portCosts.map((item) => ({
            name: item?.name || "",
            amount: Number(
              item?.amountUsd ?? item?.amount ?? 0
            ),
          }))
        : [],

      otherCosts: Array.isArray(
        baseExpenses.otherCosts
      )
        ? baseExpenses.otherCosts.map((item) => ({
            name: item?.name || "",
            amount: Number(
              item?.amountUsd ?? item?.amount ?? 0
            ),
          }))
        : [],
    },

    additionalCosts: Array.isArray(
      snapshot.additionalCosts
    )
      ? snapshot.additionalCosts.map((cost) => ({
          concept: cost?.concept || "",
          amount: Number(cost?.amount || 0),
          currency: cost?.currency || "BS",
          hasFiscalCredit: Boolean(
            cost?.hasFiscalCredit
          ),
          creditRate: Number(
            cost?.fiscalCreditPercent ??
              cost?.creditRate ??
              0
          ),
        }))
      : [],
  };
};

const addSectionTitle = (
  doc,
  title,
  y,
  pageWidth,
  margin
) => {
  doc.setFillColor(247, 248, 250);
  doc.roundedRect(
    margin,
    y,
    pageWidth - margin * 2,
    9,
    2,
    2,
    "F"
  );

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(31, 41, 55);
  doc.text(title, margin + 3, y + 6);

  return y + 12;
};

const addPageNumbers = (doc) => {
  const pageCount =
    doc.internal.getNumberOfPages();

  for (
    let pageNumber = 1;
    pageNumber <= pageCount;
    pageNumber += 1
  ) {
    doc.setPage(pageNumber);

    const pageWidth =
      doc.internal.pageSize.getWidth();
    const pageHeight =
      doc.internal.pageSize.getHeight();

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(130, 130, 130);

    doc.text(
      `Página ${pageNumber} de ${pageCount}`,
      pageWidth - 14,
      pageHeight - 8,
      { align: "right" }
    );

    doc.text(
      "Sistema Megadis",
      14,
      pageHeight - 8
    );
  }
};

export const generarImportationPDF = (
  importation
) => {
  if (!importation) {
    throw new Error(
      "No se proporcionó una importación."
    );
  }

  const calculationData =
    mapImportationToCalculationData(
      importation
    );

  const calculations =
    calculateImportation(calculationData);

  const {
    productRows,
    additionalCostRows,
    finalRows,
    totals,
  } = calculations;

  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  const pageWidth =
    doc.internal.pageSize.getWidth();

  const margin = 12;

  // ENCABEZADO
  doc.setFont("helvetica", "bold");
  doc.setFontSize(17);
  doc.setTextColor(30, 41, 59);

  doc.text(
    "REPORTE DE CÁLCULO DE COSTOS DE IMPORTACIÓN",
    pageWidth / 2,
    16,
    { align: "center" }
  );

  doc.setDrawColor(204, 51, 41);
  doc.setLineWidth(0.7);

  doc.line(
    margin,
    21,
    pageWidth - margin,
    21
  );

  // DATOS GENERALES
  const supplier =
    importation?.supplierName ||
    "Sin proveedor";

  const reference =
    importation?.referenceNumber ||
    "Sin referencia";

  const date = formatDate(
    importation?.importationDate
  );

  const officialExchangeRate = Number(
    importation?.officialExchangeRate || 0
  );

  const bankExchangeRate =
    importation?.bankExchangeRate !== null &&
    importation?.bankExchangeRate !== undefined
      ? Number(importation.bankExchangeRate)
      : null;

  const status = getStatusLabel(
    importation?.status
  );

  doc.setFontSize(9);

  const infoY = 28;

  const drawField = (
    label,
    value,
    x,
    y,
    labelWidth
  ) => {
    doc.setFont("helvetica", "bold");
    doc.setTextColor(71, 85, 105);
    doc.text(`${label}:`, x, y);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(15, 23, 42);
    doc.text(
      String(value ?? "-"),
      x + labelWidth,
      y
    );
  };

  drawField(
    "Proveedor",
    supplier,
    margin,
    infoY,
    22
  );

  drawField(
    "Referencia",
    reference,
    margin,
    infoY + 6,
    22
  );

  drawField(
    "Fecha",
    date,
    108,
    infoY,
    14
  );

  drawField(
    "Estado",
    status,
    108,
    infoY + 6,
    14
  );

  drawField(
    "Tipo de cambio oficial",
    officialExchangeRate.toFixed(4),
    190,
    infoY,
    38
  );

  drawField(
    "Tipo de cambio banco",
    bankExchangeRate !== null
      ? bankExchangeRate.toFixed(4)
      : "No registrado",
    190,
    infoY + 6,
    38
  );

  let currentY = 45;

  // PRODUCTOS
  currentY = addSectionTitle(
    doc,
    "1. Productos importados",
    currentY,
    pageWidth,
    margin
  );

  autoTable(doc, {
    startY: currentY,
    margin: {
      left: margin,
      right: margin,
    },
    head: [
      [
        "Código",
        "Producto",
        "Cant. referencial",
        "Cant. base",
        "Precio USD",
        "Subtotal USD",
        "Factor",
        "GA",
      ],
    ],
    body: productRows.map((row) => [
      row.productCode,
      row.productName,
      formatQuantity(
        row.referenceQuantity
      ),
      formatQuantity(row.baseQuantity),
      formatUsd(row.priceUsd),
      formatUsd(row.subtotalUsd),
      formatFactor(row.factor),
      formatPercent(row.gaPercent),
    ]),
    styles: {
      fontSize: 7.3,
      cellPadding: 2,
      valign: "middle",
    },
    headStyles: {
      fillColor: [204, 51, 41],
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    columnStyles: {
      0: { cellWidth: 27 },
      1: { cellWidth: 54 },
      2: { cellWidth: 27 },
      3: { cellWidth: 25 },
      4: { cellWidth: 28 },
      5: { cellWidth: 32 },
      6: { cellWidth: 25 },
      7: { cellWidth: 20 },
    },
  });

  currentY =
    (doc.lastAutoTable?.finalY || currentY) +
    8;

  // GASTOS BASE
  currentY = addSectionTitle(
    doc,
    "2. Gastos base",
    currentY,
    pageWidth,
    margin
  );

  const baseExpenseRows = [
    ...(calculationData.expenses.freights || []).map(
      (item) => [
        "Flete",
        item.name || "Sin nombre",
        formatUsd(item.amount),
      ]
    ),

    ...(calculationData.expenses.insurances || []).map(
      (item) => [
        "Seguro",
        item.name || "Sin nombre",
        formatUsd(item.amount),
      ]
    ),

    ...(calculationData.expenses.portCosts || []).map(
      (item) => [
        "Gasto portuario",
        item.name || "Sin nombre",
        formatUsd(item.amount),
      ]
    ),

    ...(calculationData.expenses.otherCosts || []).map(
      (item) => [
        "Otro gasto",
        item.name || "Sin nombre",
        formatUsd(item.amount),
      ]
    ),
  ];

  autoTable(doc, {
    startY: currentY,
    margin: {
      left: margin,
      right: margin,
    },
    head: [
      [
        "Categoría",
        "Concepto",
        "Monto USD",
      ],
    ],
    body:
      baseExpenseRows.length > 0
        ? baseExpenseRows
        : [
            [
              "—",
              "Sin gastos registrados",
              formatUsd(0),
            ],
          ],
    foot: [
      [
        "",
        "Total gastos considerados en CIF",
        formatUsd(
          totals.totalBaseExpensesUsd
        ),
      ],
    ],
    styles: {
      fontSize: 8,
      cellPadding: 2.2,
    },
    headStyles: {
      fillColor: [204, 51, 41],
      textColor: [255, 255, 255],
    },
    footStyles: {
      fillColor: [254, 242, 242],
      textColor: [185, 28, 28],
      fontStyle: "bold",
    },
    columnStyles: {
      0: { cellWidth: 48 },
      1: { cellWidth: 150 },
      2: {
        cellWidth: 55,
        halign: "right",
      },
    },
  });

  currentY =
    (doc.lastAutoTable?.finalY || currentY) +
    8;

  // BASE IMPONIBLE
  doc.addPage();

  currentY = 18;

  currentY = addSectionTitle(
    doc,
    "3. Base imponible e impuestos",
    currentY,
    pageWidth,
    margin
  );

  autoTable(doc, {
    startY: currentY,
    margin: {
      left: margin,
      right: margin,
    },
    head: [
      [
        "Código",
        "Producto",
        "Mercancía Bs",
        "Fletes Bs",
        "Seguro Bs",
        "Portuarios Bs",
        "CIF Bs",
        "GA %",
        "GA Bs",
        "IVA 14,94% Bs",
        "Valor después impuestos Bs",
      ],
    ],
    body: productRows.map((row) => [
      row.productCode,
      row.productName,
      formatBs(row.productValueBs),
      formatBs(row.freightsBs),
      formatBs(row.insurancesBs),
      formatBs(row.portCostsBs),
      formatBs(row.cifBs),
      formatPercent(row.gaPercent),
      formatBs(row.gaBs),
      formatBs(row.ivaBs),
      formatBs(row.valueAfterTaxesBs),
    ]),
    foot: [
      [
        "TOTAL",
        "",
        formatBs(totals.totalProductsBs),
        formatBs(totals.totalFreightsBs),
        formatBs(
          totals.totalInsurancesBs
        ),
        formatBs(totals.totalPortCostsBs),
        formatBs(totals.totalCifBs),
        "",
        formatBs(totals.totalGaBs),
        formatBs(totals.totalIvaBs),
        formatBs(
          totals.totalValueAfterTaxesBs
        ),
      ],
    ],
    styles: {
      fontSize: 6.5,
      cellPadding: 1.7,
      valign: "middle",
      overflow: "linebreak",
    },
    headStyles: {
      fillColor: [204, 51, 41],
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    footStyles: {
      fillColor: [254, 242, 242],
      textColor: [185, 28, 28],
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    columnStyles: {
      0: { cellWidth: 21 },
      1: { cellWidth: 42 },
      2: { cellWidth: 25 },
      3: { cellWidth: 23 },
      4: { cellWidth: 23 },
      5: { cellWidth: 24 },
      6: { cellWidth: 25 },
      7: { cellWidth: 16 },
      8: { cellWidth: 23 },
      9: { cellWidth: 25 },
      10: { cellWidth: 29 },
    },
  });

  currentY =
    (doc.lastAutoTable?.finalY || currentY) +
    8;

  // GASTOS ADICIONALES
  currentY = addSectionTitle(
    doc,
    "4. Gastos adicionales",
    currentY,
    pageWidth,
    margin
  );

  autoTable(doc, {
    startY: currentY,
    margin: {
      left: margin,
      right: margin,
    },
    head: [
      [
        "Concepto",
        "Moneda",
        "Monto ingresado",
        "Importe USD",
        "Importe Bs",
        "Crédito fiscal",
        "Crédito fiscal Bs",
        "Importe neto Bs",
      ],
    ],
    body:
      additionalCostRows.length > 0
        ? additionalCostRows.map((row) => [
            row.concept,
            row.currency,
            row.currency === "USD"
              ? formatUsd(
                  row.originalAmount
                )
              : formatBs(
                  row.originalAmount
                ),
            formatUsd(row.amountUsd),
            formatBs(row.amountBs),
            row.hasFiscalCredit
              ? formatPercent(
                  row.creditRate
                )
              : "No aplica",
            formatBs(
              row.fiscalCreditBs
            ),
            formatBs(row.netAmountBs),
          ])
        : [
            [
              "Sin gastos adicionales",
              "—",
              "—",
              formatUsd(0),
              formatBs(0),
              "No aplica",
              formatBs(0),
              formatBs(0),
            ],
          ],
    foot: [
      [
        "TOTAL",
        "",
        "",
        formatUsd(
          totals.totalAdditionalCosts
            .amountUsd
        ),
        formatBs(
          totals.totalAdditionalCosts
            .amountBs
        ),
        "",
        formatBs(
          totals.totalAdditionalCosts
            .fiscalCreditBs
        ),
        formatBs(
          totals.totalAdditionalCosts
            .netAmountBs
        ),
      ],
    ],
    styles: {
      fontSize: 7,
      cellPadding: 2,
      valign: "middle",
    },
    headStyles: {
      fillColor: [204, 51, 41],
      textColor: [255, 255, 255],
    },
    footStyles: {
      fillColor: [254, 242, 242],
      textColor: [185, 28, 28],
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
  });

  currentY =
    (doc.lastAutoTable?.finalY || currentY) +
    8;

  // COSTO FINAL
  doc.addPage();

  currentY = 18;

  currentY = addSectionTitle(
    doc,
    "5. Costo final por producto",
    currentY,
    pageWidth,
    margin
  );

  autoTable(doc, {
    startY: currentY,
    margin: {
      left: margin,
      right: margin,
    },
    head: [
      [
        "Código",
        "Producto",
        "Factor",
        "Valor después impuestos Bs",
        "Gastos adicionales asignados Bs",
        "Costo final Bs",
        "Cantidad referencial",
        "Costo unitario Bs",
      ],
    ],
    body: finalRows.map((row) => [
      row.productCode,
      row.productName,
      formatFactor(row.factor),
      formatBs(row.valueAfterTaxesBs),
      formatBs(
        row.additionalAssignedBs
      ),
      formatBs(row.finalCostBs),
      formatQuantity(
        row.referenceQuantity
      ),
      row.unitCostBs !== null
        ? formatBs(row.unitCostBs)
        : "Sin cantidad",
    ]),
    foot: [
      [
        "TOTAL",
        "",
        "",
        formatBs(
          totals.totalValueAfterTaxesBs
        ),
        formatBs(
          totals.totalAdditionalAssignedBs
        ),
        formatBs(
          totals.totalFinalCostBs
        ),
        "",
        "",
      ],
    ],
    styles: {
      fontSize: 7.5,
      cellPadding: 2.2,
      valign: "middle",
    },
    headStyles: {
      fillColor: [204, 51, 41],
      textColor: [255, 255, 255],
    },
    footStyles: {
      fillColor: [254, 242, 242],
      textColor: [185, 28, 28],
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
  });

  currentY =
    (doc.lastAutoTable?.finalY || currentY) +
    9;

  // RESUMEN FINAL
  doc.setFillColor(254, 242, 242);
  doc.roundedRect(
    margin,
    currentY,
    pageWidth - margin * 2,
    28,
    3,
    3,
    "F"
  );

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(153, 27, 27);

  doc.text(
    "RESUMEN FINAL",
    margin + 5,
    currentY + 7
  );

  doc.setFontSize(9);
  doc.setTextColor(31, 41, 55);

  doc.text(
    `Valor después de impuestos: ${formatBs(
      totals.totalValueAfterTaxesBs
    )}`,
    margin + 5,
    currentY + 15
  );

  doc.text(
    `Gastos adicionales netos: ${formatBs(
      totals.totalAdditionalCosts
        .netAmountBs
    )}`,
    106,
    currentY + 15
  );

  doc.text(
    `Crédito fiscal: ${formatBs(
      totals.totalAdditionalCosts
        .fiscalCreditBs
    )}`,
    198,
    currentY + 15
  );

  doc.setFontSize(11);
  doc.setTextColor(185, 28, 28);

  doc.text(
    `Costo final total: ${formatBs(
      totals.totalFinalCostBs
    )}`,
    margin + 5,
    currentY + 23
  );

  addPageNumbers(doc);

  const safeReference = String(
    importation?.referenceNumber ||
      importation?.id ||
      "sin-referencia"
  )
    .replace(/[^\w-]/g, "_")
    .toLowerCase();

  const fileName = `calculo_costos_${safeReference}.pdf`;

  /*
   * Abrimos el PDF en una pestaña nueva.
   * También puedes cambiarlo por doc.save(fileName)
   * cuando quieras descargar directamente.
   */
  const pdfBlob = doc.output("blob");
  const pdfUrl = URL.createObjectURL(pdfBlob);

  const openedWindow = window.open(
    pdfUrl,
    "_blank",
    "noopener,noreferrer"
  );

  if (!openedWindow) {
    doc.save(fileName);
  }

  window.setTimeout(() => {
    URL.revokeObjectURL(pdfUrl);
  }, 60000);
};
