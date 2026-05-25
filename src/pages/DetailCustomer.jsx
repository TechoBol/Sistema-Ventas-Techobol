import { useState, useEffect, useRef } from "react";
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
        actualizarNota,  // ← estaba faltando
        eliminarNota,    // ← estaba faltando
        guardandoNota,
    } = useDetailCustomer(id);

    const [nota, setNota] = useState("");
    const debounceRef = useRef(null);
    const inicializado = useRef(false);  // ← evita sobreescribir mientras el user escribe

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
                                    <Avatar
                                        src={`https://api.dicebear.com/9.x/fun-emoji/svg?seed=${customer.id}&backgroundColor=ffdfbf,ffd5dc,d1d4f9,c0aede,b6e3f4`}
                                        alt={customer.name}
                                    />
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

                        <NotesInput
                            value={nota}
                            onChange={handleNotaChange}
                            placeholder="Escribe una nota..."
                        />
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