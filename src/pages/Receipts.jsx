import React, { useCallback, useMemo, useRef, useState, useEffect } from "react";

import AppLayout from "../components/layout/AppLayout";
import DataTable from "../components/table/DataTable";

import { useSales } from "../hooks/useSale";
import { useAmazonS3 } from "../hooks/useAmazonS3";

import dayjs from "dayjs";
import "dayjs/locale/es";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import { Dialog, DialogContent, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";
import PrintIcon from "@mui/icons-material/Print";

import { FaTrash } from "react-icons/fa";
import { FileText, Search } from "lucide-react";

import { Document, Page, pdfjs } from "react-pdf";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

import {
  PageContainer,
  PageHeader,
  HeaderTitle,
  Title,
  Subtitle,
  SearchInput,
  TopActions,
  FiltersGroup,
  SearchWrapper,
  TotalBar,
  TotalLabel,
  TotalValue,
  ClearFiltersButton,
} from "../components/ui/Products";

const fechaHoy = () =>
  new Date().toLocaleDateString("es-BO", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

// =====================================================
// PDF WORKER
// =====================================================

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

function Receipts() {
  const { data } = useSales();
  const { getFileUrl } = useAmazonS3();

  const containerRef = useRef(null);

  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [openPdf, setOpenPdf] = useState(false);
  const [pdfBlobUrl, setPdfBlobUrl] = useState("");
  const [numPages, setNumPages] = useState(null);
  const [pageWidth, setPageWidth] = useState(600);
  const [currentCode, setCurrentCode] = useState("");

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
  // FILTER
  // =====================================================

  const filteredRows = useMemo(() => {
    return (data || []).filter((sale) => {
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

  const totalAmount = useMemo(() => {
    return filteredRows.reduce((acc, row) => acc + Number(row.total || 0), 0);
  }, [filteredRows]);

  // =====================================================
  // PDF ACTIONS
  // =====================================================

  const handleViewPDF = useCallback(
    async (key, code) => {
      try {
        if (!key) return;

        const signedUrl = await getFileUrl(key);
        const response = await fetch(signedUrl);

        if (!response.ok) {
          throw new Error("No se pudo descargar PDF");
        }

        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);

        setPdfBlobUrl(blobUrl);
        setCurrentCode(code || "comprobante");
        setOpenPdf(true);
      } catch (error) {
        console.error("Error al abrir PDF:", error);
      }
    },
    [getFileUrl]
  );

  const handleClosePdf = useCallback(() => {
    setOpenPdf(false);

    if (pdfBlobUrl) {
      URL.revokeObjectURL(pdfBlobUrl);
    }

    setPdfBlobUrl("");
    setNumPages(null);
  }, [pdfBlobUrl]);

  const handleDownloadPdf = useCallback(() => {
    if (!pdfBlobUrl) return;

    const a = document.createElement("a");
    a.href = pdfBlobUrl;
    a.download = `${currentCode || "comprobante"}.pdf`;
    a.click();
  }, [pdfBlobUrl, currentCode]);

  const handlePrintPdf = useCallback(() => {
    if (!pdfBlobUrl) return;

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
  }, [pdfBlobUrl]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  // =====================================================
  // TABLE
  // =====================================================

  const columns = useMemo(
    () => [
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
          `${row?.employee?.name || ""} ${row?.employee?.lastName || ""}`.trim() ||
          "-",
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
        valueGetter: (_, row) => row?.typeSale || "-",
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
        valueFormatter: (value) => {
          if (!value) return "-";
          return new Date(value).toLocaleString();
        },
      },
    ],
    []
  );

  const actions = useMemo(
    () => [
      {
        key: "view-pdf",
        title: "Ver PDF",
        icon: FileText,
        onClick: (sale) => handleViewPDF(sale.pdfUrl, sale.code),
      },
    ],
    [handleViewPDF]
  );

  return (
    <AppLayout>
      <PageContainer>
        <PageHeader>
          {/* titulo y fecha */}
          <HeaderTitle>
            <Title>Comprobantes</Title>
            <Subtitle>{fechaHoy()}</Subtitle>
          </HeaderTitle>

          <TopActions>
            <SearchWrapper>
              <Search size={18} />
              <SearchInput
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar venta..."
              />
            </SearchWrapper>

            <FiltersGroup>
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

              <ClearFiltersButton
                type="button"
                title="Limpiar filtros"
                onClick={() => {
                  setStartDate(null);
                  setEndDate(null);
                }}
              >
                <FaTrash size={16} />
              </ClearFiltersButton>
            </LocalizationProvider>
            </FiltersGroup>
          </TopActions>
        </PageHeader>

        <DataTable
          rows={filteredRows}
          columns={columns}
          actions={actions}
          getRowId={(row) => row.id}
          pageSize={8}
          pageSizeOptions={[8, 10, 20, 50]}
          noRowsLabel="No hay ventas registradas"
        />

        <TotalBar>
          <TotalLabel>Total General:</TotalLabel>
          <TotalValue>{totalAmount.toFixed(2)} Bs.</TotalValue>
        </TotalBar>

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
