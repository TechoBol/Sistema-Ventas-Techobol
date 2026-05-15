import styled from "styled-components";

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.65);

  backdrop-filter: blur(4px);

  display: flex;
  align-items: center;
  justify-content: center;

  z-index: 9999;

  padding: 20px;
`;

export const ModalCard = styled.div`
  width: 100%;
  max-width: 880px;

  max-height: 92vh;
  overflow-y: auto;

  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);

  border-radius: 28px;

  padding: 28px;

  box-shadow: 0 20px 70px rgba(0, 0, 0, 0.18),
    inset 0 1px 0 rgba(255, 255, 255, 0.7);

  animation: modalIn 0.2s ease;

  @keyframes modalIn {
    from {
      opacity: 0;
      transform: translateY(15px) scale(0.98);
    }

    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  @media (max-width: 768px) {
    padding: 18px;
    border-radius: 20px;
  }
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  margin-bottom: 28px;
`;

export const Title = styled.h2`
  font-size: 28px;
  font-weight: 800;

  color: #0f172a;

  margin: 0;

  @media (max-width: 768px) {
    font-size: 22px;
  }
`;

export const CloseButton = styled.button`
  width: 46px;
  height: 46px;

  border: none;
  border-radius: 50%;

  background: white;

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;

  color: #0f172a;

  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);

  transition: 0.15s;

  &:hover {
    transform: scale(1.05);
  }
`;

export const TotalCard = styled.div`
  background: linear-gradient(135deg, #fb0404 0%, #dc2626 100%);

  border-radius: 18px;

  padding: 18px;

  color: white;

  margin-bottom: 24px;

  box-shadow: 0 10px 30px rgba(251, 4, 4, 0.2);
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
export const CustomerEmpty = styled.div`
    padding: 20px;

    text-align: center;

    font-size: 14px;

    font-weight: 600;

    color: #94a3b8;
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

  position: relative; // 🔥 IMPORTANTE
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

  transition: 0.15s;

  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.03),
    0 3px 10px rgba(0, 0, 0, 0.03);

  &:focus {
    border-color: #000;

    box-shadow: 0 0 0 4px rgba(33, 33, 33, 0.08);
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

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;

  color: #fb0404;

  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);

  transition: 0.15s;

  &:hover {
    transform: translateY(-2px);
  }
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

  background: linear-gradient(135deg, #fb0404 0%, #dc2626 100%);

  color: white;

  font-size: 14px;
  font-weight: 700;

  cursor: pointer;

  box-shadow: 0 10px 25px rgba(251, 4, 4, 0.25);

  transition: 0.15s;

  &:hover {
    transform: translateY(-2px);
  }
`;
export const TotalTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
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

  backdrop-filter: blur(6px);

  border: 1px solid rgba(255, 255, 255, 0.15);

  font-size: 13px;
  font-weight: 700;

  color: white;

  white-space: nowrap;
`;
// =====================================================
// CUSTOMER DROPDOWN
// =====================================================

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

  z-index: 99999;

  padding: 6px 0;

  border: 1px solid #e2e8f0;

  &::-webkit-scrollbar {
    width: 7px;
  }

  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 999px;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
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

  transition: background 0.12s;

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
