import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// =====================================================
// NUMERO A LETRAS
// =====================================================

const numeroALetras = (num) => {
  const unidades = [
    "", "uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho",
    "nueve", "diez", "once", "doce", "trece", "catorce", "quince",
    "dieciséis", "diecisiete", "dieciocho", "diecinueve",
  ];
  const decenas = [
    "", "", "veinte", "treinta", "cuarenta", "cincuenta",
    "sesenta", "setenta", "ochenta", "noventa",
  ];
  const centenas = [
    "", "cien", "doscientos", "trescientos", "cuatrocientos", "quinientos",
    "seiscientos", "setecientos", "ochocientos", "novecientos",
  ];

  if (num === 0) return "cero 00/100 bolivianos";

  const entero = Math.floor(num);
  const decimales = Math.round((num - entero) * 100);

  const convertirGrupo = (n) => {
    if (n === 0) return "";
    if (n < 20) return unidades[n];
    if (n < 100) {
      const d = Math.floor(n / 10);
      const u = n % 10;
      if (n < 30) return u === 0 ? "veinte" : `veinti${unidades[u]}`;
      return u === 0 ? decenas[d] : `${decenas[d]} y ${unidades[u]}`;
    }
    if (n === 100) return "cien";
    const c = Math.floor(n / 100);
    const resto = n % 100;
    return resto === 0 ? centenas[c] : `${centenas[c]} ${convertirGrupo(resto)}`;
  };

  const convertir = (n) => {
    if (n < 1000) return convertirGrupo(n);
    if (n < 1000000) {
      const miles = Math.floor(n / 1000);
      const resto = n % 1000;
      const prefijo = miles === 1 ? "mil" : `${convertirGrupo(miles)} mil`;
      return resto === 0 ? prefijo : `${prefijo} ${convertirGrupo(resto)}`;
    }
    return "";
  };

  return `${convertir(entero)} ${String(decimales).padStart(2, "0")}/100 bolivianos`;
};

// =====================================================
// HELPERS
// =====================================================

// Trunca texto para que no supere un ancho máximo en mm
const truncarTexto = (doc, texto, maxWidth) => {
  const lines = doc.splitTextToSize(texto, maxWidth);
  return lines[0] || "-";
};

// Dibuja una fila de datos: etiqueta bold + valor normal, con truncado automático
const drawFila = (doc, items, y) => {
  // items: [{ label, value, labelX, valueX, maxValueWidth }]
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

const drawEmpresa = (doc, venta) => {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.text("MEGADIS S.R.L.", 14, 18);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.text(venta.location?.address || "Dirección no registrada", 14, 28);
  doc.text("Teléfono: 69417829", 14, 34);
  doc.text("Cochabamba - Bolivia", 14, 40);
};

// =====================================================
// TABLA PRODUCTOS
// =====================================================

const drawTablaProductos = (doc, venta, startY) => {
  const body = venta.details.map((item) => [
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
    styles: {
      fontSize: 8,
      cellPadding: 3,
      textColor: [0, 0, 0],
    },
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

const drawTotales = (doc, venta, finalY) => {
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
  doc.text(Number(venta.subtotal).toFixed(2), boxX + labelWidth + valueWidth - 4, boxY + 5.5, { align: "right" });

  doc.text("DESCUENTO Bs", boxX + 4, boxY + 13.5);
  doc.text(Number(venta.discount).toFixed(2), boxX + labelWidth + valueWidth - 4, boxY + 13.5, { align: "right" });

  doc.setFont("helvetica", "bold");
  doc.text("TOTAL Bs", boxX + 8, boxY + 21.5);
  doc.text(Number(venta.total).toFixed(2), boxX + labelWidth + valueWidth - 4, boxY + 21.5, { align: "right" });

  return boxY;
};

// =====================================================
// NOTA ENTREGA
// =====================================================

const generarNotaEntrega = (doc, venta, copia) => {
  doc.addPage("letter", "p");

  // Ancho útil: carta = 215.9mm, márgenes 14 cada lado → ~188mm útiles
  const pageWidth = doc.internal.pageSize.getWidth();

  drawEmpresa(doc, venta);

  // ---------- TITULO ----------
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("NOTA DE ENTREGA", pageWidth / 2, 55, { align: "center" });

  doc.setFontSize(10);
  doc.text(`COPIA ${copia}`, pageWidth / 2, 63, { align: "center" });

  // ---------- DATOS DEL CLIENTE ----------
  doc.setFontSize(9);

  let y = 70;

  // Fila 1: Cód. Cliente | Cód. Venta | Fecha
  drawFila(doc, [
    {
      label: "Cód. Cliente:",
      value: venta.customer?.code,
      labelX: 14,
      valueX: 40,
      maxValueWidth: 45,
    },
    {
      label: "Cód. Venta:",
      value: venta.code,
      labelX: 95,
      valueX: 115,
      maxValueWidth: 40,
    },
    {
      label: "Fecha:",
      value: new Date(venta.date).toLocaleDateString("es-BO"),
      labelX: 152,
      valueX: 166,
      maxValueWidth: 34,
    },
  ], y);

  y += 8;

  // Fila 2: Cliente | Vendedor
  drawFila(doc, [
    {
      label: "Cliente:",
      value: venta.customer?.name,
      labelX: 14,
      valueX: 34,
      maxValueWidth: 55,
    },
    {
      label: "Vendedor:",
      value: venta.employee
        ? `${venta.employee.name} ${venta.employee.lastName}`
        : null,
      labelX: 95,
      valueX: 113,
      maxValueWidth: 87,
    },
  ], y);

  y += 8;

  // Fila 3: CI/NIT | Razón Social
  drawFila(doc, [
    {
      label: "CI/NIT:",
      value: venta.customerNitSnapshot,
      labelX: 14,
      valueX: 34,
      maxValueWidth: 55,
    },
    {
      label: "Razón Social: ",
      value: venta.customerNitCompanySnapshot,
      labelX: 95,
      valueX: 120,
      maxValueWidth: 80,
    },
  ], y);

  y += 8;

  // Fila 4: Teléfono | Dirección en la misma fila
  drawFila(doc, [
    {
      label: "Teléfono:",
      value: venta.customer?.phone,
      labelX: 14,
      valueX: 34,
      maxValueWidth: 55,
    },
  ], y);

  y += 8;

  // Fila 5: Dirección (hasta 2 líneas si es larga)
  doc.setFont("helvetica", "bold");
  doc.text("Dirección:", 14, y);
  doc.setFont("helvetica", "normal");

  const direccion = venta.customerAddressSnapshot || "-";
  const lineasDir = doc.splitTextToSize(direccion, 155);
  const lineasMostrar = lineasDir.slice(0, 2);
  doc.text(lineasMostrar, 40, y);

  const extraDir = lineasMostrar.length > 1 ? 5 : 0;

  // ---------- TABLA PRODUCTOS ----------
  const finalY = drawTablaProductos(doc, venta, y + 10 + extraDir);

  // ---------- TOTALES ----------
  const boxY = drawTotales(doc, venta, finalY);

  // ---------- GLOSA ----------
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("Glosa:", 14, boxY + 14);
  doc.setFont("helvetica", "normal");

  const glosa = venta.glosa || "";
  const lineasGlosa = doc.splitTextToSize(glosa, 110);
  doc.text(lineasGlosa.slice(0, 2), 30, boxY + 14);

  // ---------- FIRMAS ----------
  const firmaY = boxY + 48;
  const width = 45;

  doc.setLineWidth(0.3);
  doc.line(18, firmaY, 18 + width, firmaY);
  doc.line(78, firmaY, 78 + width, firmaY);
  doc.line(138, firmaY, 138 + width, firmaY);

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text("Elaborado por", 30, firmaY + 6);
  doc.text("Despachado por", 90, firmaY + 6);
  doc.text("Recibí conforme", 148, firmaY + 6);
};

// =====================================================
// EXPORT PRINCIPAL
// =====================================================

export const generarDocumentoVenta = (venta) => {
  const doc = new jsPDF("p", "mm", "letter");
  doc.deletePage(1);

  generarNotaEntrega(doc, venta, "CLIENTE");
  generarNotaEntrega(doc, venta, "ARCHIVO");

  return doc.output("blob");
};