// utils/generarKardexPDF.ts

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import dayjs from "dayjs";

export const generarKardexPDF = ({
  data = [],
  producto,
  desde,
  hasta,
  sucursal,
}) => {
  const doc = new jsPDF("landscape");

  // =====================================================
  // 🔥 CONFIG
  // =====================================================

  const pageWidth = doc.internal.pageSize.getWidth();

  // =====================================================
  // 🔥 TITULO
  // =====================================================

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);

  doc.text("KARDEX FISICO VALORADO", pageWidth / 2, 15, {
    align: "center",
  });

  // =====================================================
  // 🔥 RANGO FECHAS
  // =====================================================

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);

  doc.text(
    `${dayjs(desde).format("DD/MM/YYYY")}  -  ${dayjs(hasta).format(
      "DD/MM/YYYY",
    )}`,
    pageWidth / 2,
    22,
    {
      align: "center",
    },
  );

  // =====================================================
  // 🔥 SUCURSAL
  // =====================================================

  doc.setFontSize(10);

  doc.text(`Sucursal: ${sucursal || "TODAS"}`, 14, 32);

  let currentY = 40;

  // =====================================================
  // 🔥 RECORRER PRODUCTOS
  // =====================================================

  data.forEach((grupo, index) => {
    // =====================================================
    // 🔥 NOMBRE PRODUCTO
    // =====================================================

    doc.setFont("helvetica", "bold");

    doc.setFontSize(11);

    doc.setFontSize(11);

    doc.text(`Producto: ${grupo.producto}`, 14, currentY);

    currentY += 5;

    doc.setFontSize(9);

    doc.text(`Código: ${grupo.barcode || "-"}`, 14, currentY);

    doc.text(`Línea: ${grupo.linea || "-"}`, 70, currentY);

    doc.text(`Marca: ${grupo.marca || "-"}`, 140, currentY);

    currentY += 6;

    // =====================================================
    // 🔥 TABLA
    // =====================================================
    const n = (value) => {
      const num = Number(value || 0);

      // 🔥 cortar a 2 decimales SIN redondear
      const truncated = Math.trunc(num * 100) / 100;

      return truncated.toLocaleString("es-ES", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      });
    };
    autoTable(doc, {
      startY: currentY,

      theme: "grid",

      tableWidth: "auto",

      margin: {
        left: 14,
        right: 8,
      },

      headStyles: {
        fillColor: [0, 0, 0],
        fontSize: 7,
        halign: "center",
        valign: "middle",
        cellPadding: 1.5,
        textColor: [255, 255, 255],
      },

      styles: {
        fontSize: 6.5,
        cellPadding: 1.2,
        valign: "middle",
        overflow: "linebreak",
        lineWidth: 0.1,
        textColor: 20,
      },

      bodyStyles: {
        minCellHeight: 5,
      },

      footStyles: {
        fillColor: [230, 230, 230],
        textColor: 0,
        fontStyle: "bold",
        halign: "right",
        fontSize: 6.5,
      },

      columnStyles: {
        // Código
        0: {
          cellWidth: 16,
          halign: "center",
        },

        // Fecha
        1: {
          cellWidth: 18,
          halign: "center",
        },

        // Cliente
        2: {
          cellWidth: 32,
        },

        // Detalle
        3: {
          cellWidth: 62,
        },

        // Entrada
        4: {
          cellWidth: 16,
          halign: "right",
        },

        // Salida
        5: {
          cellWidth: 16,
          halign: "right",
        },

        // Saldo
        6: {
          cellWidth: 18,
          halign: "right",
        },

        // C/U
        7: {
          cellWidth: 18,
          halign: "right",
        },

        // Entrada Bs
        8: {
          cellWidth: 22,
          halign: "right",
        },

        // Salida Bs
        9: {
          cellWidth: 22,
          halign: "right",
        },

        // Saldo Bs
        10: {
          cellWidth: 24,
          halign: "right",
        },
      },

      head: [
        [
          {
            content: "Código",
            rowSpan: 2,
          },

          {
            content: "Fecha",
            rowSpan: 2,
          },

          {
            content: "Cliente",
            rowSpan: 2,
          },

          {
            content: "Detalle",
            rowSpan: 2,
          },

          {
            content: "Inventario Físico",
            colSpan: 3,
          },

          {
            content: "Inventario Valorado",
            colSpan: 4,
          },
        ],

        [
          "Entrada",
          "Salida",
          "Saldo",

          "C/U",
          "Entrada Bs",
          "Salida Bs",
          "Saldo Bs",
        ],
      ],

      body: grupo.kardex.map((row) => {
        let codigo = "";

        if (row.detalle?.includes("VENTA")) {
          codigo = row.detalle.replace("VENTA ", "");
        }

        if (row.detalle?.includes("TRANSFERENCIA")) {
          codigo = row.codigoMovimiento || "";
        }

        return [
          codigo,

          dayjs(row.fecha).format("DD/MM/YYYY"),

          row.detalle?.includes("VENTA")
            ? "CONSUMIDOR FINAL"
            : row.detalle?.includes("TRANSFERENCIA")
            ? "TRANSFERENCIA"
            : "",

          row.detalle.replace(/→/g, "A"),

          n(row.entrada),
          n(row.salida),
          n(row.saldoCantidad),

          n(row.costoUnitario),
          n(row.entradaTotal),
          n(row.salidaTotal),
          n(row.saldoTotal),
        ];
      }),

      foot: [
        [
          "SUB TOTAL",
          "",
          "",
          "",

          n(
            grupo.kardex.reduce(
              (acc, row) => acc + Number(row.entrada || 0),
              0,
            ),
          ),

          n(
            grupo.kardex.reduce((acc, row) => acc + Number(row.salida || 0), 0),
          ),

          grupo.kardex.length > 0
            ? n(grupo.kardex[grupo.kardex.length - 1]?.saldoCantidad || 0)
            : n(0),

          "",

          n(
            grupo.kardex.reduce(
              (acc, row) => acc + Number(row.entradaTotal || 0),
              0,
            ),
          ),

          n(
            grupo.kardex.reduce(
              (acc, row) => acc + Number(row.salidaTotal || 0),
              0,
            ),
          ),

          grupo.kardex.length > 0
            ? n(grupo.kardex[grupo.kardex.length - 1]?.saldoTotal || 0)
            : n(0),
        ],
      ],

      didDrawPage: () => {
        doc.setFontSize(8);

        doc.text(`Página ${doc.getNumberOfPages()}`, pageWidth - 25, 10);
      },
    });

    // =====================================================
    // 🔥 NUEVA POSICION
    // =====================================================

    currentY = doc.lastAutoTable.finalY + 12;

    // =====================================================
    // 🔥 SALTO PAGINA
    // =====================================================

    if (currentY > 170 && index < data.length - 1) {
      doc.addPage();

      currentY = 20;
    }
  });

  // =====================================================
  // 🔥 GUARDAR PDF
  // =====================================================

  doc.save(`kardex_${producto?.name || "general"}.pdf`);
};
