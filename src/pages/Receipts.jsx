import React, { useMemo, useState, useRef, useEffect } from "react";

import { DataGrid } from "@mui/x-data-grid";

import AppLayout from "../components/layout/AppLayout";

import { useSales } from "../hooks/useSale";

import { useAmazonS3 } from "../hooks/useAmazonS3";

import dayjs from "dayjs";
import "dayjs/locale/es";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import { FaTrash } from "react-icons/fa";
import {
  PageContainer,
  PageHeader,
  Title,
  TableContainer,
  SearchInput,
  TopActions,
  SearchWrapper,
  ActionButton,
  TotalBar,
  TotalLabel,
  TotalValue,
} from "../components/ui/Products";

import { Eye, FileText, Pencil } from "lucide-react";

import { Dialog, DialogContent, IconButton } from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";

import DownloadIcon from "@mui/icons-material/Download";

import PrintIcon from "@mui/icons-material/Print";

import { Document, Page, pdfjs } from "react-pdf";

import "react-pdf/dist/Page/AnnotationLayer.css";

import "react-pdf/dist/Page/TextLayer.css";

// =====================================================
// PDF WORKER
// =====================================================

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

function Receipts() {
  const { data } = useSales();

  const { getFileUrl } = useAmazonS3();

  const [search, setSearch] = useState("");

  // =====================================================
  // PDF STATES
  // =====================================================

  const [openPdf, setOpenPdf] = useState(false);

  const [pdfBlobUrl, setPdfBlobUrl] = useState("");

  const [numPages, setNumPages] = useState(null);

  const [pageWidth, setPageWidth] = useState(600);

  const containerRef = useRef(null);

  // =====================================================
  // RESPONSIVE PDF
  // =====================================================

  useEffect(() => {
    if (!openPdf) return;

    const updateWidth = () => {
      if (containerRef.current) {
        setPageWidth(containerRef.current.offsetWidth - 32);
      }
    };

    updateWidth();

    window.addEventListener("resize", updateWidth);

    return () => {
      window.removeEventListener("resize", updateWidth);
    };
  }, [openPdf]);

  // =====================================================
  // VIEW PDF
  // =====================================================

  const handleViewPDF = async (key, code) => {
    try {
      console.log("KEY:", key);

      const signedUrl = await getFileUrl(key);

      const response = await fetch(signedUrl);

      if (!response.ok) {
        throw new Error("No se pudo descargar PDF");
      }

      const blob = await response.blob();

      const blobUrl = URL.createObjectURL(blob);

      setPdfBlobUrl(blobUrl);

      setCurrentCode(code);

      setOpenPdf(true);
    } catch (error) {
      console.error(error);
    }
  };

  // =====================================================
  // CLOSE PDF
  // =====================================================

  const handleClosePdf = () => {
    setOpenPdf(false);

    if (pdfBlobUrl) {
      URL.revokeObjectURL(pdfBlobUrl);
    }

    setPdfBlobUrl("");

    setNumPages(null);
  };

  // =====================================================
  // PDF LOAD SUCCESS
  // =====================================================

  const onDocumentLoadSuccess = ({ numPages }) => {
    console.log("PDF PAGES:", numPages);

    setNumPages(numPages);
  };

  // =====================================================
  // DOWNLOAD PDF
  // =====================================================
  const [currentCode, setCurrentCode] = useState("");

  const handleDownloadPdf = () => {
    const a = document.createElement("a");

    a.href = pdfBlobUrl;

    a.download = `${currentCode}.pdf`;

    a.click();
  };

  // =====================================================
  // PRINT PDF
  // =====================================================

  const handlePrintPdf = () => {
    const iframe = document.createElement("iframe");

    iframe.style.position = "fixed";

    iframe.style.right = "0";

    iframe.style.bottom = "0";

    iframe.style.width = "0";

    iframe.style.height = "0";

    iframe.style.border = "0";

    iframe.src = pdfBlobUrl;

    document.body.appendChild(iframe);

    iframe.onload = () => {
      iframe.contentWindow.focus();

      iframe.contentWindow.print();
    };
  };

  // =====================================================
  // FILTER
  // =====================================================
  const [startDate, setStartDate] = useState(null);

  const [endDate, setEndDate] = useState(null);

  const filteredRows = useMemo(() => {
    return (data || []).filter((sale) => {
      // =====================================================
      // FILTRO TEXTO
      // =====================================================

      if (search) {
        const q = search.trim().toLowerCase();

        const matchCode = sale?.code?.toLowerCase()?.includes(q);

        const matchCliente = sale?.customer?.name?.toLowerCase()?.includes(q);

        const matchNit = sale?.customer?.nitCi?.toLowerCase()?.includes(q);

        const matchEmpleado = sale?.employee?.name?.toLowerCase()?.includes(q);

        const matchSucursal = sale?.location?.name?.toLowerCase()?.includes(q);

        const matchTipo = sale?.typeSale?.trim()?.toLowerCase()?.includes(q);

        if (
          !matchCode &&
          !matchCliente &&
          !matchNit &&
          !matchEmpleado &&
          !matchSucursal &&
          !matchTipo
        ) {
          return false;
        }
      }

      // =====================================================
      // FILTRO FECHAS
      // =====================================================

      if (sale?.date) {
        const saleDate = dayjs(sale.date);

        if (startDate && saleDate.isBefore(startDate, "day")) {
          return false;
        }

        if (endDate && saleDate.isAfter(endDate, "day")) {
          return false;
        }
      }

      return true;
    });
  }, [data, search, startDate, endDate]);

  // =====================================================
  // COLUMNS
  // =====================================================

  const columns = [
    {
      field: "code",
      headerName: "Código",
      flex: 1,
      minWidth: 130,
    },

    {
      field: "customer",
      headerName: "Cliente",
      flex: 1.5,
      minWidth: 180,

      valueGetter: (_, row) => row?.customer?.name || "S/N",
    },

    {
      field: "nitCi",
      headerName: "NIT/CI",
      flex: 1,
      minWidth: 130,

      valueGetter: (_, row) => row?.customer?.nitCi || "-",
    },

    {
      field: "employee",
      headerName: "Vendedor",
      flex: 1.2,
      minWidth: 160,

      valueGetter: (_, row) =>
        `${row?.employee?.name || ""} ${row?.employee?.lastName || ""}`,
    },

    {
      field: "location",
      headerName: "Sucursal",
      flex: 1.2,
      minWidth: 140,

      valueGetter: (_, row) => row?.location?.name || "-",
    },

    {
      field: "typeSale",
      headerName: "Pago",
      flex: 1,
      minWidth: 120,
    },

    {
      field: "subtotal",
      headerName: "Subtotal",
      flex: 1,
      minWidth: 120,

      valueFormatter: (value) => `${Number(value || 0).toFixed(2)} Bs.`,
    },

    {
      field: "discount",
      headerName: "Descuento",
      flex: 1,
      minWidth: 120,

      valueFormatter: (value) => `${Number(value || 0).toFixed(2)} Bs.`,
    },

    {
      field: "total",
      headerName: "Total",
      flex: 1,
      minWidth: 120,

      valueFormatter: (value) => `${Number(value || 0).toFixed(2)} Bs.`,
    },

    {
      field: "date",
      headerName: "Fecha",
      flex: 1.3,
      minWidth: 180,

      valueFormatter: (value) => new Date(value).toLocaleString(),
    },

    {
      field: "actions",
      headerName: "",
      sortable: false,
      filterable: false,
      width: 100,
      align: "center",
      headerAlign: "center",

      renderCell: (params) => (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100%",
          }}
        >
          <ActionButton
            title="Ver PDF"
            onClick={() => handleViewPDF(params.row.pdfUrl, params.row.code)}
          >
            <FileText size={20} />
          </ActionButton>
        </div>
      ),
    },
  ];
  const totalAmount = useMemo(() => {
    return filteredRows.reduce((acc, row) => acc + Number(row.total || 0), 0);
  }, [filteredRows]);
  return (
    <AppLayout>
      <PageContainer>
        <PageHeader>
          <Title>Comprobantes</Title>

          <TopActions>
            <SearchWrapper>
              <SearchInput
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar venta..."
              />
            </SearchWrapper>

            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
              <DatePicker
                label="Desde"
                value={startDate}
                onChange={(value) => setStartDate(value)}
                slotProps={{
                  textField: {
                    size: "small",
                    sx: {
                      width: "150px",

                      "& .MuiOutlinedInput-root": {
                        height: "40px",
                        borderRadius: "10px",
                      },
                    },
                  },
                }}
              />

              <DatePicker
                label="Hasta"
                value={endDate}
                onChange={(value) => setEndDate(value)}
                slotProps={{
                  textField: {
                    size: "small",
                    sx: {
                      width: "150px",

                      "& .MuiOutlinedInput-root": {
                        height: "40px",
                        borderRadius: "10px",
                      },
                    },
                  },
                }}
              />

              <button
                onClick={() => {
                  setStartDate(null);
                  setEndDate(null);
                }}
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FaTrash size={16} color="#999" />
              </button>
            </LocalizationProvider>
          </TopActions>
        </PageHeader>

        <TableContainer>
          <DataGrid
            rows={filteredRows}
            columns={columns}
            disableRowSelectionOnClick
            getRowId={(row) => row.id}
            // PAGINACIÓN
            pagination
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 8,
                },
              },
            }}
            pageSizeOptions={[8, 10, 20, 50]}
            localeText={{
              noRowsLabel: "No hay ventas registradas",
            }}
          />
        </TableContainer>

        <TotalBar>
          <TotalLabel>Total General: </TotalLabel>

          <TotalValue>{totalAmount.toFixed(2)} Bs.</TotalValue>
        </TotalBar>

        {/* ===================================================== */}
        {/* PDF MODAL */}
        {/* ===================================================== */}

        <Dialog
          open={openPdf}
          onClose={handleClosePdf}
          maxWidth="md"
          fullWidth
          fullScreen={window.innerWidth < 768}
          PaperProps={{
            sx: {
              borderRadius: {
                xs: 0,
                md: "16px",
              },
            },
          }}
        >
          <DialogContent
            ref={containerRef}
            sx={{
              background: "#f5f5f5",
              paddingTop: "50px",
              minHeight: "80vh",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              position: "relative",
            }}
          >
            {/* ===================================================== */}
            {/* BOTONES */}
            {/* ===================================================== */}

            <div
              style={{
                position: "absolute",
                top: 10,
                right: 10,
                display: "flex",
                gap: 8,
                zIndex: 1000,
              }}
            >
              {/* DESCARGAR */}

              <IconButton
                onClick={handleDownloadPdf}
                sx={{
                  background: "white",

                  "&:hover": {
                    background: "#f0f0f0",
                  },
                }}
              >
                <DownloadIcon />
              </IconButton>

              {/* IMPRIMIR */}

              <IconButton
                onClick={handlePrintPdf}
                sx={{
                  background: "white",

                  "&:hover": {
                    background: "#f0f0f0",
                  },
                }}
              >
                <PrintIcon />
              </IconButton>

              {/* CERRAR */}

              <IconButton
                onClick={handleClosePdf}
                sx={{
                  background: "white",

                  "&:hover": {
                    background: "#f0f0f0",
                  },
                }}
              >
                <CloseIcon />
              </IconButton>
            </div>

            {/* ===================================================== */}
            {/* PDF */}
            {/* ===================================================== */}

            {pdfBlobUrl && (
              <Document
                file={pdfBlobUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                loading={<div>Cargando PDF...</div>}
                error={<div>Error cargando PDF</div>}
              >
                {Array.from(new Array(numPages), (_, index) => (
                  <Page
                    key={`page_${index + 1}`}
                    pageNumber={index + 1}
                    width={pageWidth}
                    renderTextLayer
                    renderAnnotationLayer
                  />
                ))}
              </Document>
            )}
          </DialogContent>
        </Dialog>
      </PageContainer>
    </AppLayout>
  );
}

export default Receipts;
