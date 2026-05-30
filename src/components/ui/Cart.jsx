import styled from "styled-components";

/* ─── tokens que coinciden con Topbar/Sidebar ─────────────────────────── */
const bg = "#f7f7f3";
const white = "#ffffff";
const red = "#c0392b";
const border = "#eeeeee";
const textPrimary = "#0f172a";
const textSecondary = "#64748b";
const textMuted = "#94a3b8";

/* ─── Contenedor Shell Multi-modo ────────────────────────────────────── */
// Este cascarón inyecta dinámicamente los colores de ambiente según el modo activo
export const ModeShell = styled.div`
  width: 100%;
  
  /* modo VENTA */
  --mode-color: ${red};
  --mode-bg-hover: #fff0f0;

  /* modo COTIZACIÓN*/
  &.mode-cotizacion {
    --mode-color: #2563eb; 
    --mode-bg-hover: #eff6ff;
  }

  /* modo RESERVA */
  &.mode-reserva {
    --mode-color: #d97706; 
    --mode-bg-hover: #fffbeb;
  }
`;

/* ─── layout raíz ────────────────────────────────────────────────────── */
export const Wrapper = styled.div`
  min-height: 100dvh;
  padding: 20px 15px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 12px;
  }
`;

/* ─── cabecera (título + fecha) ───────────────────────────────────────── */
export const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 16px;
`;

export const ModeTitleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const SegmentedControl = styled.div`
  display: flex;
  background: #f1f5f9;
  border-radius: 10px;
  padding: 3px;
  gap: 2px;
`;

export const SegBtn = styled.button`
  padding: 7px 18px;
  font-size: 14px;
  font-weight: 500;
  border: none;
  border-radius: 7px;
  cursor: pointer;
  background: transparent;
  color: ${textSecondary};
  transition: all 0.18s cubic-bezier(0.4, 0, 0.2, 1);
  user-select: none;

  &.active {
    background: ${white};
    color: var(--mode-color);
    font-weight: 600;
    box-shadow: 0 1px 3px rgba(0,0,0,0.08);
  }

  &:not(.active):hover {
    color: ${textPrimary};
    background: rgba(255,255,255,0.5);
  }
`;

export const Title = styled.h1`
  font-size: 26px;
  font-weight: 700;
  color: ${textPrimary};
  margin: 0;
`;

export const Subtitle = styled.p`
  font-size: 13px;
  color: ${textSecondary};
  margin: 0;
`;

/* ─── barra de búsqueda ───────────────────────────────────────────────── */
export const SearchBar = styled.div`
  width: 320px;
  height: 42px;
  padding: 0 16px;
  border-radius: 22px;
  background: ${white};
  color: ${textMuted};
  border: 1px solid rgba(148, 163, 184, 0.28);
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;

  @media (max-width: 600px) {
    width: 100%;
  }
`;

export const SearchInput = styled.input`
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
  font-size: 14px;
  color: ${textPrimary};

  &::placeholder {
    color: ${textMuted};
  }
`;

/* ─── zona principal: tabla + panel ──────────────────────────────────── */
export const Body = styled.div`
  display: flex;
  gap: 24px;
  align-items: flex-start;
  flex: 1;

  @media (max-width: 900px) {
    flex-direction: column;
  }
`;

/* ─── contenedor de la tabla ─────────────────────────────────────────── */
export const TableCard = styled.div`
  flex: 1;
  background: ${white};
  border-radius: 16px;
  overflow-x: auto;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  min-height: 420px;
  width: 100%;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const THead = styled.thead`
  border-bottom: 1px solid ${border};
`;

export const TH = styled.th`
  padding: 14px 16px;
  font-size: 13px;
  font-weight: 600;
  color: ${textSecondary};
  text-align: left;
  white-space: nowrap;

  &:last-child {
    text-align: right;
  }
`;

export const TBody = styled.tbody``;

export const TR = styled.tr`
  border-bottom: 1px solid ${border};

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: #fafafa;
  }
`;

export const TD = styled.td`
  padding: 12px 16px;
  font-size: 14px;
  color: ${textPrimary};
  vertical-align: middle;
  white-space: nowrap;

  &:last-child {
    text-align: right;
    font-weight: 600;
  }
`;

/* cantidad con controles +/- */
export const QuantityControls = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const QtyButton = styled.button`
  width: 26px;
  height: 26px;
  border: 1px solid ${border};
  border-radius: 6px;
  background: ${white};
  color: ${textPrimary};
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  line-height: 1;
  transition: all 0.1s ease;

  &:hover {
    background: #f1f5f9;
    border-color: var(--mode-color);
    color: var(--mode-color);
  }

  &:active {
    transform: scale(0.92);
  }
`;

export const QtyValue = styled.span`
  font-size: 14px;
  font-weight: 600;
  min-width: 20px;
  text-align: center;
`;

/* input de descuento dentro de celda */
export const DiscountInput = styled.input`
  width: 70px;
  border: 1px solid transparent;
  border-radius: 8px;
  padding: 4px 8px;
  font-size: 14px;
  color: ${textPrimary};
  background: transparent;
  text-align: right;
  outline: none;
  transition: all 0.15s ease;

  &:focus {
    border-color: var(--mode-color);
    background: ${white};
  }

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  &[type="number"] {
    -moz-appearance: textfield;
  }
`;

export const DeleteButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  color: ${textMuted};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: 6px;
  transition: all 0.12s ease;

  &:hover {
    color: ${red};
    background: #fff0f0;
  }

  &:active {
    transform: scale(0.9);
  }
`;

/* mensaje cuando el carrito está vacío */
export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: ${textMuted};
  font-size: 14px;
  gap: 8px;
`;

/* ─── Nuevo selector táctil de pagos (Tarjetas UI) ───────────────────── */
export const PaymentPanel = styled.div`
  width: 260px;
  background: ${white};
  border-radius: 16px;
  padding: 20px 24px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;

  @media (max-width: 900px) {
    width: 100%;
    box-sizing: border-box;
  }

  .payment-grid-cards {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .payment-tile-card {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 14px;
    border: 1px solid ${border};
    border-radius: 10px;
    cursor: pointer;
    background: ${white};
    transition: all 0.15s ease;
    
    span {
      font-size: 13px;
      font-weight: 500;
      color: ${textSecondary};
    }

    .tile-icon {
      color: ${textMuted};
      display: flex;
      align-items: center;
      transition: color 0.15s ease;
    }

    &:hover {
      background: #fafafa;
      border-color: ${textMuted};
    }

    &.active {
      background: var(--mode-bg-hover);
      border-color: var(--mode-color);
      
      span {
        color: var(--mode-color);
        font-weight: 600;
      }
      
      .tile-icon {
        color: var(--mode-color);
      }
    }
  }
`;

export const PaymentTitle = styled.h3`
  margin: 0;
  font-size: 15px;
  font-weight: 700;
  color: ${textPrimary};
`;

/* ─── panel de resumen (derecha) ─────────────────────────────────────── */
export const SummaryPanel = styled.div`
  width: 260px;
  background: ${white};
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;

  @media (max-width: 900px) {
    width: 100%;
    box-sizing: border-box;
  }
`;

export const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: ${textSecondary};
`;

export const SummaryTotal = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 16px;
  font-weight: 700;
  color: ${textPrimary};
  margin-top: 6px;
  padding-top: 10px;
  border-top: 1px solid ${border};
`;

export const CheckoutButton = styled.button`
  width: 100%;
  margin-top: 12px;
  background: var(--mode-color); /* Cambia de color dinámicamente según el modo */
  color: ${white};
  padding: 13px;
  border-radius: 30px;
  border: none;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

/* ─── Dropdown del search ──── */
export const ProductDropdown = styled.div`
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  width: 450px;
  max-height: 320px;
  overflow-y: auto;
  background: #ffffff;
  border-radius: 14px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  z-index: 100;
  padding: 6px 0;

  @media (max-width: 600px) {
    width: 100vw;
    left: -16px;
  }
`;

export const DropItem = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 16px;
  cursor: pointer;
  transition: background 0.12s;

  &:hover {
    background: var(--mode-bg-hover); /* Cambia sutilmente según el modo activo */
  }
`;

export const DropCode = styled.span`
  width: 80px;
  flex-shrink: 0;
  font-size: 12px;
  color: #94a3b8;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export const DropName = styled.span`
  width: 180px;
  flex-shrink: 0;
  font-size: 14px;
  font-weight: 500;
  color: #0f172a;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const DropCantidad = styled.span`
  width: 60px;
  flex-shrink: 0;
  text-align: left;
  font-size: 14px;
  font-weight: 600;
  color: #0f172a;
`;

export const DropPrice = styled.span`
  width: 80px;
  flex-shrink: 0;
  text-align: left;
  font-size: 14px;
  font-weight: 600;
  color: var(--mode-color); /* Muestra el color de acento del modo correspondiente */
`;

export const DropHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 16px;
  border-bottom: 1px solid #e2e8f0;
  background: #f8fafc;
  position: sticky;
  top: 0;
  z-index: 2;
`;

export const DropHeaderCode = styled.span`
  width: 80px;
  flex-shrink: 0;
  font-size: 12px;
  font-weight: 700;
  color: #64748b;
`;

export const DropHeaderName = styled.span`
  width: 180px;
  flex-shrink: 0;
  font-size: 12px;
  font-weight: 700;
  color: #64748b;
`;

export const DropHeaderQty = styled.span`
  width: 60px;
  flex-shrink: 0;
  text-align: left;
  font-size: 12px;
  font-weight: 700;
  color: #64748b;
`;

export const DropHeaderPrice = styled.span`
  width: 80px;
  flex-shrink: 0;
  text-align: left;
  font-size: 12px;
  font-weight: 700;
  color: #64748b;
`;

export const CustomerEmpty = styled.div`
  padding: 20px;
  text-align: center;
  font-size: 14px;
  font-weight: 600;
  color: #94a3b8;
`;

/* ─── backward-compat aliases ────────────────────────────────────────── */
export const BackButton = styled.button` display: none; `;
export const ProductList = styled.div` display: none; `;
export const ProductCard = styled.div` display: none; `;
export const ProductImage = styled.img` display: none; `;
export const Footer = SummaryPanel;
export const Total = SummaryTotal;