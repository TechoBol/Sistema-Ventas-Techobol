import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";

import { useDashboard } from "../hooks/useDashboard";
import { styles, PAGO_COLORS } from "../components/ui/Dashboard";

// ── Helpers ────────────────────────────────────────────────────────────────
const mesActual = new Date().toLocaleDateString("es-BO", { month: "long" });
const mesCap = mesActual.charAt(0).toUpperCase() + mesActual.slice(1);

const bs = (n) =>
  "Bs " +
  Number(n || 0).toLocaleString("es-BO", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const formatFecha = (iso) =>
  new Date(iso).toLocaleDateString("es-BO", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

// ── Subcomponentes ─────────────────────────────────────────────────────────

function KpiCard({ variant, label, value, sub }) {
  const isPink = variant === "pink";
  return (
    <div style={{ ...styles.kpiCard.base, ...styles.kpiCard.variants[variant] }}>
      <p style={styles.kpiCard.label(isPink)}>{label}</p>
      <p style={styles.kpiCard.value(isPink)}>{value}</p>
      <p style={styles.kpiCard.sub(isPink)}>{sub}</p>
    </div>
  );
}

function Card({ title, children }) {
  return (
    <div style={styles.card.container}>
      <p style={styles.card.title}>
        <span style={styles.card.titleDot} />
        {title}
      </p>
      {children}
    </div>
  );
}

function RankingRow({ index, nombre, valor, rawValue, max }) {
  const pct = max > 0 ? Math.round((rawValue / max) * 100) : 0;
  return (
    <div style={styles.rankingRow.container}>
      <span style={styles.rankingRow.index}>{index}</span>
      <div style={styles.rankingRow.inner}>
        <div style={styles.rankingRow.nameRow}>
          <span style={styles.rankingRow.name}>{nombre}</span>
          <span style={styles.rankingRow.valor}>{valor}</span>
        </div>
        <div style={styles.rankingRow.barTrack}>
          <div style={styles.rankingRow.barFill(pct)} />
        </div>
      </div>
    </div>
  );
}

function CustomTooltip({ active, payload, label, format }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={styles.tooltip.container}>
      <p style={styles.tooltip.label}>{label}</p>
      <p style={styles.tooltip.value}>{format(payload[0].value)}</p>
    </div>
  );
}

// ── Componente principal ───────────────────────────────────────────────────

function Dashboard() {
  const { data, isLoading } = useDashboard();

  if (isLoading)
    return <div style={styles.loading}>Cargando dashboard...</div>;

  const { kpis, ventas_semana, tipo_pago, hora_pico, productos_top, sucursales_top, clientes_top } = data;

  return (
    <div style={styles.wrapper}>

      {/* KPIs */}
      <div style={styles.kpiRow}>
        <KpiCard variant="red" label="Venta del día" value={bs(kpis.venta_dia)} sub={`Hoy, ${formatFecha(kpis.fecha_hoy)}`} />
        <KpiCard variant="dark" label="Ventas hoy" value={String(kpis.transacciones_hoy)} sub="Transacciones del día" />
        <KpiCard variant="pink" label={`Monto histórico de ${mesCap}`} value={bs(kpis.monto_historico)} sub="Desde el inicio de mes" />
        <KpiCard variant="dark2" label={`Ventas ${mesCap}`} value={kpis.transacciones_historicas.toLocaleString("es-BO")} sub="Total de transacciones del mes" />
      </div>

      {/* Gráficos */}
      <div style={styles.chartsGrid}>

        <Card title="Ventas últimos 5 días">
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={ventas_semana} barSize={28}>
              <XAxis dataKey="dia" tick={styles.axis.tick(11)} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip content={<CustomTooltip format={(v) => bs(v)} />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
              <Bar dataKey="total" radius={[4, 4, 0, 0]}>
                {ventas_semana.map((_, i) => (
                  <Cell key={i} fill={i === ventas_semana.length - 1 ? "#c0392b" : "#3a3a3a"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Tipo de pago">
          <div style={styles.pagoLegend.container}>
            <PieChart width={130} height={130}>
              <Pie data={tipo_pago} dataKey="total" cx={60} cy={60} innerRadius={38} outerRadius={58} paddingAngle={2} stroke="none">
                {tipo_pago.map((_, i) => <Cell key={i} fill={PAGO_COLORS[i]} />)}
              </Pie>
            </PieChart>
            <div style={styles.pagoLegend.list}>
              {tipo_pago.map((p, i) => (
                <div key={i} style={styles.pagoLegend.row}>
                  <span style={styles.pagoLegend.label}>
                    <span style={styles.pagoLegend.dot(PAGO_COLORS[i])} />
                    {p.tipo}
                  </span>
                  <span style={styles.pagoLegend.amount}>{bs(p.total)}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card title="Hora pico de ventas">
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={hora_pico} barSize={18}>
              <XAxis dataKey="hora" tick={styles.axis.tick(10)} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip content={<CustomTooltip format={(v) => `${v} ventas`} />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
              <Bar dataKey="ventas" radius={[3, 3, 0, 0]}>
                {hora_pico.map((e, i) => (
                  <Cell key={i} fill={e.ventas >= 16 ? "#c0392b" : e.ventas >= 10 ? "#e57373" : "#5a3030"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

      </div>

      {/* Rankings */}
      <div style={styles.rankingsGrid}>
        <Card title="Productos más vendidos">
          {productos_top.map((p, i) => (
            <RankingRow key={i} index={i + 1} nombre={p.nombre} valor={`${p.cantidad} und`}
              rawValue={p.cantidad} max={productos_top[0]?.cantidad ?? 0} />
          ))}
        </Card>
        <Card title="Sucursales con más ventas">
          {sucursales_top.map((s, i) => (
            <RankingRow key={i} index={i + 1} nombre={s.nombre} valor={bs(s.total)}
              rawValue={s.total} max={sucursales_top[0]?.total ?? 0} />
          ))}
        </Card>
        <Card title="Clientes con más compras">
          {clientes_top.map((c, i) => (
            <RankingRow key={i} index={i + 1} nombre={c.nombre} valor={bs(c.total)}
              rawValue={c.total} max={clientes_top[0]?.total ?? 0} />
          ))}
        </Card>
      </div>

    </div>
  );
}

export default Dashboard;