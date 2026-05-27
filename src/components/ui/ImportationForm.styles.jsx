import styled from "styled-components";
import { theme } from "./Theme";

export const FormCard = styled.div`
  width: 100%;

  background: ${theme.colors.background};
  border-radius: 24px;

  padding: 30px;
  box-sizing: border-box;

  box-shadow: 0 8px 22px rgba(15, 23, 42, 0.06);

  @media (max-width: 700px) {
    padding: 22px 18px;
    border-radius: 20px;
  }
`;

export const FormHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;

  margin-bottom: 28px;
`;

export const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`;

export const BackButton = styled.button`
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

  &:hover {
    color: ${theme.colors.primary};
    background: rgba(242, 12, 31, 0.08);
  }
`;

export const Title = styled.h1`
  margin: 0;
  font-size: 26px;
  font-weight: 700;
  color: ${theme.colors.textPrimary};
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 22px;
`;

export const FieldsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 180px;
  gap: 18px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const Label = styled.label`
  font-size: 15px;
  font-weight: 600;
  color: #334155;
`;

export const Input = styled.input`
  width: 100%;
  height: 40px;

  border: 1px solid #e5e7eb;
  border-radius: 10px;

  padding: 0 12px;
  box-sizing: border-box;

  background: #ffffff;
  color: ${theme.colors.text};

  font-size: 14px;
  outline: none;

  transition: all 0.18s ease;

  &::placeholder {
    color: #94a3b8;
  }

  &:focus {
    border-color: #cbd5e1;
    box-shadow: 0 0 0 4px rgba(15, 23, 42, 0.04);
  }
`;

export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;

  margin-top: 4px;

  @media (max-width: 700px) {
    align-items: stretch;
    flex-direction: column;
  }
`;

export const SectionTitle = styled.h2`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: ${theme.colors.textPrimary};
`;

export const AddProductButton = styled.button`
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

export const ProductsTable = styled.div`
  width: 100%;
  overflow-x: auto;

  border: 1px solid #eef0f3;
  border-radius: 16px;

  background: #ffffff;
`;

export const TableHeader = styled.div`
  min-width: 900px;
  display: grid;
  grid-template-columns: 2fr 0.9fr 1fr 1.2fr 1fr 44px;
  gap: 14px;
  padding: 12px 14px;
  background: #f8fafc;
  border-bottom: 1px solid #eef0f3;
  font-size: 13px;
  font-weight: 800;
  color: #475569;
`;

export const ProductRow = styled.div`
  min-width: 900px;
  display: grid;
  grid-template-columns: 2fr 0.9fr 1fr 1.2fr 1fr 44px;
  align-items: center;
  gap: 14px;
  padding: 10px 14px;
  border-bottom: 1px solid #f1f5f9;

  span {
    font-size: 14px;
    font-weight: 600;
    color: #64748b;
  }

  &:last-child {
    border-bottom: none;
  }
`;

export const IconButton = styled.button`
  width: 34px;
  height: 34px;

  border: none;
  border-radius: 10px;

  background: transparent;
  color: #94a3b8;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  opacity: ${({ disabled }) => (disabled ? 0.4 : 1)};

  &:hover {
    color: ${({ disabled }) => (disabled ? "#94a3b8" : theme.colors.primary)};
    background: ${({ disabled }) =>
      disabled ? "transparent" : "rgba(242, 12, 31, 0.08)"};
  }
`;

export const SubtotalBox = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 28px;
  font-size: 14px;
  color: #64748b;

  div {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  strong {
    color: ${theme.colors.text};
  }

  @media (max-width: 700px) {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
    div {
      justify-content: space-between;
    }
  }
`;

export const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;

  margin-top: 8px;

  @media (max-width: 700px) {
    flex-direction: column-reverse;
  }
`;

export const CancelButton = styled.button`
  height: 42px;
  padding: 0 18px;

  border: none;
  border-radius: 12px;

  background: #f3f4f6;
  color: #475569;

  font-size: 14px;
  font-weight: 700;

  cursor: pointer;

  &:hover {
    background: #e5e7eb;
  }
`;

export const SaveButton = styled.button`
  height: 42px;
  padding: 0 20px;
  border: none;
  border-radius: 12px;
  background: ${theme.colors.primary};
  color: white;
  font-size: 14px;
  font-weight: 700;

  cursor: pointer;
   
  &:hover {
    opacity: 0.95;
    transform: translateY(-1px);
  }

  &:active {
    transform: scale(0.98);
  }
`;
