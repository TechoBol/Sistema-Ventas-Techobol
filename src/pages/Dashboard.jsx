import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import { useDashboard } from "../hooks/useDashboard";

const PAGO_COLORS = ["#c0392b", "#e67e22", "#7f8c8d"];

// ── Helpers ────────────────────────────────────────────────────────────────

const bs = (n) =>
  "Bs " +
  Number(n || 0).toLocaleString("es-BO", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

function formatFecha(iso) {
  return new Date(iso).toLocaleDateString("es-BO", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

// ── Subcomponentes ────────────────────────────────────────────────────────

function KpiCard({ variant, label, value, sub }) {
  const bg = {
    red: { background: "#c0392b" },
    dark: { background: "#232323" },
    pink: { background: "#fde8e8", border: "1px solid #f5c6c6" },
    dark2: { background: "#2a2a2a" },
  };

  const isPink = variant === "pink";

  return (
    <div
      style={{
        borderRadius: 12,
        padding: "16px 20px",
        flex: 1,
        ...bg[variant],
      }}
    >
      <p
        style={{
          fontSize: 12,
          color: isPink ? "#c0392b" : "rgba(255,255,255,0.6)",
          marginBottom: 6,
        }}
      >
        {label}
      </p>

      <p
        style={{
          fontSize: 28,
          fontWeight: 600,
          color: isPink ? "#c0392b" : "#fff",
          lineHeight: 1.1,
        }}
      >
        {value}
      </p>

      <p
        style={{
          fontSize: 12,
          marginTop: 4,
          color: isPink ? "#c0392b" : "rgba(255,255,255,0.4)",
          opacity: isPink ? 0.8 : 1,
        }}
      >
        {sub}
      </p>
    </div>
  );
}

function Card({ title, children }) {
  return (
    <div style={{ background: "#242424", borderRadius: 12, padding: 16, overflow: "hidden" }}>
      <p
        style={{
          fontSize: 13,
          fontWeight: 500,
          color: "rgba(255,255,255,0.85)",
          marginBottom: 14,
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <span
          style={{
            width: 10,
            height: 10,
            borderRadius: 2,
            background: "#c0392b",
            display: "flex",
          }}
        />
        {title}
      </p>
      {children}
    </div>
  );
}

function RankingRow({ index, nombre, valor, rawValue, max }) {
  const pct = max > 0 ? Math.round((rawValue / max) * 100) : 0;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
      <span style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", width: 12 }}>
        {index}
      </span>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: 13, color: "#fff" }}>{nombre}</span>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.55)" }}>{valor}</span>
        </div>

        <div style={{ height: 3, background: "rgba(255,255,255,0.08)", borderRadius: 2, marginTop: 4 }}>
          <div style={{ height: 3, background: "#c0392b", borderRadius: 2, width: `${pct}%` }} />
        </div>
      </div>
    </div>
  );
}

function CustomTooltip({ active, payload, label, format }) {
  if (!active || !payload?.length) return null;

  return (
    <div
      style={{
        background: "#1a1a1a",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 8,
        padding: "8px 12px",
        fontSize: 12,
        color: "#fff",
      }}
    >
      <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: 2 }}>{label}</p>
      <p style={{ fontWeight: 600 }}>{format(payload[0].value)}</p>
    </div>
  );
}

// ── Componente principal ──────────────────────────────────────────────────

function Dashboard() {
  const { data, isLoading } = useDashboard();

  if (isLoading)
    return (
      <div
        style={{
          background: "#ffffff",
          borderRadius: 16,
          padding: 20,
          color: "#000000",
          fontFamily: "'Outfit', 'Helvetica Neue', sans-serif",
        }}
      >
        Cargando dashboard...
      </div>
    );

  const {
    kpis,
    ventas_semana,
    tipo_pago,
    hora_pico,
    productos_top,
    sucursales_top,
    clientes_top,
  } = data;

  return (
    <div
      style={{
        padding: 20,
        fontFamily: "'Outfit', 'Helvetica Neue', sans-serif",
      }}
    >
      {/* KPIs */}
      <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
        <KpiCard
          variant="red"
          label="Venta del día"
          value={bs(kpis.venta_dia)}
          sub={`Hoy, ${formatFecha(kpis.fecha_hoy)}`}
        />

        <KpiCard
          variant="dark"
          label="Ventas hoy"
          value={String(kpis.transacciones_hoy)}
          sub="Transacciones del día"
        />

        <KpiCard
          variant="pink"
          label="Monto histórico"
          value={bs(kpis.monto_historico)}
          sub="Desde el inicio"
        />

        <KpiCard
          variant="dark2"
          label="Ventas históricas"
          value={kpis.transacciones_historicas.toLocaleString("es-BO")}
          sub="Total de transacciones"
        />
      </div>

      {/* Gráficos */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 12,
          marginBottom: 12,
        }}
      >
        <Card title="Ventas últimos 5 días">
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={ventas_semana} barSize={28}>
              <XAxis
                dataKey="dia"
                tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis hide />
              <Tooltip
                content={<CustomTooltip format={(v) => bs(v)} />}
                cursor={{ fill: "rgba(255,255,255,0.04)" }}
              />
              <Bar dataKey="total" radius={[4, 4, 0, 0]}>
                {ventas_semana.map((_, i) => (
                  <Cell
                    key={i}
                    fill={i === ventas_semana.length - 1 ? "#c0392b" : "#3a3a3a"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Tipo de pago">
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <PieChart width={110} height={110}>
              <Pie
                data={tipo_pago}
                dataKey="total"
                cx={50}
                cy={50}
                innerRadius={32}
                outerRadius={50}
                paddingAngle={2}
                stroke="none"
              >
                {tipo_pago.map((_, i) => (
                  <Cell key={i} fill={PAGO_COLORS[i]} />
                ))}
              </Pie>
            </PieChart>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {tipo_pago.map((p, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      fontSize: 12,
                      color: "rgba(255,255,255,0.7)",
                    }}
                  >
                    <span
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 2,
                        background: PAGO_COLORS[i],
                        display: "inline-block",
                      }}
                    />
                    {p.tipo}
                  </span>
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>
                    {bs(p.total)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card title="Hora pico de ventas">
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={hora_pico} barSize={18}>
              <XAxis
                dataKey="hora"
                tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis hide />
              <Tooltip
                content={<CustomTooltip format={(v) => `${v} ventas`} />}
                cursor={{ fill: "rgba(255,255,255,0.04)" }}
              />
              <Bar dataKey="ventas" radius={[3, 3, 0, 0]}>
                {hora_pico.map((e, i) => (
                  <Cell
                    key={i}
                    fill={
                      e.ventas >= 16 ? "#c0392b" : e.ventas >= 10 ? "#e57373" : "#5a3030"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Rankings */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
        <Card title="Productos más vendidos">
          {productos_top.map((p, i) => (
            <RankingRow
              key={i}
              index={i + 1}
              nombre={p.nombre}
              valor={`${p.cantidad} und`}
              rawValue={p.cantidad}
              max={productos_top[0].cantidad}
            />
          ))}
        </Card>

        <Card title="Sucursales con más ventas">
          {sucursales_top.map((s, i) => (
            <RankingRow
              key={i}
              index={i + 1}
              nombre={s.nombre}
              valor={bs(s.total)}
              rawValue={s.total}
              max={sucursales_top[0].total}
            />
          ))}
        </Card>

        <Card title="Clientes con más compras">
          {clientes_top.map((c, i) => (
            <RankingRow
              key={i}
              index={i + 1}
              nombre={c.nombre}
              valor={bs(c.total)}
              rawValue={c.total}
              max={clientes_top[0].total}
            />
          ))}
        </Card>
      </div>
    </div>
  );
}

export default Dashboard;