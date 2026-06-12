import styled from "styled-components";
import { theme } from "./Theme";

export const BankTableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  border: 1px solid #edf0f4;
  border-radius: 14px;
  background: ${theme.colors.background};
`;

const bankColumns = `
  minmax(135px, 0.8fr)
  minmax(130px, 0.8fr)
  minmax(135px, 0.9fr)
  minmax(125px, 0.8fr)
  minmax(130px, 0.9fr)
  minmax(135px, 0.9fr)
  minmax(135px, 0.9fr)
  minmax(135px, 0.9fr)
  minmax(135px, 0.9fr)
  minmax(145px, 1fr)
  42px
`;

export const BankTableHead = styled.div`
  min-width: 1450px;
  display: grid;
  grid-template-columns: ${bankColumns};
  gap: 10px;
  align-items: center;
  padding: 12px 14px;
  border-bottom: 1px solid #e8edf3;
  background: #f8fafc;

  span {
    color: ${theme.colors.textSecondary};
    font-size: 12px;
    font-weight: 700;
    line-height: 1.3;
  }
`;

export const BankTableRow = styled.div`
  min-width: 1450px;
  display: grid;
  grid-template-columns: ${bankColumns};
  gap: 10px;
  align-items: center;
  padding: 11px 14px;
  border-bottom: 1px solid #f0f2f5;

  &:last-child {
    border-bottom: none;
  }
`;

export const BankSelect = styled.select`
  width: 100%;
  height: 40px;
  padding: 0 11px;
  border: 1px solid #e2e8f0;
  border-radius: 9px;
  background: #fff;
  color: ${theme.colors.text};
  font-size: 13px;
  outline: none;

  &:focus {
    border-color: rgba(242, 12, 31, 0.38);
    box-shadow: 0 0 0 4px rgba(242, 12, 31, 0.06);
  }
`;

export const CalculatedValue = styled.div`
  min-height: 40px;
  padding: 0 10px;
  display: flex;
  align-items: center;
  border-radius: 9px;
  background: #f8fafc;
  color: ${theme.colors.text};
  font-size: 12px;
  font-weight: 700;
`;

export const BankSummaryGrid = styled.div`
  margin-top: 18px;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;

  @media (max-width: 1050px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

export const BankSummaryCard = styled.div`
  padding: 14px 15px;
  border: 1px solid
    ${({ $highlight }) => ($highlight ? "#fecaca" : "#edf0f4")};
  border-radius: 12px;
  background: ${({ $highlight }) => ($highlight ? "#fff5f5" : "#fff")};
  display: flex;
  flex-direction: column;
  gap: 6px;

  span {
    color: ${theme.colors.textSecondary};
    font-size: 12px;
  }

  strong {
    color: ${({ $highlight }) =>
      $highlight ? theme.colors.primary : theme.colors.text};
    font-size: 14px;
  }
`;

export const BankHelpText = styled.span`
  display: block;
  margin-top: 4px;
  color: #94a3b8;
  font-size: 11px;
  line-height: 1.35;
`;
