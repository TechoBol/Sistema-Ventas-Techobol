import React, { useCallback, useMemo, useState, useEffect } from "react";
import DataTable from "../components/table/DataTable";
import { useQuotations } from "../hooks/useQuotation";
import { useAmazonS3 } from "../hooks/useAmazonS3";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Dialog, DialogContent, DialogTitle, IconButton, Chip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { FaTrash } from "react-icons/fa";
import { FileText, Search, ArrowRight } from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import Swal from "sweetalert2";
import { generarDocumentoVenta } from "../components/pdf/generarPDF.jsx";
import { useSearchParams } from "react-router-dom";
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
    ConvertModalInputStyle,
    ConvertModalLabelStyle,
    ConvertModalButton,
} from "../components/ui/Products";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

// =====================================================
// UTILS
// =====================================================

const fechaHoy = () => {
    const fecha = new Date().toLocaleDateString("es-BO", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });
    return fecha.charAt(0).toUpperCase() + fecha.slice(1);
};

// =====================================================
// CHIP DE ESTADO
// =====================================================

const statusConfig = {
    PENDING: { label: "Pendiente", color: "warning" },
    APPROVED: { label: "Aprobada", color: "success" },
    REJECTED: { label: "Rechazada", color: "error" },
    EXPIRED: { label: "Vencida", color: "default" },
};

const StatusChip = ({ status }) => {
    const config = statusConfig[status] || { label: status, color: "default" };
    return <Chip label={config.label} color={config.color} size="small" />;
};

// =====================================================
// MODAL CONVERTIR A VENTA
// =====================================================

const ConvertModal = ({ open, onClose, onConfirm, loading }) => {
    const [metodoPago, setMetodoPago] = useState("Efectivo");
    const [bankName, setBankName] = useState("");
    const [codigoTransaccion, setCodigoTransaccion] = useState("");
    const [generateInvoice, setGenerateInvoice] = useState(false);

    const handleConfirm = () =>
        onConfirm({ metodoPago, bankName, codigoTransaccion, generateInvoice });

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                Convertir a Venta
                <IconButton onClick={onClose} size="small">
                    <CloseIcon fontSize="small" />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: "12px !important" }}>

                {/* Método de pago */}
                <div>
                    <label style={ConvertModalLabelStyle}>Método de Pago</label>
                    <select value={metodoPago} onChange={(e) => setMetodoPago(e.target.value)} style={ConvertModalInputStyle}>
                        <option value="Efectivo">Efectivo</option>
                        <option value="Deposito bancario">Depósito Bancario</option>
                        <option value="QR">QR</option>
                    </select>
                </div>

                {/* Banco — solo si es depósito */}
                {metodoPago === "Deposito bancario" && (
                    <div>
                        <label style={ConvertModalLabelStyle}>Banco Destino</label>
                        <input
                            type="text"
                            value={bankName}
                            onChange={(e) => setBankName(e.target.value)}
                            placeholder="Ej: Banco BCP"
                            style={ConvertModalInputStyle}
                        />
                    </div>
                )}

                {/* Código de transacción — QR o depósito */}
                {(metodoPago === "QR" || metodoPago === "Deposito bancario") && (
                    <div>
                        <label style={ConvertModalLabelStyle}>Código de Transacción</label>
                        <input
                            type="text"
                            value={codigoTransaccion}
                            onChange={(e) => setCodigoTransaccion(e.target.value)}
                            placeholder="Opcional"
                            style={ConvertModalInputStyle}
                        />
                    </div>
                )}

                {/* Generar factura */}
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <input
                        type="checkbox"
                        id="generateInvoice"
                        checked={generateInvoice}
                        onChange={(e) => setGenerateInvoice(e.target.checked)}
                    />
                    <label htmlFor="generateInvoice" style={{ fontSize: 14, cursor: "pointer" }}>
                        Generar Factura
                    </label>
                </div>

                <ConvertModalButton onClick={handleConfirm} disabled={loading}>
                    {loading ? "Procesando..." : "Confirmar Venta"}
                </ConvertModalButton>
            </DialogContent>
        </Dialog>
    );
};

// =====================================================
// PAGE
// =====================================================

function Quotations() {
    const [searchParams] = useSearchParams();
    const [search, setSearch] = useState(searchParams.get("search") ?? "");
    const { data, loading, updateStatus, convertToSale } = useQuotations();
    const { getFileUrl, uploadPDF } = useAmazonS3();
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    // PDF
    const [openPdf, setOpenPdf] = useState(false);
    const [pdfBlobUrl, setPdfBlobUrl] = useState("");
    const [numPages, setNumPages] = useState(null);
    const [pageWidth] = useState(600);
    const containerRef = React.useRef(null);

    // Convertir
    const [convertOpen, setConvertOpen] = useState(false);
    const [convertLoading, setConvertLoading] = useState(false);
    const [selectedQuotation, setSelectedQuotation] = useState(null);

    useEffect(() => {
        const code = searchParams.get("search");
        if (code !== null) {
            setSearch(code);
        }
    }, [searchParams]);

    // =====================================================
    // FILTROS
    // =====================================================

    const filteredRows = useMemo(() => {
        return (data || []).filter((q) => {
            if (search) {
                const s = search.trim().toLowerCase();
                const matchCode = q?.code?.toLowerCase()?.includes(s);
                const matchCliente = q?.customer?.name?.toLowerCase()?.includes(s);
                const matchEmpleado = q?.employee?.name?.toLowerCase()?.includes(s);
                const matchStatus = statusConfig[q?.status]?.label?.toLowerCase()?.includes(s);
                if (!matchCode && !matchCliente && !matchEmpleado && !matchStatus) return false;
            }
            if (q?.createdAt) {
                const d = dayjs(q.createdAt);
                if (startDate && d.isBefore(startDate, "day")) return false;
                if (endDate && d.isAfter(endDate, "day")) return false;
            }
            return true;
        });
    }, [data, search, startDate, endDate]);

    const totalAmount = useMemo(
        () => filteredRows.reduce((acc, row) => acc + Number(row.total || 0), 0),
        [filteredRows]
    );

    // =====================================================
    // PDF
    // =====================================================

    const handleViewPDF = useCallback(async (key, code) => {
        try {
            if (!key) return;
            const signedUrl = await getFileUrl(key);
            const response = await fetch(signedUrl);
            if (!response.ok) throw new Error("No se pudo descargar el PDF");
            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);
            setPdfBlobUrl(blobUrl);
            setOpenPdf(true);
        } catch (err) {
            console.error(err);
        }
    }, [getFileUrl]);

    const handleClosePdf = useCallback(() => {
        setOpenPdf(false);
        if (pdfBlobUrl) URL.revokeObjectURL(pdfBlobUrl);
        setPdfBlobUrl("");
        setNumPages(null);
    }, [pdfBlobUrl]);

    // =====================================================
    // CONVERTIR A VENTA
    // =====================================================

    const handleOpenConvert = (quotation) => {
        if (quotation.status !== "PENDING") {
            Swal.fire({
                title: "No disponible",
                text: "Solo se pueden convertir cotizaciones en estado Pendiente.",
                icon: "warning",
            });
            return;
        }
        setSelectedQuotation(quotation);
        setConvertOpen(true);
    };

    const handleConfirmConvert = async (paymentData) => {
        if (!selectedQuotation) return;
        try {
            setConvertLoading(true);
            const result = await convertToSale(selectedQuotation.id, paymentData);
            const sale = result?.sale;

            if (sale) {
                const pdfBlob = generarDocumentoVenta(sale);
                const file = new File([pdfBlob], `venta_${sale.code}.pdf`, {
                    type: "application/pdf",
                });
                await uploadPDF(file, sale.code);
            }

            setConvertOpen(false);
            setSelectedQuotation(null);
            await Swal.fire({
                title: "Venta registrada",
                text: "La cotización fue convertida exitosamente.",
                icon: "success",
                confirmButtonColor: "#2563eb",
            });
        } catch (err) {
            Swal.fire({ title: "Error", text: err.message || "No se pudo convertir la cotización.", icon: "error" });
        } finally {
            setConvertLoading(false);
        }
    };

    // =====================================================
    // CANCELAR COTIZACIÓN
    // =====================================================

    const handleCancel = async (quotation) => {
        if (quotation.status !== "PENDING") {
            Swal.fire({
                title: "No disponible",
                text: "Solo se pueden cancelar cotizaciones en estado Pendiente.",
                icon: "warning",
            });
            return;
        }

        const confirm = await Swal.fire({
            title: "¿Cancelar cotización?",
            text: `La cotización ${quotation.code} será marcada como rechazada.`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, cancelar",
            cancelButtonText: "Volver",
            confirmButtonColor: "#dc2626",
        });

        if (!confirm.isConfirmed) return;

        try {
            await updateStatus(quotation.id, "REJECTED");
            Swal.fire({ title: "Cancelada", text: "La cotización fue cancelada.", icon: "success", confirmButtonColor: "#2563eb" });
        } catch (err) {
            Swal.fire({ title: "Error", text: err.message, icon: "error" });
        }
    };

    // =====================================================
    // COLUMNAS
    // =====================================================

    const columns = useMemo(() => [
        { field: "code", headerName: "Código", flex: 1, minWidth: 130 },
        {
            field: "customer",
            headerName: "Cliente",
            flex: 1.5,
            minWidth: 180,
            valueGetter: (_, row) => row?.customer?.name || "S/N",
        },
        {
            field: "employee",
            headerName: "Vendedor",
            flex: 1.2,
            minWidth: 160,
            valueGetter: (_, row) =>
                `${row?.employee?.name || ""} ${row?.employee?.lastName || ""}`.trim() || "-",
        },
        {
            field: "location",
            headerName: "Sucursal",
            flex: 1.2,
            minWidth: 140,
            valueGetter: (_, row) => row?.location?.name || "-",
        },
        {
            field: "total",
            headerName: "Total",
            flex: 1,
            minWidth: 120,
            valueFormatter: (value) => `${Number(value || 0).toFixed(2)} Bs.`,
        },
        {
            field: "status",
            headerName: "Estado",
            flex: 1,
            minWidth: 130,
            renderCell: (params) => <StatusChip status={params.value} />,
        },
        {
            field: "expiresAt",
            headerName: "Vence",
            flex: 1.2,
            minWidth: 150,
            valueFormatter: (value) =>
                value ? dayjs(value).format("DD/MM/YYYY") : "Sin vencimiento",
        },
        {
            field: "createdAt",
            headerName: "Fecha",
            flex: 1.3,
            minWidth: 180,
            valueFormatter: (value) => value ? new Date(value).toLocaleString() : "-",
        },
    ], []);

    const actions = useMemo(() => [
        {
            key: "view-pdf",
            title: "Ver PDF",
            icon: FileText,
            onClick: (q) => handleViewPDF(`MEGADIS/QUOTATIONS/${q.code}.pdf`, q.code),
        },
        {
            key: "convert",
            title: "Convertir a Venta",
            icon: ArrowRight,
            onClick: handleOpenConvert,
        },
        {
            key: "cancel",
            title: "Rechazar",
            icon: ({ size }) => <FaTrash size={size} />,
            onClick: handleCancel,
        },
    ], [handleViewPDF]);

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <>
            <PageContainer>
                <PageHeader>
                    <HeaderTitle>
                        <Title>Cotizaciones</Title>
                        <Subtitle>{fechaHoy()}</Subtitle>
                    </HeaderTitle>

                    <TopActions>
                        <SearchWrapper>
                            <Search size={18} />
                            <SearchInput
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Buscar cotización..."
                            />
                        </SearchWrapper>

                        <FiltersGroup>
                            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
                                <DatePicker
                                    label="Desde"
                                    value={startDate}
                                    onChange={(v) => setStartDate(v)}
                                    slotProps={{
                                        textField: {
                                            size: "small",
                                            sx: {
                                                width: "150px",
                                                "& .MuiOutlinedInput-root": { height: "40px", borderRadius: "25px" },
                                            },
                                        },
                                    }}
                                />
                                <DatePicker
                                    label="Hasta"
                                    value={endDate}
                                    onChange={(v) => setEndDate(v)}
                                    slotProps={{
                                        textField: {
                                            size: "small",
                                            sx: {
                                                width: "150px",
                                                "& .MuiOutlinedInput-root": { height: "40px", borderRadius: "10px" },
                                            },
                                        },
                                    }}
                                />
                                <ClearFiltersButton
                                    type="button"
                                    title="Limpiar filtros"
                                    onClick={() => { setStartDate(null); setEndDate(null); }}
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
                    noRowsLabel="No hay cotizaciones registradas"
                />

                <TotalBar>
                    <TotalLabel>Total General:</TotalLabel>
                    <TotalValue>{totalAmount.toFixed(2)} Bs.</TotalValue>
                </TotalBar>

                {/* PDF VIEWER */}
                <Dialog
                    open={openPdf}
                    onClose={handleClosePdf}
                    maxWidth="md"
                    fullWidth
                    fullScreen={window.innerWidth < 768}
                    PaperProps={{ sx: { borderRadius: { xs: 0, md: "16px" } } }}
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
                        <div style={{ position: "absolute", top: 10, right: 10, display: "flex", gap: 8, zIndex: 1000 }}>
                            <IconButton onClick={handleClosePdf} sx={{ background: "white", "&:hover": { background: "#f0f0f0" } }}>
                                <CloseIcon />
                            </IconButton>
                        </div>

                        {pdfBlobUrl && (
                            <Document
                                file={pdfBlobUrl}
                                onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                                loading={<div>Cargando PDF...</div>}
                                error={<div>Error cargando PDF</div>}
                            >
                                {Array.from(new Array(numPages), (_, i) => (
                                    <Page key={`page_${i + 1}`} pageNumber={i + 1} width={pageWidth} renderTextLayer renderAnnotationLayer />
                                ))}
                            </Document>
                        )}
                    </DialogContent>
                </Dialog>

                {/* CONVERT MODAL */}
                <ConvertModal
                    open={convertOpen}
                    onClose={() => { setConvertOpen(false); setSelectedQuotation(null); }}
                    onConfirm={handleConfirmConvert}
                    loading={convertLoading}
                />
            </PageContainer>
        </>
    );
}

export default Quotations;