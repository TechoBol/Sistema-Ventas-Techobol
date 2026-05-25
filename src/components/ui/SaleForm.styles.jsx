import styled from "styled-components";
import { theme } from "./Theme";

export const SaleCard = styled.section`
  width: 100%;

  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 22px;

  padding: 32px;
  box-sizing: border-box;

  box-shadow: 0 8px 22px rgba(15, 23, 42, 0.06);

  @media (max-width: 768px) {
    padding: 22px;
    border-radius: 18px;
  }
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;

  margin-bottom: 28px;
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

  &:hover {
    background: #fff3f4;
    color: ${theme.colors.primary};
  }
`;

export const Title = styled.h2`
  margin: 0;
  font-size: 28px;
  font-weight: 800;
  color: #0f172a;
`;

export const TotalCard = styled.div`
  background: linear-gradient(135deg, ${theme.colors.primary} 0%, #dc2626 100%);
  border-radius: 18px;
  padding: 18px;
  color: white;
  margin-bottom: 24px;
  box-shadow: 0 10px 30px rgba(251, 4, 4, 0.2);
`;

export const TotalTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const TotalLabel = styled.div`
  font-size: 15px;
  opacity: 0.9;
`;

export const TotalValue = styled.div`
  font-size: 30px;
  font-weight: 800;
  margin-top: 4px;
`;

export const PaymentInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;

  @media (max-width: 768px) {
    align-items: flex-start;
  }
`;

export const PaymentLabel = styled.span`
  font-size: 12px;
  font-weight: 600;
  opacity: 0.85;
`;

export const PaymentBadge = styled.div`
  padding: 8px 14px;
  border-radius: 999px;

  background: rgba(255, 255, 255, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.15);

  font-size: 13px;
  font-weight: 700;
  color: white;
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;

  position: relative;
`;

export const FullWidth = styled.div`
  grid-column: span 2;

  display: flex;
  flex-direction: column;
  gap: 10px;

  @media (max-width: 768px) {
    grid-column: span 1;
  }
`;

export const Label = styled.label`
  font-size: 14px;
  font-weight: 700;
  color: #334155;
`;

export const Input = styled.input`
  width: 100%;
  height: 48px;

  border-radius: 14px;
  border: 1px solid #e2e8f0;

  background: white;
  padding: 0 16px;

  font-size: 14px;
  outline: none;

  box-sizing: border-box;

  &:focus {
    border-color: #cbd5e1;
    box-shadow: 0 0 0 4px rgba(15, 23, 42, 0.04);
  }
`;

export const AddressWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const LocationButton = styled.button`
  min-width: 48px;
  height: 48px;

  border-radius: 14px;
  border: none;

  background: white;
  color: ${theme.colors.primary};

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;

  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);

  &:hover {
    transform: translateY(-1px);
  }
`;

export const CustomerDropdown = styled.div`
  position: absolute;
  top: calc(100% + 6px);
  left: 0;

  width: 100%;
  max-height: 320px;

  overflow-y: auto;

  background: #ffffff;
  border-radius: 14px;

  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);

  z-index: 50;

  padding: 6px 0;
  border: 1px solid #e2e8f0;
`;

export const CustomerHeader = styled.div`
  display: flex;
  align-items: center;

  padding: 10px 16px;

  border-bottom: 1px solid #e2e8f0;
  background: #f8fafc;

  position: sticky;
  top: 0;
  z-index: 2;
`;

export const CustomerItem = styled.div`
  display: flex;
  align-items: center;

  padding: 10px 16px;

  cursor: pointer;

  &:hover {
    background: #fff7f0;
  }
`;

export const CustomerCode = styled.span`
  width: 90px;
  flex-shrink: 0;

  font-size: 12px;
  color: #94a3b8;

  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export const CustomerName = styled.span`
  width: 220px;
  flex-shrink: 0;

  font-size: 14px;
  font-weight: 500;
  color: #0f172a;

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const CustomerHeaderCode = styled.span`
  width: 90px;
  flex-shrink: 0;

  font-size: 12px;
  font-weight: 700;
  color: #64748b;
`;

export const CustomerHeaderName = styled.span`
  width: 220px;
  flex-shrink: 0;

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

export const AddressSelect = styled.select`
  width: 100%;
  height: 48px;

  border-radius: 14px;
  border: 1px solid #e2e8f0;

  background: white;
  padding: 0 16px;

  font-size: 14px;
  outline: none;

  cursor: pointer;
`;

export const InvoiceBox = styled.div`
  margin-top: 22px;

  padding: 16px 18px;

  border-radius: 18px;

  background: rgba(255, 255, 255, 0.9);
  border: 1px solid #e2e8f0;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
`;

export const InvoiceInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

export const InvoiceTitle = styled.span`
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
`;

export const InvoiceSubtitle = styled.span`
  margin-top: 4px;
  font-size: 13px;
  color: #64748b;
`;

export const SwitchWrapper = styled.label`
  position: relative;

  width: 58px;
  height: 32px;

  display: inline-block;
  cursor: pointer;
`;

export const SwitchInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;

  &:checked + span {
    background: linear-gradient(135deg, ${theme.colors.primary} 0%, #dc2626 100%);
  }

  &:checked + span:before {
    transform: translateX(26px);
  }
`;

export const SwitchSlider = styled.span`
  position: absolute;
  inset: 0;

  background: #cbd5e1;
  border-radius: 999px;

  transition: 0.2s;

  &:before {
    content: "";
    position: absolute;

    width: 24px;
    height: 24px;

    left: 4px;
    top: 4px;

    background: white;
    border-radius: 50%;

    transition: 0.2s;
  }
`;

export const BankSelectWrapper = styled.div`
  margin-top: 18px;

  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const BankSelectLabel = styled.label`
  font-size: 14px;
  font-weight: 700;
  color: #334155;
`;

export const BankSelect = styled.select`
  width: 100%;
  height: 48px;

  border-radius: 14px;
  border: 1px solid #e2e8f0;

  background: white;
  padding: 0 16px;

  font-size: 14px;
  outline: none;

  cursor: pointer;
`;

export const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;

  margin-top: 28px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const SecondaryButton = styled.button`
  height: 46px;
  padding: 0 22px;

  border-radius: 14px;
  border: none;

  background: #e2e8f0;
  color: #0f172a;

  font-size: 14px;
  font-weight: 700;

  cursor: pointer;
`;

export const FinishButton = styled.button`
  height: 46px;
  padding: 0 26px;

  border: none;
  border-radius: 14px;

  background: linear-gradient(135deg, ${theme.colors.primary} 0%, #dc2626 100%);
  color: white;

  font-size: 14px;
  font-weight: 700;

  cursor: pointer;

  box-shadow: 0 10px 25px rgba(251, 4, 4, 0.25);

  &:hover {
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
    transform: none;
  }
`;
