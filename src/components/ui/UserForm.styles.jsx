import styled from "styled-components";
import { theme } from "./Theme";

export const FormPageCard = styled.section`
  width: 100%;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 18px;
  box-shadow: 0 8px 22px rgba(15, 23, 42, 0.06);

  padding: 42px 52px;
  box-sizing: border-box;

  @media (max-width: 900px) {
    padding: 28px 22px;
  }
`;

export const FormHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  margin-bottom: 34px;
`;

export const BackButton = styled.button`
  width: 38px;
  height: 38px;

  border: none;
  border-radius: 50%;

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

export const FormTitle = styled.h2`
  margin: 0;

  font-size: 26px;
  font-weight: 700;
  color: ${theme.colors.textPrimary};
`;

export const Form = styled.form`
  width: 100%;

  display: flex;
  flex-direction: column;
  gap: 28px;
`;

export const FormSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

export const SectionTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: ${theme.colors.textPrimary};
`;

export const FieldsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(${({ $columns }) => $columns || 2}, 1fr);
  gap: 24px 32px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const Label = styled.label`
  font-size: 15px;
  font-weight: 600;
  color: #334155;
`;

export const Input = styled.input`
  width: 100%;
  height: 42px;

  border: 1px solid #d7d7d7;
  border-radius: 22px;

  padding: 0 18px;
  box-sizing: border-box;

  background: ${theme.colors.background};

  font-size: 14px;
  color: ${theme.colors.text};

  outline: none;

  box-shadow: 0 4px 8px rgba(15, 23, 42, 0.08);

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

export const SelectWrapper = styled.div`
  position: relative;
`;

export const Select = styled.select`
  width: 100%;
  height: 42px;

  border: 1px solid #d7d7d7;
  border-radius: 22px;

  padding: 0 44px 0 18px;
  box-sizing: border-box;

  background: ${theme.colors.background};

  font-size: 14px;
  color: ${({ value }) =>
    value ? theme.colors.text : theme.colors.textMuted || "#94a3b8"};

  outline: none;
  appearance: none;

  box-shadow: 0 4px 8px rgba(15, 23, 42, 0.08);

  cursor: pointer;

  &:focus {
    border-color: #cbd5e1;
    box-shadow: 0 0 0 4px rgba(15, 23, 42, 0.04);
  }

  option {
    color: ${theme.colors.text};
    background: ${theme.colors.background};
  }
`;

export const SelectIcon = styled.span`
  position: absolute;
  right: 18px;
  top: 50%;

  transform: translateY(-50%);

  display: flex;
  align-items: center;
  justify-content: center;

  color: #30425f;
  pointer-events: none;
`;

export const Actions = styled.div`
  display: flex;
  justify-content: center;

  margin-top: 24px;

  @media (max-width: 700px) {
    width: 100%;
  }
`;

export const SaveButton = styled.button`
  min-width: 240px;
  height: 42px;

  border: none;
  border-radius: 22px;

  background: ${theme.colors.primary};
  color: ${theme.colors.background};

  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.3px;

  cursor: pointer;

  box-shadow: 0 6px 12px rgba(15, 23, 42, 0.16);

  transition:
    transform 0.18s ease,
    opacity 0.18s ease;

  &:hover {
    opacity: 0.95;
    transform: translateY(-1px);
  }

  &:active {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
    transform: none;
  }

  @media (max-width: 700px) {
    width: 100%;
  }
`;
