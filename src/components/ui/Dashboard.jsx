import styled from "styled-components";
import { theme } from "./Theme";

export const PAGO_COLORS = ["#c0392b", "#e67e22", "#7f8c8d"];

export const ACCENT = "#c0392b";

// ── Estilos ────────────────────────────────────────────────────────────────

export const styles = {
  wrapper: {
    padding: 20,
    fontFamily: "'Outfit', 'Helvetica Neue', sans-serif",
  },

  loading: {
    background: "#ffffff",
    borderRadius: 16,
    padding: 20,
    color: "#000000",
    fontFamily: "'Outfit', 'Helvetica Neue', sans-serif",
  },

  kpiRow: {
    display: "flex",
    gap: 12,
    marginBottom: 12,
  },

  chartsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3,1fr)",
    gap: 12,
    marginBottom: 12,
  },

  rankingsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3,1fr)",
    gap: 12,
  },

  // KpiCard
  kpiCard: {
    base: {
      borderRadius: 12,
      padding: "16px 20px",
      flex: 1,
    },
    variants: {
      red: { background: "#c0392b" },
      dark: { background: "#232323" },
      pink: { background: "#fde8e8", border: "1px solid #f5c6c6" },
      dark2: { background: "#2a2a2a" },
    },
    label: (isPink) => ({
      fontSize: 12,
      color: isPink ? "#c0392b" : "rgba(255,255,255,0.6)",
      marginBottom: 6,
    }),
    value: (isPink) => ({
      fontSize: 28,
      fontWeight: 600,
      color: isPink ? "#c0392b" : "#fff",
      lineHeight: 1.1,
    }),
    sub: (isPink) => ({
      fontSize: 12,
      marginTop: 4,
      color: isPink ? "#c0392b" : "rgba(255,255,255,0.4)",
      opacity: isPink ? 0.8 : 1,
    }),
  },

  // Card
  card: {
    container: {
      background: "#242424",
      borderRadius: 12,
      padding: 16,
      overflow: "hidden",
    },
    title: {
      fontSize: 13,
      fontWeight: 500,
      color: "rgba(255,255,255,0.85)",
      marginBottom: 14,
      display: "flex",
      alignItems: "center",
      gap: 6,
    },
    titleDot: {
      width: 10,
      height: 10,
      borderRadius: 2,
      background: "#c0392b",
      display: "flex",
    },
  },

  // RankingRow
  rankingRow: {
    container: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      marginBottom: 10,
    },
    index: {
      fontSize: 12,
      color: "rgba(255,255,255,0.35)",
      width: 12,
    },
    inner: {
      flex: 1,
      minWidth: 0,
    },
    nameRow: {
      display: "flex",
      justifyContent: "space-between",
    },
    name: {
      fontSize: 13,
      color: "#fff",
    },
    valor: {
      fontSize: 12,
      color: "rgba(255,255,255,0.55)",
    },
    barTrack: {
      height: 3,
      background: "rgba(255,255,255,0.08)",
      borderRadius: 2,
      marginTop: 4,
    },
    barFill: (pct) => ({
      height: 3,
      background: "#c0392b",
      borderRadius: 2,
      width: `${pct}%`,
    }),
  },

  // Tooltip
  tooltip: {
    container: {
      background: "#1a1a1a",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: 8,
      padding: "8px 12px",
      fontSize: 12,
      color: "#fff",
    },
    label: {
      color: "rgba(255,255,255,0.5)",
      marginBottom: 2,
    },
    value: {
      fontWeight: 600,
    },
  },

  pagoLegend: {
    container: {
      display: "flex",
      gap: 16,
      alignItems: "center",
      justifyContent: "center", 
      paddingInline: 16,
      width: "100%",
    },
    list: {
      display: "flex",
      flexDirection: "column",
      gap: 10,
      flex: 1,
    },
    row: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 16,
    },
    label: {
      display: "flex",
      alignItems: "center",
      gap: 6,
      fontSize: 12,
      color: "rgba(255,255,255,0.7)",
    },
    dot: (color) => ({
      width: 10,
      height: 10,
      borderRadius: 2,
      background: color,
      display: "inline-block",
      flexShrink: 0,     
    }),
    amount: {
      fontSize: 12,
      color: "rgba(255,255,255,0.5)",
      whiteSpace: "nowrap",
    },
  },

  // Ejes de recharts
  axis: {
    tick: (fontSize = 11) => ({ fill: "rgba(255,255,255,0.35)", fontSize }),
  },
};