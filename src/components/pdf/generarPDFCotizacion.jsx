import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// =====================================================
// HELPERS
// =====================================================

const truncarTexto = (doc, texto, maxWidth) => {
  const lines = doc.splitTextToSize(texto, maxWidth);
  return lines[0] || "-";
};

const drawFila = (doc, items, y) => {
  items.forEach(({ label, value, labelX, valueX, maxValueWidth }) => {
    doc.setFont("helvetica", "bold");
    doc.text(label, labelX, y);
    doc.setFont("helvetica", "normal");
    const texto = value || "-";
    const truncado = maxValueWidth
      ? truncarTexto(doc, texto, maxValueWidth)
      : texto;
    doc.text(truncado, valueX, y);
  });
};

// =====================================================
// CABECERA EMPRESA
// =====================================================

const drawEmpresa = (doc, cotizacion) => {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.text("MEGADIS S.R.L.", 14, 18);

  doc.setFontSize(10);
  doc.text(cotizacion.location?.name || "", 14, 25);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);

  doc.text(cotizacion.location?.address || "Dirección no registrada", 14, 32);

  doc.text("Teléfono: 69417829", 14, 38);
  doc.text("Cochabamba - Bolivia", 14, 44);
};

// =====================================================
// TABLA PRODUCTOS
// =====================================================

const drawTablaProductos = (doc, cotizacion, startY) => {
  const body = cotizacion.details.map((item) => [
    item.product.code,
    item.quantity,
    item.unitName || item.productUnit?.unit?.name || "-",
    item.product.name,
    Number(item.unitPrice).toFixed(2),
    Number(item.itemDiscount || 0).toFixed(2),
    Number(item.subtotal).toFixed(2),
  ]);

  autoTable(doc, {
    startY,
    head: [
      [
        "CÓDIGO",
        "CANT.",
        "UNIDAD",
        "DESCRIPCIÓN",
        "P. UNIT.",
        "DESC.",
        "SUBTOTAL",
      ],
    ],
    body,
    theme: "plain",
    styles: { fontSize: 8, cellPadding: 3, textColor: [0, 0, 0] },
    headStyles: {
      fontStyle: "bold",
      fontSize: 8,
      fillColor: [255, 255, 255],
      textColor: [0, 0, 0],
    },
    columnStyles: {
      0: { cellWidth: 24 },
      1: { cellWidth: 18 },
      2: { cellWidth: 22 },
      3: { cellWidth: 52 },
      4: { cellWidth: 22 },
      5: { cellWidth: 20 },
      6: { cellWidth: 24 },
    },
    didDrawCell: (data) => {
      const { cell, row } = data;
      doc.setDrawColor(0);
      doc.setLineWidth(0.2);
      if (row.section === "head") {
        doc.line(cell.x, cell.y, cell.x + cell.width, cell.y);
        doc.line(
          cell.x,
          cell.y + cell.height,
          cell.x + cell.width,
          cell.y + cell.height,
        );
      }
      if (row.section === "body") {
        doc.line(
          cell.x,
          cell.y + cell.height,
          cell.x + cell.width,
          cell.y + cell.height,
        );
      }
    },
  });

  return doc.lastAutoTable.finalY;
};

// =====================================================
// TOTALES
// =====================================================

const drawTotales = (doc, cotizacion, finalY) => {
  const boxX = 128;
  const boxY = finalY + 10;
  const labelWidth = 32;
  const valueWidth = 22;
  const rowHeight = 8;

  doc.setLineWidth(0.2);
  doc.rect(boxX, boxY, labelWidth + valueWidth, rowHeight * 3);
  doc.line(
    boxX,
    boxY + rowHeight,
    boxX + labelWidth + valueWidth,
    boxY + rowHeight,
  );
  doc.line(
    boxX,
    boxY + rowHeight * 2,
    boxX + labelWidth + valueWidth,
    boxY + rowHeight * 2,
  );
  doc.line(boxX + labelWidth, boxY, boxX + labelWidth, boxY + rowHeight * 3);

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");

  doc.text("SUBTOTAL Bs", boxX + 5, boxY + 5.5);
  doc.text(
    Number(cotizacion.subtotal).toFixed(2),
    boxX + labelWidth + valueWidth - 4,
    boxY + 5.5,
    { align: "right" },
  );

  doc.text("DESCUENTO Bs", boxX + 4, boxY + 13.5);
  doc.text(
    Number(cotizacion.discount).toFixed(2),
    boxX + labelWidth + valueWidth - 4,
    boxY + 13.5,
    { align: "right" },
  );

  doc.setFont("helvetica", "bold");
  doc.text("TOTAL Bs", boxX + 8, boxY + 21.5);
  doc.text(
    Number(cotizacion.total).toFixed(2),
    boxX + labelWidth + valueWidth - 4,
    boxY + 21.5,
    { align: "right" },
  );

  return boxY;
};

// =====================================================
// DOCUMENTO COTIZACIÓN
// =====================================================

const generarDocumentoCotizacion = (doc, cotizacion) => {
  const pageWidth = doc.internal.pageSize.getWidth();

  drawEmpresa(doc, cotizacion);

  // ---------- TITULO ----------
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("COTIZACIÓN", pageWidth / 2, 55, { align: "center" });

  doc.setFontSize(10);
  doc.text(cotizacion.code || "", pageWidth / 2, 63, { align: "center" });

  // ---------- DATOS ----------
  doc.setFontSize(9);
  let y = 70;

  // Fila 1: Vendedor | Sucursal | Fecha
  drawFila(
    doc,
    [
      {
        label: "Vendedor:",
        value: `${cotizacion.employee?.name || ""} ${
          cotizacion.employee?.lastName || ""
        }`.trim(),
        labelX: 14,
        valueX: 32,
        maxValueWidth: 57,
      },
      {
        label: "Sucursal:",
        value: cotizacion.location?.name,
        labelX: 95,
        valueX: 113,
        maxValueWidth: 35,
      },
      {
        label: "Fecha:",
        value: new Date(cotizacion.createdAt).toLocaleDateString("es-BO"),
        labelX: 152,
        valueX: 166,
        maxValueWidth: 34,
      },
    ],
    y,
  );

  y += 8;

  // Fila 2: Cliente | Teléfono
  drawFila(
    doc,
    [
      {
        label: "Cliente:",
        value: cotizacion.customer?.name || "S/N",
        labelX: 14,
        valueX: 32,
        maxValueWidth: 57,
      },
      {
        label: "Teléfono:",
        value: cotizacion.customer?.phone,
        labelX: 95,
        valueX: 113,
        maxValueWidth: 87,
      },
    ],
    y,
  );

  y += 8;

  // Fila 3: CI/NIT | Razón Social
  drawFila(
    doc,
    [
      {
        label: "CI/NIT:",
        value: cotizacion.customerNitSnapshot,
        labelX: 14,
        valueX: 32,
        maxValueWidth: 57,
      },
      {
        label: "Razón Social:",
        value: cotizacion.customerNitCompanySnapshot,
        labelX: 95,
        valueX: 120,
        maxValueWidth: 80,
      },
    ],
    y,
  );

  y += 8;

  // Fila 4: Válida hasta
  drawFila(
    doc,
    [
      {
        label: "Válida hasta:",
        value: cotizacion.expiresAt
          ? new Date(cotizacion.expiresAt).toLocaleDateString("es-BO")
          : "Sin vencimiento",
        labelX: 14,
        valueX: 40,
        maxValueWidth: 80,
      },
    ],
    y,
  );

  y += 8;

  // Fila 5: Notas (si existen, puede ocupar 2 líneas)
  if (cotizacion.notes) {
    doc.setFont("helvetica", "bold");
    doc.text("Notas:", 14, y);
    doc.setFont("helvetica", "normal");
    const notasLines = doc.splitTextToSize(cotizacion.notes, 155);
    const notasMostrar = notasLines.slice(0, 2);
    doc.text(notasMostrar, 35, y);
    y += notasMostrar.length > 1 ? 13 : 8;
  }

  // ---------- TABLA ----------
  const finalY = drawTablaProductos(doc, cotizacion, y + 6);

  // ---------- TOTALES ----------
  const boxY = drawTotales(doc, cotizacion, finalY);

  // ---------- AVISO LEGAL ----------
  doc.setFont("helvetica", "italic");
  doc.setFontSize(7.5);
  doc.setTextColor(120, 120, 120);
  doc.text(
    "* Esta cotización es válida hasta la fecha indicada. Los precios están sujetos a disponibilidad de stock.",
    14,
    boxY + 38,
  );
  doc.setTextColor(0, 0, 0);

  // ---------- FIRMA ----------
  const firmaY = boxY + 52;
  doc.setLineWidth(0.3);
  doc.line(78, firmaY, 78 + 45, firmaY);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text("Firma Vendedor", 90, firmaY + 6);
};

export const generarDocumentoCotizacion_ = (cotizacion) => {
  const doc = new jsPDF("p", "mm", "letter");
  generarDocumentoCotizacion(doc, cotizacion);
  return doc.output("blob");
};
