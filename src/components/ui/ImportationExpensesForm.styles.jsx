import styled from "styled-components";
import { theme } from "./Theme";

export const ExpensesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 760px) {
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

  box-shadow: 0 8px 22px rgba(15, 23, 42, 0.05);
`;

export const ExpenseCardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

export const ExpenseTitle = styled.h3`
  margin: 0;

  display: flex;
  align-items: center;
  gap: 8px;

  font-size: 15px;
  font-weight: 800;
  color: ${theme.colors.text};
`;

export const ExpenseAddButton = styled.button`
  height: 32px;
  padding: 0 12px;

  border: none;
  border-radius: 10px;

  background: rgba(242, 12, 31, 0.08);
  color: ${theme.colors.primary};

  font-size: 12px;
  font-weight: 700;

  display: inline-flex;
  align-items: center;
  gap: 6px;

  cursor: pointer;

  &:hover {
    background: rgba(242, 12, 31, 0.12);
  }
`;

export const ExpenseRows = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const ExpenseRow = styled.div`
  display: grid;
  grid-template-columns: 1.6fr 0.9fr 34px;
  gap: 8px;
  align-items: center;

  @media (max-width: 420px) {
    grid-template-columns: 1fr;
  }
`;

export const ExpenseInput = styled.input`
  width: 100%;
  height: 38px;

  border: 1px solid #e5e7eb;
  border-radius: 9px;

  padding: 0 11px;
  box-sizing: border-box;

  background: white;
  color: ${theme.colors.text};

  font-size: 13px;
  outline: none;

  &::placeholder {
    color: #94a3b8;
  }

  &:focus {
    border-color: rgba(242, 12, 31, 0.35);
    box-shadow: 0 0 0 4px rgba(242, 12, 31, 0.06);
  }
`;

export const ExpenseIconButton = styled.button`
  width: 34px;
  height: 34px;

  border: none;
  border-radius: 9px;

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

  @media (max-width: 420px) {
    justify-self: flex-end;
  }
`;

export const ExpenseTotal = styled.div`
  margin-top: 4px;
  padding-top: 12px;

  border-top: 1px solid #eef0f3;

  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;

  font-size: 13px;
  color: ${theme.colors.textSecondary};

  strong {
    color: ${theme.colors.text};
    font-size: 14px;
  }
`;
