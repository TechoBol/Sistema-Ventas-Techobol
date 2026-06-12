import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { calculateImportation } from "../utils/importationCalculations";

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

const formatPercent = (value) =>
  `${Number(value || 0).toLocaleString("es-BO", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}%`;

const formatDate = (value) => {
  if (!value) return "—";

  const datePart = String(value).split("T")[0];
  const [year, month, day] = datePart.split("-");

  if (!year || !month || !day) return String(value);

  return `${day}/${month}/${year}`;
};

const getStatusLabel = (status) => {
  if (status === "VERIFIED" || status === "verificado") {
    return "Verificado";
  }

  return "Borrador";
};

const getPaymentTypeLabel = (type) => {
  if (type === "ADVANCE") return "Anticipo";
  if (type === "FINAL_PAYMENT") return "Pago final";

  return "Pago";
};

/* Convierte el objeto almacenado en la BD al formato utilizado por calculateImportation() */
const mapImportationData = (importation) => {
  const snapshot = importation?.snapshot ?? {};
  const baseExpenses = snapshot?.baseExpenses ?? {};
  const mapExpenses = (items) => {
    if (!Array.isArray(items)) return [];
    return items.map((item) => ({
      name: item?.name || "",
      amount: Number(item?.amountUsd ?? item?.amount ?? 0),
    }));
  };

  return {
    generalData: {
      supplier: importation?.supplierName || "",
      reference: importation?.referenceNumber || "",
      date: importation?.importationDate || "",
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
      freights: mapExpenses(baseExpenses.freights),
      insurances: mapExpenses(baseExpenses.insurances),
      portCosts: mapExpenses(baseExpenses.portCosts),
      otherCosts: mapExpenses(baseExpenses.otherCosts),
    },

    bankPayments: Array.isArray(snapshot.bankPayments?.payments)
      ? snapshot.bankPayments.payments
      : [],

    additionalCosts: Array.isArray(snapshot.additionalCosts)
      ? snapshot.additionalCosts.map((cost) => ({
          concept: cost?.concept || "",
          amount: Number(cost?.amount || 0),
          currency: cost?.currency || "BS",
          hasFiscalCredit: Boolean(cost?.hasFiscalCredit),
          creditRate: Number(
            cost?.fiscalCreditPercent ??
              cost?.creditRate ??
              0
          ),
          source: cost?.source || "MANUAL",
        }))
      : [],
  };
};

const addSectionTitle = (doc, title, startY, pageWidth, margin) => {
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(
    margin,
    startY,
    pageWidth - margin * 2,
    9,
    2,
    2,
    "F"
  );
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(30, 41, 59);
  doc.text(title, margin + 3, startY + 6);
  return startY + 12;
};

const getFinalY = (doc, defaultY = 40) => doc.lastAutoTable?.finalY || defaultY;

const tableStyles = {
  styles: {
    fontSize: 7,
    cellPadding: 1.8,
    valign: "middle",
    overflow: "linebreak",
  },
  headStyles: {
    fillColor: [204, 51, 41],
    textColor: [255, 255, 255],
    fontStyle: "bold",
  },
  alternateRowStyles: {
    fillColor: [248, 250, 252],
  },
  footStyles: {
    fillColor: [254, 242, 242],
    textColor: [185, 28, 28],
    fontStyle: "bold",
  },
};

export const generarImportationPDF = (importation) => {
  if (!importation) {
    throw new Error("No se proporcionaron datos de la importación.");
  }

  const calculationData = mapImportationData(importation);
  const calculations = calculateImportation(calculationData);
  const {
    productRows = [],
    additionalCostRows = [],
    finalRows = [],
    totals = {},
    bankCalculation = {},
  } = calculations;
  const bankRows = bankCalculation?.rows ?? [];
  const bankTotals = bankCalculation?.totals ?? {};
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 12;

  // ─────────────────────────────────────────────
  // ENCABEZADO
  // ─────────────────────────────────────────────
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(20, 28, 45);
  doc.text(
    "REPORTE DE CÁLCULO DE COSTOS DE IMPORTACIÓN",
    pageWidth / 2,
    16,
    { align: "center" }
  );
  doc.setDrawColor(204, 51, 41);
  doc.setLineWidth(0.6);
  doc.line(margin, 21, pageWidth - margin, 21);

  const campo = (label, value, x, y, labelWidth) => {
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(71, 85, 105);
    doc.text(`${label}:`, x, y);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(15, 23, 42);
    doc.text(String(value ?? "—"), x + labelWidth, y);
  };

  const infoY = 29;

  campo(
    "Proveedor",
    importation?.supplierName || "Sin proveedor",
    margin,
    infoY,
    23
  );

  campo(
    "Referencia",
    importation?.referenceNumber || "Sin referencia",
    margin,
    infoY + 6,
    23
  );

  campo(
    "Fecha",
    formatDate(importation?.importationDate),
    108,
    infoY,
    15
  );

  campo(
    "Estado",
    getStatusLabel(importation?.status),
    108,
    infoY + 6,
    15
  );

  campo(
    "Tipo de cambio oficial",
    Number(importation?.officialExchangeRate || 0).toFixed(4),
    190,
    infoY,
    39
  );

  campo(
    "Cantidad de productos",
    String(importation?.productCount || productRows.length),
    190,
    infoY + 6,
    39
  );

  // ─────────────────────────────────────────────
  // 1. PRODUCTOS IMPORTADOS
  // ─────────────────────────────────────────────

  let y = 45;

  y = addSectionTitle(
    doc,
    "1. Productos importados",
    y,
    pageWidth,
    margin
  );

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [
      [
        "Código",
        "Producto",
        "Cantidad referencial",
        "Cantidad base",
        "Precio USD",
        "Subtotal USD",
        "Factor",
        "GA %",
      ],
    ],

    body:
      productRows.length > 0
        ? productRows.map((product) => [
            product.productCode || "—",
            product.productName || "—",
            formatQuantity(product.referenceQuantity),
            formatQuantity(product.baseQuantity),
            formatUsd(product.priceUsd),
            formatUsd(product.subtotalUsd),
            formatFactor(product.factor),
            formatPercent(product.gaPercent),
          ])
        : [
            [
              "—",
              "Sin productos registrados",
              "—",
              "—",
              "—",
              "—",
              "—",
              "—",
            ],
          ],

    ...tableStyles,
  });

  // ─────────────────────────────────────────────
  // 2. GASTOS BASE
  // ─────────────────────────────────────────────

  y = getFinalY(doc, y) + 8;

  y = addSectionTitle(
    doc,
    "2. Gastos base de importación",
    y,
    pageWidth,
    margin
  );

  const baseExpenseRows = [
    ...calculationData.expenses.freights.map((item) => [
      "Flete",
      item.name || "Sin nombre",
      formatUsd(item.amount),
    ]),

    ...calculationData.expenses.insurances.map((item) => [
      "Seguro",
      item.name || "Sin nombre",
      formatUsd(item.amount),
    ]),

    ...calculationData.expenses.portCosts.map((item) => [
      "Gasto portuario",
      item.name || "Sin nombre",
      formatUsd(item.amount),
    ]),

    ...calculationData.expenses.otherCosts.map((item) => [
      "Otro gasto",
      item.name || "Sin nombre",
      formatUsd(item.amount),
    ]),
  ];

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [["Categoría", "Concepto", "Monto USD"]],
    body:
      baseExpenseRows.length > 0
        ? baseExpenseRows
        : [["—", "Sin gastos registrados", formatUsd(0)]],
    foot: [
      [
        "",
        "Total gastos considerados en CIF",
        formatUsd(totals.totalBaseExpensesUsd),
      ],
    ],
    columnStyles: {
      0: { cellWidth: 50 },
      1: { cellWidth: 160 },
      2: { cellWidth: 55, halign: "right" },
    },

    ...tableStyles,
  });

  // ─────────────────────────────────────────────
  // NUEVA PÁGINA
  // 3. BASE IMPONIBLE E IMPUESTOS
  // ─────────────────────────────────────────────

  doc.addPage();
  y = 16;

  y = addSectionTitle(
    doc,
    "3. Base imponible e impuestos",
    y,
    pageWidth,
    margin
  );

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [
      [
        "Código",
        "Producto",
        "Mercancía Bs",
        "Fletes Bs",
        "Seguro Bs",
        "Portuarios Bs",
        "Base imponible CIF Bs",
        "GA %",
        "GA Bs",
        "IVA Bs",
        "Valor después de impuestos Bs",
      ],
    ],

    body:
      productRows.length > 0
        ? productRows.map((product) => [
            product.productCode || "—",
            product.productName || "—",
            formatBs(product.productValueBs),
            formatBs(product.freightsBs),
            formatBs(product.insurancesBs),
            formatBs(product.portCostsBs),
            formatBs(product.cifBs),
            formatPercent(product.gaPercent),
            formatBs(product.gaBs),
            formatBs(product.ivaBs),
            formatBs(product.valueAfterTaxesBs),
          ])
        : [],

    foot: [
      [
        "TOTAL",
        "",
        formatBs(totals.totalProductsBs),
        formatBs(totals.totalFreightsBs),
        formatBs(totals.totalInsurancesBs),
        formatBs(totals.totalPortCostsBs),
        formatBs(totals.totalCifBs),
        "",
        formatBs(totals.totalGaBs),
        formatBs(totals.totalIvaBs),
        formatBs(totals.totalValueAfterTaxesBs),
      ],
    ],

    styles: {
      ...tableStyles.styles,
      fontSize: 6.2,
      cellPadding: 1.5,
    },
    headStyles: tableStyles.headStyles,
    alternateRowStyles: tableStyles.alternateRowStyles,
    footStyles: tableStyles.footStyles,
  });

  // ─────────────────────────────────────────────
  // 4. PAGOS BANCARIOS
  // ─────────────────────────────────────────────

  y = getFinalY(doc, y) + 8;

  y = addSectionTitle(
    doc,
    "4. Pagos bancarios",
    y,
    pageWidth,
    margin
  );

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [
      [
        "Tipo",
        "Fecha",
        "Banco",
        "Monto USD",
        "T/C banco",
        "Pago Bs",
        "Comisión USD",
        "Comisión Bs",
        "ITF entrada USD",
        "ITF salida USD",
      ],
    ],

    body:
      bankRows.length > 0
        ? bankRows.map((payment) => [
            getPaymentTypeLabel(payment.paymentType),
            formatDate(payment.date),
            payment.bankName || "—",
            formatUsd(payment.amountUsd),
            Number(payment.bankExchangeRate || 0).toFixed(4),
            formatBs(payment.paymentAmountBs),
            formatUsd(payment.commissionUsd),
            formatBs(payment.commissionBs),
            formatUsd(payment.itfEntryUsd),
            formatUsd(payment.itfExitUsd),
          ])
        : [
            [
              "—",
              "—",
              "Sin pagos registrados",
              formatUsd(0),
              "0.0000",
              formatBs(0),
              formatUsd(0),
              formatBs(0),
              formatUsd(0),
              formatUsd(0),
            ],
          ],

    foot: [
      [
        "TOTAL",
        "",
        "",
        formatUsd(bankTotals.totalPaymentUsd),
        "",
        formatBs(bankTotals.totalPaymentBs),
        formatUsd(bankTotals.totalCommissionUsd),
        formatBs(bankTotals.totalCommissionBs),
        formatUsd(bankTotals.totalItfEntryUsd),
        formatUsd(bankTotals.totalItfExitUsd),
      ],
    ],

    styles: {
      ...tableStyles.styles,
      fontSize: 6.5,
    },
    headStyles: tableStyles.headStyles,
    alternateRowStyles: tableStyles.alternateRowStyles,
    footStyles: tableStyles.footStyles,
  });

  // ─────────────────────────────────────────────
  // NUEVA PÁGINA
  // 5. GASTOS ADICIONALES
  // ─────────────────────────────────────────────

  doc.addPage();
  y = 16;

  y = addSectionTitle(
    doc,
    "5. Gastos adicionales",
    y,
    pageWidth,
    margin
  );

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
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
        ? additionalCostRows.map((cost) => [
            cost.concept || "—",
            cost.currency || "—",
            cost.currency === "USD"
              ? formatUsd(cost.originalAmount)
              : formatBs(cost.originalAmount),
            formatUsd(cost.amountUsd),
            formatBs(cost.amountBs),
            cost.hasFiscalCredit
              ? formatPercent(cost.creditRate)
              : "No aplica",
            formatBs(cost.fiscalCreditBs),
            formatBs(cost.netAmountBs),
          ])
        : [],

    foot: [
      [
        "TOTAL",
        "",
        "",
        formatUsd(totals.totalAdditionalCosts?.amountUsd),
        formatBs(totals.totalAdditionalCosts?.amountBs),
        "",
        formatBs(totals.totalAdditionalCosts?.fiscalCreditBs),
        formatBs(totals.totalAdditionalCosts?.netAmountBs),
      ],
    ],

    ...tableStyles,
  });

  // ─────────────────────────────────────────────
  // 6. COSTO FINAL POR PRODUCTO
  // ─────────────────────────────────────────────

  y = getFinalY(doc, y) + 8;

  y = addSectionTitle(
    doc,
    "6. Costo final por producto",
    y,
    pageWidth,
    margin
  );

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
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

    body:
      finalRows.length > 0
        ? finalRows.map((product) => [
            product.productCode || "—",
            product.productName || "—",
            formatFactor(product.factor),
            formatBs(product.valueAfterTaxesBs),
            formatBs(product.additionalAssignedBs),
            formatBs(product.finalCostBs),
            formatQuantity(product.referenceQuantity),
            product.unitCostBs !== null
              ? formatBs(product.unitCostBs)
              : "Sin cantidad",
          ])
        : [],

    foot: [
      [
        "TOTAL",
        "",
        "",
        formatBs(totals.totalValueAfterTaxesBs),
        formatBs(totals.totalAdditionalAssignedBs),
        formatBs(totals.totalFinalCostBs),
        "",
        "",
      ],
    ],

    ...tableStyles,
  });

  // ─────────────────────────────────────────────
  // RESUMEN FINAL
  // ─────────────────────────────────────────────

  y = getFinalY(doc, y) + 9;

  if (y + 32 > pageHeight - 15) {
    doc.addPage();
    y = 18;
  }

  doc.setFillColor(254, 242, 242);
  doc.roundedRect(
    margin,
    y,
    pageWidth - margin * 2,
    28,
    3,
    3,
    "F"
  );

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(185, 28, 28);
  doc.text("RESUMEN FINAL", margin + 5, y + 7);
  doc.setFontSize(9);
  doc.setTextColor(30, 41, 59);
  doc.text(
    `Valor después de impuestos: ${formatBs(
      totals.totalValueAfterTaxesBs
    )}`,
    margin + 5,
    y + 15
  );
  doc.text(
    `Gastos adicionales netos: ${formatBs(
      totals.totalAdditionalCosts?.netAmountBs
    )}`,
    105,
    y + 15
  );
  doc.text(
    `Crédito fiscal: ${formatBs(
      totals.totalAdditionalCosts?.fiscalCreditBs
    )}`,
    200,
    y + 15
  );
  doc.setFontSize(11);
  doc.setTextColor(185, 28, 28);
  doc.text(
    `Costo final total: ${formatBs(totals.totalFinalCostBs)}`,
    margin + 5,
    y + 23
  );

  // ─────────────────────────────────────────────
  // PIE DE PÁGINA
  // ─────────────────────────────────────────────

  const totalPages = doc.internal.getNumberOfPages();

  for (let page = 1; page <= totalPages; page += 1) {
    doc.setPage(page);
    doc.setFont("helvetica", "italic");
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(
      `Generado el ${new Date().toLocaleString("es-BO")}`,
      margin,
      pageHeight - 7
    );
    doc.text(
      `Página ${page} de ${totalPages}`,
      pageWidth - margin,
      pageHeight - 7,
      { align: "right" }
    );
  }

  return doc.output("blob");
};
