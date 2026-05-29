import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// =====================================================
// CABECERA EMPRESA
// =====================================================

const drawEmpresa = (doc) => {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.text("TECHO BOL S.R.L.", 14, 18);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.text("Av. La Juventud s/n Zona El Abra - Cochabamba - Bolivia", 14, 28);
  doc.text("Teléfono: 69415220", 14, 34);
  doc.text("Cochabamba - Bolivia", 14, 40);
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
    head: [["CÓDIGO", "CANT.", "UNIDAD", "DESCRIPCIÓN", "P. UNIT.", "DESC.", "SUBTOTAL"]],
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
        doc.line(cell.x, cell.y + cell.height, cell.x + cell.width, cell.y + cell.height);
      }
      if (row.section === "body") {
        doc.line(cell.x, cell.y + cell.height, cell.x + cell.width, cell.y + cell.height);
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
  doc.line(boxX, boxY + rowHeight, boxX + labelWidth + valueWidth, boxY + rowHeight);
  doc.line(boxX, boxY + rowHeight * 2, boxX + labelWidth + valueWidth, boxY + rowHeight * 2);
  doc.line(boxX + labelWidth, boxY, boxX + labelWidth, boxY + rowHeight * 3);

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");

  doc.text("SUBTOTAL Bs", boxX + 5, boxY + 5.5);
  doc.text(Number(cotizacion.subtotal).toFixed(2), boxX + labelWidth + valueWidth - 4, boxY + 5.5, { align: "right" });

  doc.text("DESCUENTO Bs", boxX + 4, boxY + 13.5);
  doc.text(Number(cotizacion.discount).toFixed(2), boxX + labelWidth + valueWidth - 4, boxY + 13.5, { align: "right" });

  doc.setFont("helvetica", "bold");
  doc.text("TOTAL Bs", boxX + 8, boxY + 21.5);
  doc.text(Number(cotizacion.total).toFixed(2), boxX + labelWidth + valueWidth - 4, boxY + 21.5, { align: "right" });

  return boxY;
};

// =====================================================
// DOCUMENTO COTIZACIÓN
// =====================================================

const generarDocumentoCotizacion = (doc, cotizacion) => {
  const pageWidth = doc.internal.pageSize.getWidth();

  drawEmpresa(doc);

  // ── Título ──
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("COTIZACIÓN", pageWidth / 2, 55, { align: "center" });

  doc.setFontSize(10);
  doc.text(cotizacion.code || "", pageWidth / 2, 63, { align: "center" });

  // ── Datos ──
  let y = 80;
  doc.setFontSize(9);

  // Fila 1
  doc.setFont("helvetica", "bold");
  doc.text("Vendedor:", 14, y);
  doc.text("Sucursal:", 85, y);
  doc.text("Fecha:", 150, y);
  doc.setFont("helvetica", "normal");
  doc.text(
    `${cotizacion.employee?.name || ""} ${cotizacion.employee?.lastName || ""}`.trim() || "-",
    35, y
  );
  doc.text(cotizacion.location?.name || "-", 105, y);
  doc.text(new Date(cotizacion.createdAt).toLocaleDateString("es-BO"), 163, y);

  // Fila 2
  y += 10;
  doc.setFont("helvetica", "bold");
  doc.text("Cliente:", 14, y);
  doc.text("CI/NIT:", 85, y);
  doc.text("Teléfono:", 150, y);
  doc.setFont("helvetica", "normal");
  doc.text(cotizacion.customer?.name || "S/N", 35, y);
  doc.text(cotizacion.customer?.nitCi || "-", 105, y);
  doc.text(cotizacion.customer?.phone || "-", 168, y);

  // Fila 3 — validez
  y += 10;
  doc.setFont("helvetica", "bold");
  doc.text("Válida hasta:", 14, y);
  doc.setFont("helvetica", "normal");
  doc.text(
    cotizacion.expiresAt
      ? new Date(cotizacion.expiresAt).toLocaleDateString("es-BO")
      : "Sin vencimiento",
    40, y
  );

  // Fila 4 — notas
  if (cotizacion.notes) {
    y += 10;
    doc.setFont("helvetica", "bold");
    doc.text("Notas:", 14, y);
    doc.setFont("helvetica", "normal");
    const notasLines = doc.splitTextToSize(cotizacion.notes, 150);
    doc.text(notasLines, 35, y);
    y += (notasLines.length - 1) * 5;
  }

  const finalY = drawTablaProductos(doc, cotizacion, y + 12);
  const boxY = drawTotales(doc, cotizacion, finalY);

  // ── Aviso legal ──
  doc.setFont("helvetica", "italic");
  doc.setFontSize(7.5);
  doc.setTextColor(120, 120, 120);
  doc.text(
    "* Esta cotización es válida hasta la fecha indicada. Los precios están sujetos a disponibilidad de stock.",
    14, boxY + 38
  );
  doc.setTextColor(0, 0, 0);

  // ── Firma ──
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