// CartStyles.js
import styled from "styled-components";

/* ─── tokens que coinciden con Topbar/Sidebar ─────────────────────────── */
const bg = "#f7f7f3"; // igual que TopbarWrapper background
const white = "#ffffff";
const red = "#fb0404"; // igual que BrandText / NavItem $active
const border = "#eeeeee"; // igual que SidebarWrapper border-right
const textPrimary = "#0f172a";
const textSecondary = "#64748b";
const textMuted = "#94a3b8";

/* ─── layout raíz ────────────────────────────────────────────────────── */
export const Wrapper = styled.div`
  min-height: 100dvh;
  background: ${bg};
  padding: 28px 32px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

/* ─── cabecera (título + fecha) ───────────────────────────────────────── */
export const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
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

/* ─── barra de búsqueda (igual estilo que SearchBox del Topbar) ────────── */
export const SearchBar = styled.div`
  width: 320px;
  height: 42px;
  padding: 0 16px;
  border-radius: 22px;
  background: ${white};
  color: ${textMuted};
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
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  min-height: 420px;
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

  &:hover {
    background: #f1f5f9;
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

  &:focus {
    border-color: ${border};
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
`;

export const PaymentTitle = styled.h3`
  margin: 0;
  font-size: 15px;
  font-weight: 700;
  color: ${textPrimary};
`;

export const RadioGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const RadioOption = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: ${textPrimary};
  cursor: pointer;

  input {
    accent-color: ${red};
    width: 16px;
    height: 16px;
    cursor: pointer;
  }
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
  background: ${red};
  color: ${white};
  padding: 13px;
  border-radius: 30px;
  border: none;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.15s;

  &:hover {
    opacity: 0.88;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

/* ─── backward-compat aliases (por si algún componente aún los usa) ──── */
export const BackButton = styled.button`
  display: none;
`;
export const ProductList = styled.div`
  display: none;
`;
export const ProductCard = styled.div`
  display: none;
`;
export const ProductImage = styled.img`
  display: none;
`;
export const Footer = SummaryPanel;
export const Total = SummaryTotal;
