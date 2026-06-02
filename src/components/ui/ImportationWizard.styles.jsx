import styled from "styled-components";
import { theme } from "./Theme";

export const WizardCard = styled.section`
  width: 100%;
  background: ${theme.colors.background};
  border-radius: 28px;
  padding: 34px 38px;
  box-sizing: border-box;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);

  @media (max-width: 700px) {
    padding: 24px 18px;
    border-radius: 22px;
  }
`;

export const WizardHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  margin-bottom: 20px;
`;

export const WizardHeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

export const WizardBackButton = styled.button`
  width: 38px;
  height: 38px;
  border: none;
  border-radius: 12px;
  background: ${theme.colors.surface};
  color: ${theme.colors.text};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  transition:
    background 0.18s ease,
    transform 0.18s ease;

  &:hover {
    background: #eef2f7;
    transform: translateY(-1px);
  }

  &:active {
    transform: scale(0.96);
  }
`;

export const WizardTitle = styled.h2`
  margin: 0;
  font-size: 26px;
  font-weight: 700;
  letter-spacing: -0.03em;
  color: ${theme.colors.text};

  @media (max-width: 700px) {
    font-size: 28px;
  }
`;

export const StepperWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-start;
  margin-bottom: 20px;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 4px 0 10px;
  scrollbar-width: thin;
  scrollbar-color: rgba(148, 163, 184, 0.35) transparent;

  &::-webkit-scrollbar {
    height: 5px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(148, 163, 184, 0.35);
    border-radius: 999px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba(148, 163, 184, 0.55);
  }
`;

export const StepItem = styled.div`
  min-width: 150px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;

  flex-shrink: 0;
`;

export const StepCircle = styled.button`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 2px solid
    ${({ $active, $completed }) =>
      $active || $completed ? theme.colors.primary : "#d9e1ea"};
  background: ${({ $active, $completed }) =>
    $active || $completed ? theme.colors.primary : "#edf2f7"};
  color: ${({ $active, $completed }) =>
    $active || $completed ? "#ffffff" : "#8c99ad"};
  font-size: 15px;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  box-shadow: ${({ $active }) =>
    $active ? "0 10px 22px rgba(242, 12, 31, 0.18)" : "none"};

  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease,
    background 0.18s ease,
    border-color 0.18s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 10px 22px rgba(242, 12, 31, 0.14);
  }

  &:active {
    transform: scale(0.96);
  }
`;

export const StepLabel = styled.span`
  font-size: 13px;
  font-weight: ${({ $active }) => ($active ? 700 : 600)};
  color: ${({ $active }) =>
    $active ? theme.colors.text : theme.colors.textSecondary};
  text-align: center;
  white-space: nowrap;
`;

export const StepConnector = styled.div`
  flex: 1;
  min-width: 90px;
  height: 2px;
  margin-top: 21px;
  background: ${({ $completed }) =>
    $completed ? theme.colors.primary : "#e5eaf1"};
  flex-shrink: 0;
`;

export const StepContent = styled.div`
  width: 100%;
`;

export const StepPanel = styled.section`
  width: 100%;
  background: #fcfcfd;
  border: 1px solid #eef0f3;
  border-radius: 22px;
  padding: 24px 26px;
  box-sizing: border-box;

  @media (max-width: 700px) {
    padding: 22px 18px;
  }
`;

// estilos de cabecera, titulo, boton
export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 12px;

  @media (max-width: 700px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const StepPanelTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: ${theme.colors.textPrimary};
`;

export const AddButton = styled.button`
  height: 38px;
  padding: 0 14px;
  border: none;
  border-radius: 12px;
  background: rgba(242, 12, 31, 0.08);
  color: ${theme.colors.primary};
  font-size: 13px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;

  cursor: pointer;

  &:hover {
    background: rgba(242, 12, 31, 0.12);
  }
`;

export const StepPreviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;

  @media (max-width: 980px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 680px) {
    grid-template-columns: 1fr;
  }
`;

export const StepPreviewCard = styled.div`
  min-height: 92px;
  background: ${theme.colors.background};
  border: 1px solid #eef0f3;
  border-radius: 18px;
  padding: 18px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 10px;

  strong {
    font-size: 16px;
    font-weight: 800;
    color: ${theme.colors.text};
  }

  span {
    font-size: 14px;
    line-height: 1.5;
    color: ${theme.colors.textSecondary};
  }
`;

export const StepActions = styled.div`
  margin-top: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  flex-wrap: wrap;

  @media (max-width: 700px) {
    flex-direction: column-reverse;
    align-items: stretch;
  }
`;

export const StepActionsRight = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  @media (max-width: 700px) {
    width: 100%;
    flex-direction: column;
    align-items: stretch;
  }
`;

export const StepSecondaryButton = styled.button`
  height: 46px;
  padding: 0 18px;
  border: none;
  border-radius: 14px;
  background: #f4f6f9;
  color: ${theme.colors.text};
  font-size: 14px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;

  transition:
    background 0.18s ease,
    transform 0.18s ease;

  &:hover {
    background: #e9eef4;
    transform: translateY(-1px);
  }

  &:active {
    transform: scale(0.98);
  }
`;

export const StepPrimaryButton = styled.button`
  height: 46px;
  padding: 0 20px;
  border: none;
  border-radius: 14px;
  background: ${theme.colors.primary};
  color: #ffffff;
  font-size: 14px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  box-shadow: 0 10px 22px rgba(242, 12, 31, 0.18);
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 14px 28px rgba(242, 12, 31, 0.24);
  }

  &:active {
    transform: scale(0.98);
  }
`;

/* ESTILOS DEL CONTENIDO DE LOS PASOS */
export const WizardFormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 22px 24px;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

export const WizardField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 9px;
`;

export const WizardLabel = styled.label`
  font-size: 15px;
  font-weight: 700;
  color: #334155;
`;

export const WizardInput = styled.input`
  width: 100%;
  height: 40px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 0 15px;
  box-sizing: border-box;
  background: ${theme.colors.background};
  color: ${theme.colors.text};
  font-size: 14px;
  outline: none;
  transition:
    border-color 0.18s ease,
    box-shadow 0.18s ease;

  &::placeholder {
    color: ${theme.colors.textMuted || "#94a3b8"};
  }

  &:focus {
    border-color: #cbd5e1;
    box-shadow: 0 0 0 4px rgba(15, 23, 42, 0.04);
  }
`;

export const WizardHelperText = styled.span`
  font-size: 12px;
  line-height: 1.45;
  color: ${theme.colors.textSecondary};
`;

/* tabla de Producto */
export const TableWrapper = styled.div`
  width: 100%;
  border: 1px solid #eef0f3;
  border-radius: 18px;
  overflow-x: auto;
  overflow-y: hidden;
  background: ${theme.colors.background};
  scrollbar-width: thin;
  scrollbar-color: rgba(148, 163, 184, 0.35) transparent;

  &::-webkit-scrollbar {
    height: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(148, 163, 184, 0.38);
    border-radius: 999px;
  }
`;

export const TableHeader = styled.div`
  min-width: 1320px;
  display: grid;
  grid-template-columns: 1.7fr 1fr 1fr 1fr 1fr 0.9fr 0.7fr 44px;
  gap: 14px;
  padding: 14px 16px;
  background: #f8fafc;
  border-bottom: 1px solid #eef0f3;
  font-size: 13px;
  font-weight: 800;
  color: #475569;
`;

export const TableRow = styled.div`
  min-width: 1320px;
  display: grid;
  grid-template-columns: 1.7fr 1fr 1fr 1fr 1fr 0.9fr 0.7fr 44px;
  align-items: center;
  gap: 14px;
  padding: 12px 16px;
  border-bottom: 1px solid #f1f5f9;

  &:last-child {
    border-bottom: none;
  }

  strong {
    font-size: 14px;
    font-weight: 600;
    color: ${theme.colors.textSecondary};
  }
`;

export const IconButton = styled.button`
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 10px;
  background: transparent;
  color: #94a3b8;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  opacity: ${({ disabled }) => (disabled ? 0.4 : 1)};
  transition:
    background 0.18s ease,
    color 0.18s ease,
    transform 0.18s ease;

  &:hover {
    color: ${({ disabled }) => (disabled ? "#94a3b8" : theme.colors.primary)};
    background: ${({ disabled }) =>
      disabled ? "transparent" : "rgba(242, 12, 31, 0.08)"};
    transform: ${({ disabled }) => (disabled ? "none" : "translateY(-1px)")};
  }

  &:active {
    transform: ${({ disabled }) => (disabled ? "none" : "scale(0.96)")};
  }
`;

export const TotalsBar = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 28px;
  flex-wrap: wrap;

  div {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  span {
    font-size: 15px;
    color: ${theme.colors.textSecondary};
  }

  strong {
    font-size: 16px;
    font-weight: 700;
    color: ${theme.colors.text};
  }

  @media (max-width: 700px) {
    justify-content: flex-start;
    align-items: flex-start;
    flex-direction: column;
    gap: 10px;
  }
`;

// paso gastos importacion
export const ExpensesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;

  @media (max-width: 1050px) {
    grid-template-columns: 1fr;
  }
`;

export const ExpenseCard = styled.section`
  width: 100%;
  background: ${theme.colors.background};
  border: 1px solid #eef0f3;
  border-radius: 18px;
  padding: 18px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-shadow: 0 8px 22px rgba(15, 23, 42, 0.04);
`;

export const ExpenseCardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;

  p {
    margin: 6px 0 0;
    font-size: 13px;
    line-height: 1.45;
    color: ${theme.colors.textSecondary};
  }

  @media (max-width: 620px) {
    flex-direction: column;
  }
`;

export const ExpenseTitle = styled.h4`
  margin: 0;
  font-size: 17px;
  font-weight: 700;
  color: ${theme.colors.text};
`;

export const ExpenseRows = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const ExpenseRow = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.6fr) minmax(120px, 0.8fr) 40px;
  gap: 10px;
  align-items: center;

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`;

export const ExpenseTotal = styled.div`
  padding-top: 12px;
  border-top: 1px solid #eef0f3;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;

  span {
    font-size: 13px;
    font-weight: 700;
    color: ${theme.colors.textSecondary};
  }

  strong {
    font-size: 14px;
    font-weight: 700;
    color: ${theme.colors.text};
  }
`;

export const ExpensesSummary = styled.div`
  margin-top: 22px;
  background: #f8fafc;
  border: 1px solid #eef0f3;
  border-radius: 18px;
  padding: 18px;
  box-sizing: border-box;
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 14px;

  div {
    display: flex;
    flex-direction: column;
    gap: 6px;

    padding: 14px;
    border-radius: 14px;
    background: ${theme.colors.background};
  }

  span {
    font-size: 12px;
    font-weight: 700;
    color: ${theme.colors.textSecondary};
  }

  strong {
    font-size: 15px;
    font-weight: 900;
    color: ${theme.colors.text};
  }

  .highlight {
    background: rgba(242, 12, 31, 0.08);

    span,
    strong {
      color: ${theme.colors.primary};
    }
  }

  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

// paso resumen
export const SummaryCardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
  margin-bottom: 22px;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  @media (max-width: 850px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

export const SummaryCard = styled.div`
  background: ${({ $highlight }) =>
    $highlight ? "rgba(242, 12, 31, 0.08)" : theme.colors.background};
  border: 1px solid
    ${({ $highlight }) =>
      $highlight ? "rgba(242, 12, 31, 0.16)" : "#eef0f3"};
  border-radius: 16px;
  padding: 16px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 8px;

  span {
    font-size: 12px;
    font-weight: 700;
    color: ${({ $highlight }) =>
      $highlight ? theme.colors.primary : theme.colors.textSecondary};
    text-transform: uppercase;
    letter-spacing: 0.02em;
  }

  strong {
    font-size: 16px;
    font-weight: 700;
    color: ${({ $highlight }) =>
      $highlight ? theme.colors.primary : theme.colors.text};
  }
`;

export const SummaryTableWrapper = styled.div`
  width: 100%;
  border: 1px solid #eef0f3;
  border-radius: 18px;
  overflow-x: auto;
  overflow-y: hidden;
  background: ${theme.colors.background};
  scrollbar-width: thin;
  scrollbar-color: rgba(148, 163, 184, 0.35) transparent;

  &::-webkit-scrollbar {
    height: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(148, 163, 184, 0.38);
    border-radius: 999px;
  }
`;

export const SummaryTable = styled.div`
  min-width: 1680px;
`;

const summaryGridColumns = `
  1.7fr
  0.9fr
  1.1fr
  1fr
  1fr
  1.2fr
  1.3fr
  0.9fr
  1fr
  1.1fr
  1.4fr
`;

export const SummaryTableHead = styled.div`
  display: grid;
  grid-template-columns: ${summaryGridColumns};
  gap: 12px;
  padding: 14px 16px;
  background: #f8fafc;
  border-bottom: 1px solid #eef0f3;
  font-size: 13px;
  font-weight: 900;
  color: ${theme.colors.textSecondary};
`;

export const SummaryTableRow = styled.div`
  display: grid;
  grid-template-columns: ${summaryGridColumns};
  gap: 12px;
  padding: 14px 16px;
  border-bottom: 1px solid #f1f5f9;

  &:hover {
    background: #fffafa;
  }
`;

export const SummaryTableCell = styled.div`
  font-size: 14px;
  color: ${theme.colors.text};
  display: flex;
  align-items: center;

  strong {
    font-weight: 900;
    color: ${theme.colors.text};
  }
`;

export const SummaryTableFooter = styled.div`
  display: grid;
  grid-template-columns: ${summaryGridColumns};
  gap: 12px;
  padding: 15px 16px;
  background: rgba(242, 12, 31, 0.06);
  border-top: 1px solid rgba(242, 12, 31, 0.14);

  span {
    font-size: 14px;
    font-weight: 900;
    color: ${theme.colors.primary};

    display: flex;
    align-items: center;
  }
`;

// gastos adicionales
export const WizardSelect = styled.select`
  width: 100%;
  height: 40px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 0 15px;
  box-sizing: border-box;
  background: ${theme.colors.background};
  color: ${theme.colors.text};
  font-size: 14px;
  outline: none;

  &:focus {
    border-color: #cbd5e1;
    box-shadow: 0 0 0 4px rgba(15, 23, 42, 0.04);
  }
`;

export const AdditionalCostsIntro = styled.p`
  margin: 8px 0 0;
  max-width: 860px;
  font-size: 13px;
  line-height: 1.5;
  color: ${theme.colors.textSecondary};
`;

export const AdditionalCostsTableWrapper = styled.div`
  width: 100%;
  border: 1px solid #eef0f3;
  border-radius: 18px;
  overflow-x: auto;
  overflow-y: hidden;
  background: ${theme.colors.background};

  scrollbar-width: thin;
  scrollbar-color: rgba(148, 163, 184, 0.35) transparent;

  &::-webkit-scrollbar {
    height: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(148, 163, 184, 0.38);
    border-radius: 999px;
  }
`;

const additionalCostsGridColumns = `
  1.8fr
  0.9fr
  0.7fr
  1.3fr
  1fr
  1.1fr
  1.1fr
  44px
`;

export const AdditionalCostsTableHeader = styled.div`
  min-width: 1320px;
  display: grid;
  grid-template-columns: ${additionalCostsGridColumns};
  gap: 14px;

  padding: 14px 16px;

  background: #f8fafc;
  border-bottom: 1px solid #eef0f3;

  font-size: 13px;
  font-weight: 800;
  color: ${theme.colors.textSecondary};
`;

export const AdditionalCostsTableRow = styled.div`
  min-width: 1320px;
  display: grid;
  grid-template-columns: ${additionalCostsGridColumns};
  align-items: center;
  gap: 14px;

  padding: 12px 16px;
  border-bottom: 1px solid #f1f5f9;

  &:last-child {
    border-bottom: none;
  }

  strong {
    font-size: 13px;
    font-weight: 700;
    color: ${theme.colors.text};
  }
`;

export const CreditCheckLabel = styled.label`
  display: grid;
  grid-template-columns: 18px auto 72px;
  align-items: center;
  gap: 8px;

  font-size: 13px;
  font-weight: 700;
  color: ${theme.colors.textSecondary};

  input[type="checkbox"] {
    width: 16px;
    height: 16px;
    accent-color: ${theme.colors.primary};
    cursor: pointer;
  }

  ${WizardInput} {
    height: 36px;
    padding: 0 10px;
    font-size: 13px;
  }

  ${WizardInput}:disabled {
    background: #f3f4f6;
    color: #94a3b8;
    cursor: not-allowed;
  }
`;

export const AdditionalCostsTotals = styled.div`
  margin-top: 20px;

  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 22px;
  flex-wrap: wrap;

  div {
    min-height: 46px;
    padding: 0 16px;

    border: 1px solid #eef0f3;
    border-radius: 14px;
    background: ${theme.colors.background};

    display: flex;
    align-items: center;
    gap: 10px;
  }

  span {
    font-size: 14px;
    color: ${theme.colors.textSecondary};
  }

  strong {
    font-size: 15px;
    font-weight: 800;
    color: ${theme.colors.text};
  }

  .highlight {
    background: rgba(242, 12, 31, 0.08);
    border-color: rgba(242, 12, 31, 0.16);

    span,
    strong {
      color: ${theme.colors.primary};
    }
  }

  @media (max-width: 760px) {
    justify-content: flex-start;
    align-items: stretch;
    flex-direction: column;

    div {
      justify-content: space-between;
    }
  }
`;
