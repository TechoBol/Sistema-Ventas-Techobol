import styled from "styled-components";
import { theme } from "./Theme";

/* =========================================================
   PAGE
========================================================= */

export const PageContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 20px 15px;
  gap: 28px;

  @media (max-width: 768px) {
    padding: 12px;
  }
`;

/* =========================================================
   HEADER
========================================================= */

export const PageHeader = styled.div`
  display: flex;
  flex-direction: column;
`;

export const HeaderTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

export const HeaderContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

export const HeaderTitle = styled.header`
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-bottom: 22px;
`;

export const Title = styled.h1`
  margin: 0;
  font-size: 26px;
  font-weight: 700;
  color: ${theme.colors.text};
`;

export const Subtitle = styled.p`
  font-size: 13px;
  color: ${theme.colors.textSecondary};
  margin: 0;
`;

export const BackButton = styled.button`
  width: 38px;
  height: 38px;

  border: none;
  border-radius: 12px;

  background: #f3f4f6;
  color: ${theme.colors.text};

  display: inline-flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;
  transition: all 0.18s ease;

  &:hover {
    background: #fff3f4;
    color: ${theme.colors.primary};
    transform: translateY(-1px);
  }
`;

/* =========================================================
   ACTIONS
========================================================= */

export const TopActions = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;

  @media (max-width: 700px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const SearchWrapper = styled.div`
  width: 320px;
  height: 42px;
  padding: 0 16px;

  border-radius: 22px;
  background: ${theme.colors.background};
  color: ${theme.colors.textMuted};
  border: 1px solid rgba(148, 163, 184, 0.28);

  display: flex;
  align-items: center;
  gap: 10px;

  box-shadow: 0 6px 16px rgba(15, 23, 42, 0.04);

  @media (max-width: 700px) {
    width: 100%;
  }
`;

export const SearchInput = styled.input`
  width: 100%;
  border: none;
  outline: none;
  background: transparent;

  font-size: 14px;
  color: ${theme.colors.textPrimary};

  &::placeholder {
    color: ${theme.colors.textMuted};
  }
`;

export const AddButton = styled.button`
  height: 42px;
  padding: 0 16px;

  border: none;
  border-radius: 22px;

  background: ${theme.colors.primary};
  color: ${theme.colors.background};

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  font-size: 14px;
  font-weight: 700;

  cursor: pointer;
  transition: all 0.18s ease;

  box-shadow: 0 10px 24px rgba(17, 24, 39, 0.12);

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 14px 30px rgba(17, 24, 39, 0.16);
  }

  &:active {
    transform: scale(0.98);
  }

  @media (max-width: 700px) {
    width: 100%;
  }
`;

export const FiltersGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

export const ClearFiltersButton = styled.button`
  width: 40px;
  height: 40px;

  border: none;
  border-radius: 12px;
  background: transparent;
  color: #999;

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    color: ${theme.colors.primary};
    background: rgba(242, 12, 31, 0.08);
  }

  @media (max-width: 700px) {
    width: 100%;
    background: rgba(255, 255, 255, 0.85);
  }
`;

/* =========================================================
   FORM
========================================================= */

export const FormWrapper = styled.div`
  width: 100%;

  background: rgba(255, 255, 255, 0.78);

  border: 1px solid rgba(255, 255, 255, 0.7);

  border-radius: 34px;

  padding: 30px;

  box-sizing: border-box;

  display: flex;
  flex-direction: column;
  gap: 28px;

  backdrop-filter: blur(10px);

  box-shadow:
    0 10px 35px rgba(15, 23, 42, 0.04),
    inset 0 1px 0 rgba(255, 255, 255, 0.4);

  @media (max-width: 768px) {
    padding: 18px;
    border-radius: 24px;
  }
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 26px;
`;

export const FormContent = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

export const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

/* =========================================================
   SECTIONS
========================================================= */

export const Section = styled.div`
  background: rgba(248, 250, 252, 0.75);

  border: 1px solid rgba(226, 232, 240, 0.8);

  border-radius: 24px;

  padding: 24px;

  display: flex;
  flex-direction: column;
  gap: 20px;

  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.7);

  @media (max-width: 768px) {
    padding: 18px;
  }
`;

export const SectionTitle = styled.h3`
  margin: 0;

  font-size: 17px;
  font-weight: 700;

  color: #0f172a;
`;

/* =========================================================
   GRIDS
========================================================= */

export const Grid2 = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 18px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const Grid3 = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

/* =========================================================
   INPUTS
========================================================= */

export const ContainerInput = styled.div`
  display: flex;
  flex-direction: column;
  gap: 7px;
`;

export const Input = styled.input`
  width: 100%;
  height: 54px;

  border: 1px solid #e2e8f0;
  border-radius: 16px;

  padding: 0 16px;

  background: white;

  font-size: 14px;
  font-weight: 500;

  color: #0f172a;

  outline: none;
  box-sizing: border-box;

  transition: all 0.2s ease;

  &:focus {
    border-color: #cbd5e1;
    box-shadow: 0 0 0 4px rgba(15, 23, 42, 0.04);
  }

  &::placeholder {
    color: #94a3b8;
  }

  &:disabled {
    background: #f1f5f9;
    color: #94a3b8;
    cursor: not-allowed;
    opacity: 0.9;
  }
`;

export const Select = styled.select`
  width: 100%;
  height: 54px;

  border: 1px solid #e2e8f0;
  border-radius: 16px;

  padding: 0 16px;

  background: white;

  font-size: 14px;
  font-weight: 500;

  color: #0f172a;

  outline: none;
  cursor: pointer;

  transition: all 0.2s ease;

  &:focus {
    border-color: #cbd5e1;
    box-shadow: 0 0 0 4px rgba(15, 23, 42, 0.04);
  }

  &:disabled {
    background: #f1f5f9;
    color: #94a3b8;
    cursor: not-allowed;
    opacity: 0.9;
  }
`;

export const ErrorText = styled.span`
  font-size: 12px;
  font-weight: 600;

  color: #dc2626;
`;

export const FieldLabel = styled.label`
  font-size: 13px;
  font-weight: 700;
  color: #475569;
  margin-left: 4px;
`;

/* =========================================================
   BUTTONS
========================================================= */

export const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const Button = styled.button`
  min-width: 220px;
  height: 42px;

  border: none;
  border-radius: 20px;
  padding: 0 28px;

  background: ${theme.colors.primary};
  color: white;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  font-size: 15px;
  font-weight: 700;

  cursor: pointer;

  transition: all 0.2s ease;

  box-shadow: 0 12px 24px rgba(49, 101, 212, 0.12);

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 16px 32px rgba(17, 24, 39, 0.16);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

/* =========================================================
   TOTAL BAR
========================================================= */

export const TotalBar = styled.div`
  width: 100%;

  display: flex;
  justify-content: flex-end;
  align-items: center;

  gap: 16px;

  padding: 18px 26px;

  border-radius: 24px;

  background: rgba(255, 255, 255, 0.78);

  border: 1px solid rgba(255, 255, 255, 0.7);

  backdrop-filter: blur(10px);

  box-shadow:
    0 10px 35px rgba(15, 23, 42, 0.04),
    inset 0 1px 0 rgba(255, 255, 255, 0.4);

  @media (max-width: 768px) {
    justify-content: space-between;
    padding: 16px 18px;
  }
`;

export const TotalLabel = styled.span`
  font-size: 20px;
  margin-top: 10px;
  font-weight: 700;
  color: #64748b;
`;

export const TotalValue = styled.span`
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.03em;

  color: #0f172a;

  @media (max-width: 768px) {
    font-size: 22px;
  }
`;

export const SwitchWrapper = styled.label`
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 14px 16px;

  background: rgba(255, 255, 255, 0.85);
  border: 1px solid #e2e8f0;
  border-radius: 16px;

  cursor: pointer;
  user-select: none;

  transition: all 0.2s ease;

  &:hover {
    border-color: #cbd5e1;
  }
`;

export const SwitchLabel = styled.span`
  font-size: 13px;
  font-weight: 700;
  color: #475569;
`;

export const Switch = styled.input`
  appearance: none;
  width: 44px;
  height: 24px;
  background: #cbd5e1;
  border-radius: 999px;
  position: relative;
  outline: none;
  cursor: pointer;
  transition: all 0.2s ease;

  &:checked {
    background: ${theme.colors.primary};
  }

  &:before {
    content: "";
    position: absolute;
    width: 18px;
    height: 18px;
    top: 3px;
    left: 3px;
    background: white;
    border-radius: 50%;
    transition: all 0.2s ease;
  }

  &:checked:before {
    transform: translateX(20px);
  }
`;

/* =========================================================
   CONVERT MODAL (Quotations)
========================================================= */

export const ConvertModalInputStyle = {
    width: "100%",
    padding: "8px 12px",
    border: "1px solid #e2e8f0",
    borderRadius: 8,
    fontSize: 14,
    boxSizing: "border-box",
};

export const ConvertModalLabelStyle = {
    fontSize: 11,
    fontWeight: 700,
    color: "#64748b",
    textTransform: "uppercase",
    marginBottom: 4,
    display: "block",
};

export const ConvertModalButton = styled.button`
  margin-top: 8px;
  padding: 10px 0;
  width: 100%;

  background: #2563eb;
  color: #fff;

  border: none;
  border-radius: 8px;

  font-size: 14px;
  font-weight: 600;

  cursor: pointer;
  transition: opacity 0.2s ease;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
`;