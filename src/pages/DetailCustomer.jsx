import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAmazonS3 } from "../hooks/useAmazonS3";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { useDetailCustomer } from "../hooks/useDetailCustomer";

import {
  Wrapper,
  Header,
  BackButton,
  Title,
  Layout,
  Column,
  MainGrid,
  Card,
  CardHeader,
  CardTitle,
  RedDot,
  ClientTop,
  Avatar,
  ClientName,
  ClientSubtext,
  Section,
  SectionTitle,
  InfoList,
  InfoRow,
  InfoLabel,
  InfoValue,
  StatsGrid,
  StatCard,
  StatValue,
  StatLabel,
  NotesInput,
  TableWrapper,
  Table,
  Th,
  Td,
  Map,
} from "../components/ui/DetailCustomer";

const formatBs = (n) =>
  `Bs. ${Number(n).toLocaleString("es-BO", {
    minimumFractionDigits: 2,
  })}`;

export default function DetailCustomer() {
  const { id = "" } = useParams();
  const navigate = useNavigate();

  const {
    customer,
    loading,
    error,
    totalGastado,
    comprasRealizadas,
    ticketPromedio,
    ultimaCompra,
    ventasPorMes,
    cotizaciones,
    loadingQuotes,
    crearNota,
    actualizarNota,
  } = useDetailCustomer(id);

  const [nota, setNota] = useState("");

  const debounceRef = useRef(null);
  const inicializado = useRef(false);
  const [tabActiva, setTabActiva] = useState("compras");
  const { getFileUrl } = useAmazonS3();
  const [pdfModal, setPdfModal] = useState(false);
  const [pdfBlobUrl, setPdfBlobUrl] = useState("");
  const [numPages, setNumPages] = useState(null);
  const [modalActividades, setModalActividades] = useState(false);

  useEffect(() => {
    if (!inicializado.current && customer) {
      const contenido = customer?.notes?.[0]?.content ?? "";
      setNota(contenido.trim());
      inicializado.current = true;
    }
  }, [customer]);

  useEffect(() => {
    inicializado.current = false;
  }, [id]);

  const handleNotaChange = (e) => {
    const value = e.target.value;

    setNota(value);

    clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      const notaExistente = customer?.notes?.[0];

      if (notaExistente) {
        await actualizarNota(notaExistente.id, value);
      } else if (value.trim()) {
        await crearNota(value);
      }
    }, 800);
  };

  if (error) {
    return (
      <Wrapper>
        <h2>{error}</h2>
      </Wrapper>
    );
  }

  const direccionPrincipal =
    customer?.addresses?.find((a) => a.isPrimary) ?? customer?.addresses?.[0];

  const estadoLabel = {
    // Cotizaciones
    PENDING: "Pendiente",
    APPROVED: "Aprobado",
    REJECTED: "Rechazado",
    EXPIRED: "Expirado",
    // Ventas
    Realizado: "Realizado",
  };

  const estadoColor = {
    APPROVED: { background: "#dcfce7", color: "#16a34a" },
    Realizado: { background: "#dcfce7", color: "#16a34a" },
    PENDING: { background: "#fef9c3", color: "#ca8a04" },
    REJECTED: { background: "#fee2e2", color: "#dc2626" },
    EXPIRED: { background: "#fee2e2", color: "#dc2626" },
  };

  const EstadoBadge = ({ estado }) => {
    const style = estadoColor[estado] ?? { background: "#f3f4f6", color: "#6b7280" };
    return (
      <span style={{
        ...style,
        padding: "2px 10px",
        borderRadius: "999px",
        fontSize: "12px",
        fontWeight: "600",
      }}>
        {estadoLabel[estado] ?? estado}
      </span>
    );
  };

  const handleViewPDF = async (pdfUrl) => {
    try {
      if (!pdfUrl) return;
      const signedUrl = await getFileUrl(pdfUrl);
      const response = await fetch(signedUrl);
      if (!response.ok) throw new Error("No se pudo descargar el PDF");
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      setPdfBlobUrl(blobUrl);
      setPdfModal(true);
    } catch (err) {
      console.error("Error al abrir PDF:", err);
    }
  };

  const handleClosePdf = () => {
    setPdfModal(false);
    if (pdfBlobUrl) URL.revokeObjectURL(pdfBlobUrl);
    setPdfBlobUrl("");
    setNumPages(null);
  };

  const actividades = [
    ...(customer?.sales ?? []).map((s) => ({
      id: s.id,
      code: s.code,
      pdfUrl: s.pdfUrl,
      tipo: "Compra",
      nitCi: s.customer?.nitCi,
      empleado: s.employee,
      sucursal: s.location?.name,
      total: s.total,
      estado: "Realizado",
      fecha: s.date,
    })),
    ...(cotizaciones ?? []).map((q) => ({
      id: q.id,
      code: q.code,
      pdfUrl: q.pdfUrl,
      tipo: "Cotización",
      nitCi: q.customer?.nitCi,
      empleado: q.employee,
      sucursal: q.location?.name,
      total: q.total,
      estado: q.status,
      fecha: q.createdAt,
    })),
  ].sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

  return (
    <Wrapper>
      <Header>
        <BackButton onClick={() => navigate(-1)}>‹</BackButton>

        <Title>Cliente</Title>
      </Header>

      <Layout>
        {/* LEFT SIDEBAR */}
        <Column>
          {/* CLIENTE */}
          <Card>
            <CardHeader>
              <CardTitle>
                <RedDot />
                Cliente
              </CardTitle>
            </CardHeader>

            {!loading && customer && (
              <>
                <ClientTop>
                  <Avatar
                    src={`https://api.dicebear.com/9.x/fun-emoji/svg?seed=${customer.id}&backgroundColor=ffdfbf,ffd5dc,d1d4f9,c0aede,b6e3f4`}
                    alt={customer.name}
                  />

                  <div>
                    <ClientName>{customer.name}</ClientName>

                    <ClientSubtext>
                      {customer.occupation ?? "—"} •{" "}
                      {new Date(customer.createdAt).toLocaleDateString("es-BO")}
                    </ClientSubtext>
                  </div>
                </ClientTop>

                <Section>
                  <SectionTitle>Contacto</SectionTitle>

                  <InfoList>
                    <InfoRow>
                      <InfoLabel>Teléfono</InfoLabel>

                      <InfoValue>{customer.phone ?? "—"}</InfoValue>
                    </InfoRow>

                    <InfoRow>
                      <InfoLabel>WhatsApp</InfoLabel>

                      <InfoValue>{customer.whatsapp ?? "—"}</InfoValue>
                    </InfoRow>

                    <InfoRow>
                      <InfoLabel>Dirección</InfoLabel>

                      <InfoValue>
                        {direccionPrincipal?.address ?? "—"}
                      </InfoValue>
                    </InfoRow>
                  </InfoList>
                </Section>

                <Section>
                  <SectionTitle>Información Comercial</SectionTitle>

                  <InfoList>
                    <InfoRow>
                      <InfoLabel>Canal de origen</InfoLabel>

                      <InfoValue>{customer.originChannel ?? "—"}</InfoValue>
                    </InfoRow>

                    <InfoRow>
                      <InfoLabel>Última compra</InfoLabel>

                      <InfoValue>{ultimaCompra ?? "—"}</InfoValue>
                    </InfoRow>

                    <InfoRow>
                      <InfoLabel>Método de pago</InfoLabel>

                      <InfoValue>
                        {customer.favoritePaymentMethod ?? "—"}
                      </InfoValue>
                    </InfoRow>
                  </InfoList>
                </Section>

                <Section>
                  <SectionTitle>Información Financiera</SectionTitle>

                  <InfoList>
                    <InfoRow>
                      <InfoLabel>Total gastado</InfoLabel>

                      <InfoValue>{formatBs(totalGastado)}</InfoValue>
                    </InfoRow>

                    <InfoRow>
                      <InfoLabel>Ticket promedio</InfoLabel>

                      <InfoValue>{formatBs(ticketPromedio)}</InfoValue>
                    </InfoRow>
                  </InfoList>
                </Section>
              </>
            )}
          </Card>

          {/* NOTAS */}
          <Card>
            <CardHeader>
              <CardTitle>
                <RedDot />
                Notas
              </CardTitle>
            </CardHeader>

            <NotesInput
              value={nota}
              onChange={handleNotaChange}
              placeholder="Escribe una nota..."
            />
          </Card>
        </Column>

        {/* CENTER + RIGHT */}
        {/* CENTER */}
        <Column>
          {/* DASHBOARD */}
          <Card>
            <CardHeader>
              <CardTitle>
                <RedDot />
                Dashboard
              </CardTitle>
            </CardHeader>

            {!loading && customer && (
              <StatsGrid>
                <StatCard $accent>
                  <StatValue>{formatBs(totalGastado)}</StatValue>

                  <StatLabel>Total Gastado</StatLabel>
                </StatCard>

                <StatCard $dark>
                  <StatValue>{comprasRealizadas}</StatValue>

                  <StatLabel>Compras realizadas</StatLabel>
                </StatCard>

                <StatCard>
                  <StatValue>{formatBs(ticketPromedio)}</StatValue>

                  <StatLabel>Ticket promedio</StatLabel>
                </StatCard>

                <StatCard $dark>
                  <StatValue>{ultimaCompra ?? "—"}</StatValue>

                  <StatLabel>Última compra</StatLabel>
                </StatCard>
              </StatsGrid>
            )}
          </Card>

          {/* ACTIVIDADES */}
          <Card>
            <CardHeader>
              <CardTitle>
                <RedDot />
                Actividades del cliente
              </CardTitle>
              <button
                onClick={() => setModalActividades(true)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "22px",
                  color: "#6b7280",
                  lineHeight: 1,
                }}
              >
                ›
              </button>
            </CardHeader>

            <TableWrapper>
              <Table>
                <thead>
                  <tr>
                    <Th>Código</Th>
                    <Th>CI/NIT</Th>
                    <Th>Fecha</Th>
                    <Th>Tipo</Th>
                    <Th>Monto</Th>
                    <Th>Estado</Th>
                  </tr>
                </thead>

                <tbody>
                  {actividades.slice(0, 7).map((item) => (
                    <tr
                      key={`${item.tipo}-${item.id}`}
                      onClick={() => item.pdfUrl && handleViewPDF(item.pdfUrl)}
                      style={{ cursor: item.pdfUrl ? "pointer" : "default" }}
                    >
                      <Td>{item.code}</Td>
                      <Td>{item.nitCi ?? "—"}</Td>
                      <Td>{new Date(item.fecha).toLocaleDateString("es-BO")}</Td>
                      <Td>{item.tipo}</Td>
                      <Td>{formatBs(item.total)}</Td>
                      <Td><EstadoBadge estado={item.estado} /></Td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </TableWrapper>
          </Card>
        </Column>

        {/* RIGHT */}
        <Column>
          {/* CHART */}
          <Card>
            <CardHeader>
              <CardTitle>
                <RedDot />
                Compras por mes
              </CardTitle>
            </CardHeader>

            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={ventasPorMes}>
                <XAxis dataKey="mes" axisLine={false} tickLine={false} />

                <YAxis axisLine={false} tickLine={false} />

                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#fb0404"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* MAPS */}
          <Card>
            <CardHeader>
              <CardTitle>
                <RedDot />
                Maps
              </CardTitle>
            </CardHeader>

            <Map />
          </Card>
        </Column>
      </Layout>

      {modalActividades && (
        <div
          onClick={() => setModalActividades(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            zIndex: 999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              borderRadius: "12px",
              width: "90%",
              maxWidth: "900px",
              maxHeight: "90vh",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "16px 20px",
              borderBottom: "1px solid #e5e7eb",
            }}>
              <span style={{ fontWeight: "600", fontSize: "15px" }}>
                Todas las actividades — {customer?.name}
              </span>
              <button
                onClick={() => setModalActividades(false)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "20px",
                  cursor: "pointer",
                  color: "#6b7280",
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ overflowY: "auto", padding: "16px" }}>
              <Table>
                <thead>
                  <tr>
                    <Th>Código</Th>
                    <Th>Fecha</Th>
                    <Th>Tipo</Th>
                    <Th>Vendedor</Th>
                    <Th>Sucursal</Th>
                    <Th>Monto</Th>
                    <Th>Estado</Th>
                  </tr>
                </thead>
                <tbody>
                  {actividades.map((item) => (
                    <tr
                      key={`modal-${item.tipo}-${item.id}`}
                      onClick={() => item.pdfUrl && handleViewPDF(item.pdfUrl)}
                      style={{ cursor: item.pdfUrl ? "pointer" : "default" }}
                    >
                      <Td>{item.code}</Td>
                      <Td>{new Date(item.fecha).toLocaleDateString("es-BO")}</Td>
                      <Td>{item.tipo}</Td>
                      <Td>{item.empleado ? `${item.empleado.name} ${item.empleado.lastName}` : "—"}</Td>
                      <Td>{item.sucursal ?? "—"}</Td>
                      <Td>{formatBs(item.total)}</Td>
                      <Td><EstadoBadge estado={item.estado} /></Td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
        </div>
      )}

      {pdfModal && (
        <div
          onClick={handleClosePdf}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#f5f5f5",
              borderRadius: "12px",
              width: "90%",
              maxWidth: "700px",
              maxHeight: "90vh",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              position: "relative",
            }}
          >
            {/* Header */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "16px 20px",
              borderBottom: "1px solid #e5e7eb",
              background: "#fff",
            }}>
              <span style={{ fontWeight: "600", fontSize: "15px" }}>
                Detalle del documento
              </span>
              <button
                onClick={handleClosePdf}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "20px",
                  cursor: "pointer",
                  color: "#6b7280",
                }}
              >
                ✕
              </button>
            </div>

            {/* PDF */}
            <div style={{
              overflowY: "auto",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}>
              {pdfBlobUrl && (
                <Document
                  file={pdfBlobUrl}
                  onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                  loading={<div>Cargando PDF...</div>}
                  error={<div>Error cargando PDF</div>}
                >
                  {Array.from(new Array(numPages), (_, i) => (
                    <Page
                      key={`page_${i + 1}`}
                      pageNumber={i + 1}
                      width={600}
                      renderTextLayer
                      renderAnnotationLayer
                    />
                  ))}
                </Document>
              )}
            </div>
          </div>
        </div>
      )}
    </Wrapper>
  );
}
