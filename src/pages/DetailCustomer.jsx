// src/pages/DetailCustomer.jsx

import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useDetailCustomer } from "../hooks/useDetailCustomer";

import {
  Wrapper, Header, BackButton, Title, Layout, Column, Card,
  CardHeader, CardTitle, RedDot, ClientTop, Avatar, ClientName,
  ClientSubtext, Section, SectionTitle, InfoList, InfoRow,
  InfoLabel, InfoValue, StatsGrid, StatCard, StatValue, StatLabel,
  DashboardBottom, ActivityList, ActivityItem, ActivityLeft,
  ActivityDate, NotesInput, TableWrapper, Table, Th, Td,
} from "../components/ui/DetailCustomer";

const formatBs = (n) =>
  `Bs. ${Number(n).toLocaleString("es-BO", { minimumFractionDigits: 2 })}`;

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
    crearNota,
    guardandoNota,
  } = useDetailCustomer(id);

  const [nota, setNota] = useState("");
  const [notaGuardada, setNotaGuardada] = useState(false);

  const handleGuardarNota = async () => {
    if (!nota.trim()) return;
    await crearNota(nota);
    setNota("");
    setNotaGuardada(true);
    setTimeout(() => setNotaGuardada(false), 2000);
  };

  if (error) {
    return <Wrapper><h2>{error}</h2></Wrapper>;
  }

  const direccionPrincipal = customer?.addresses?.find((a) => a.isPrimary)
    ?? customer?.addresses?.[0];

  return (
    <Wrapper>
      <Header>
        <BackButton onClick={() => navigate(-1)}>‹</BackButton>
        <Title>Cliente</Title>
      </Header>

      <Layout>
        {/* LEFT */}
        <Column>
          <Card>
            <CardHeader>
              <CardTitle><RedDot />Cliente</CardTitle>
            </CardHeader>

            {!loading && customer && (
              <>
                <ClientTop>
                  <Avatar>😊</Avatar>
                  <div>
                    <ClientName>{customer.name}</ClientName>
                    <ClientSubtext>
                      {customer.occupation ?? "—"} • {new Date(customer.createdAt).toLocaleDateString("es-BO")}
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
                      <InfoValue>{direccionPrincipal?.address ?? "—"}</InfoValue>
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
                      <InfoValue>{customer.favoritePaymentMethod ?? "—"}</InfoValue>
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
              <CardTitle><RedDot />Notas</CardTitle>
            </CardHeader>

            {/* Notas existentes */}
            {customer?.notes?.length > 0 && (
              <Section>
                {customer.notes.map((n) => (
                  <div
                    key={n.id}
                    style={{
                      fontSize: 13,
                      padding: "10px 14px",
                      background: "#fff5f5",
                      borderRadius: 10,
                      marginBottom: 8,
                      color: "#333",
                    }}
                  >
                    <div>{n.content}</div>
                    <div style={{ fontSize: 11, color: "#aaa", marginTop: 4 }}>
                      {new Date(n.createdAt).toLocaleDateString("es-BO")}
                    </div>
                  </div>
                ))}
              </Section>
            )}

            <NotesInput
              value={nota}
              onChange={(e) => setNota(e.target.value)}
              placeholder="Escribe una nota..."
            />

            <button
              onClick={handleGuardarNota}
              disabled={guardandoNota || !nota.trim()}
              style={{
                marginTop: 14,
                height: 44,
                width: "100%",
                borderRadius: 14,
                border: "none",
                background: notaGuardada ? "#69d584" : "#fb0404",
                color: "white",
                fontWeight: 700,
                cursor: "pointer",
                opacity: !nota.trim() ? 0.6 : 1,
              }}
            >
              {notaGuardada ? "✓ Guardado" : guardandoNota ? "Guardando..." : "Guardar"}
            </button>
          </Card>
        </Column>

        {/* RIGHT */}
        <Column>
          <Card>
            <CardHeader>
              <CardTitle><RedDot />Dashboard</CardTitle>
            </CardHeader>

            {!loading && customer && (
              <>
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

                <DashboardBottom>
                  <div>
                    <div style={{ fontWeight: 700, marginBottom: 14, fontSize: 14 }}>
                      Compras por mes
                    </div>
                    <ResponsiveContainer width="100%" height={240}>
                      <LineChart data={ventasPorMes}>
                        <XAxis dataKey="mes" axisLine={false} tickLine={false} />
                        <YAxis axisLine={false} tickLine={false} />
                        <Tooltip />
                        <Line type="monotone" dataKey="total" stroke="#fb0404" strokeWidth={3} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div>
                    <div style={{ fontWeight: 700, marginBottom: 14, fontSize: 14 }}>
                      Actividades
                    </div>
                    <ActivityList>
                      {customer.activities.slice(0, 5).map((act) => (
                        <ActivityItem key={act.id}>
                          <ActivityLeft>
                            <span>📋</span>
                            <span>{act.description}</span>
                          </ActivityLeft>
                          <ActivityDate>
                            {new Date(act.createdAt).toLocaleDateString("es-BO")}
                          </ActivityDate>
                        </ActivityItem>
                      ))}
                    </ActivityList>
                  </div>
                </DashboardBottom>
              </>
            )}
          </Card>

          {/* COMPRAS */}
          <Card>
            <CardHeader>
              <CardTitle><RedDot />Compras</CardTitle>
            </CardHeader>

            <TableWrapper>
              <Table>
                <thead>
                  <tr>
                    <Th>ID</Th>
                    <Th>Vendedor</Th>
                    <Th>Sucursal</Th>
                    <Th>Total</Th>
                    <Th>Fecha</Th>
                  </tr>
                </thead>
                <tbody>
                  {customer?.sales?.map((s) => (
                    <tr key={s.id}>
                      <Td>#{s.id}</Td>
                      <Td>{s.employee ? `${s.employee.name} ${s.employee.lastName}` : "—"}</Td>
                      <Td>{s.location?.name ?? "—"}</Td>
                      <Td>{formatBs(s.total)}</Td>
                      <Td>{new Date(s.date).toLocaleDateString("es-BO")}</Td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </TableWrapper>
          </Card>
        </Column>
      </Layout>
    </Wrapper>
  );
}