import styled from "styled-components";
import { theme } from "./Theme";

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;

  background: rgba(15, 23, 42, 0.45);

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 24px;
  box-sizing: border-box;
`;

export const ModalCard = styled.div`
  width: 100%;
  max-width: ${({ $size }) => ($size === "large" ? "1100px" : "640px")};
  min-width: 280px;
  max-height: calc(100dvh - 48px);//
  overflow-y: auto;//


  background: ${theme.colors.background};
  border-radius: 26px;

  padding: 42px 54px 38px;
  box-sizing: border-box;

  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.22);

  position: relative;

  @media (max-width: 700px) {
    padding: 34px 24px 28px;
    border-radius: 22px;
  }
`;

export const ModalTitle = styled.h2`
  margin: 0 0 30px;

  font-size: 26px;
  font-weight: 700;
  color: ${theme.colors.textPrimary};

  @media (max-width: 700px) {
    font-size: 26px;
  }
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 22px;
`;

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const Label = styled.label`
  font-size: 15px;
  font-weight: 600;
  color: ${theme.colors.textPrimary};

  @media (max-width: 700px) {
    font-size: 15px;
  }
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

  option:disabled {
    color: #64748b;
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
  gap: 14px;

  margin-top: 34px;

  @media (max-width: 700px) {
    flex-direction: column-reverse;
  }
`;

// Buttons
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

export const CloseButton = styled.button`
  position: absolute;
  top: 18px;
  right: 18px;

  width: 34px;
  height: 34px;

  border: none;
  border-radius: 30%;

  background: #f3f4f6;
  color: ${theme.colors.text};

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;

  &:hover {
    background: #e5e7eb;
  }
`;

export const FormSectionTitle = styled.h3`
  margin: 10px 0 0;
  font-size: 24px;
  font-weight: 600;
  color: ${theme.colors.textPrimary};

  @media (max-width: 700px) {
    font-size: 20px;
  }
`;

export const FieldsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(${({ $columns }) => $columns || 2}, 1fr);
  gap: 24px 32px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const FullWidthField = styled.div`
  grid-column: 1 / -1;
`;

export const ModalHint = styled.p`
  margin: -8px 0 0;
  font-size: 13px;
  color: ${theme.colors.textSecondary};
`;

export const Textarea = styled.textarea`
  width: 100%;
  min-height: 92px;

  border: 1px solid #d7d7d7;
  border-radius: 18px;
  padding: 14px 18px;
  box-sizing: border-box;

  background: ${theme.colors.background};
  font-size: 14px;
  color: ${theme.colors.text};

  outline: none;
  resize: vertical;

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
