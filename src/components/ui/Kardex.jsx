import styled from "styled-components";
import { theme } from "./Theme";

//////////////////////////////////////////
// WRAPPER
//////////////////////////////////////////

export const Wrapper = styled.div`
  width: 100%;
  min-height: calc(100dvh - 90px);
  padding: 20px 15px;
  @media (max-width: 900px) {
    padding: 12px;
  }
`;

//////////////////////////////////////////
// HEADER
//////////////////////////////////////////

export const Header = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
  @media (max-width: 700px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const HeaderTitle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const Title = styled.h1`
  margin: 0;
  font-size: 26px;
  font-weight: 700;
  color: ${theme.colors.text};
`;

export const Subtitle = styled.p`
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  color: ${theme.colors.textSecondary};
`;

//////////////////////////////////////////
// CONTENT
//////////////////////////////////////////

/*export const Content = styled.div`
  background: white;
  border-radius: 18px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
`;*/

export const Content = styled.div`
  width: 100%;
  background: ${theme.colors.background};
  border-radius: 26px;
  padding: 28px;
  box-sizing: border-box;
  box-shadow: 0 8px 22px rgba(15, 23, 42, 0.06);
  @media (max-width: 900px) {
    padding: 22px 18px;
    border-radius: 20px;
  }
`;

//////////////////////////////////////////
// GROUP BAR
//////////////////////////////////////////

export const GroupBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 20px;
`;

export const GroupButton = styled.button`
  height: 42px;

  padding: 0 18px;

  border-radius: 999px;

  border: 1px solid
    ${({ $active }) =>
      $active
        ? theme.colors.primary
        : "#e2e2e2"};

  background: ${({ $active }) =>
    $active
      ? theme.colors.primary
      : "white"};

  color: ${({ $active }) =>
    $active ? "white" : "#555"};

  font-size: 14px;
  font-weight: 600;

  cursor: pointer;

  transition: all 0.2s ease;

  box-shadow: ${({ $active }) =>
    $active
      ? "0 6px 18px rgba(91,108,255,0.22)"
      : "none"};

  &:hover {
    transform: translateY(-1px);

    border-color: ${theme.colors.primary};
  }

  &:active {
    transform: scale(0.97);
  }
`;

//////////////////////////////////////////
// BUTTONS
//////////////////////////////////////////

export const AddButton = styled.button`
  height: 44px;
  min-width: 110px;
  padding: 0 18px;
  border: none;
  border-radius: 14px;
  background: ${theme.colors.primary};
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.95;
    transform: translateY(-1px);
  }

  &:active {
    transform: scale(0.97);
  }
`;

//////////////////////////////////////////
// MODAL
//////////////////////////////////////////

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);

  display: flex;
  justify-content: center;
  align-items: center;

  z-index: 9999;

  backdrop-filter: blur(3px);

  animation: fadeIn 0.2s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }
`;

export const ModalContent = styled.div`
  background: white;

  width: 640px;
  max-width: 95vw;

  max-height: 90vh;

  overflow-y: auto;

  border-radius: 26px;

  padding: 32px;

  box-shadow:
    0 24px 80px rgba(0,0,0,0.18);

  animation: scaleIn 0.2s ease;

  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }

    to {
      opacity: 1;
      transform: scale(1);
    }
  }
`;

export const ModalTitle = styled.h2`
  font-size: 26px;
  font-weight: 700;
  margin-bottom: 28px;
  color: ${theme.colors.text};
`;

//////////////////////////////////////////
// SECTIONS
//////////////////////////////////////////

export const Section = styled.div`
  border: 1px solid #ececec;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 18px;
`;

export const SectionTitle = styled.div`
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 18px;
  color: ${theme.colors.textSecondary};
`;

//////////////////////////////////////////
// ROWS
//////////////////////////////////////////

export const Row = styled.div`
  display: grid;
  grid-template-columns: 140px 1fr;

  gap: 14px;

  align-items: center;

  margin-bottom: 16px;

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

//////////////////////////////////////////
// LABEL
//////////////////////////////////////////

export const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: ${theme.colors.text};
`;

//////////////////////////////////////////
// INPUTS
//////////////////////////////////////////

export const ModalInput = styled.input`
  width: 100%;
  height: 46px;

  border-radius: 14px;
  border: 1px solid #dcdcdc;

  padding: 0 14px;

  font-size: 14px;

  outline: none;

  background: white;

  transition: all 0.2s ease;

  &:focus {
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(91, 108, 255, 0.12);
  }

  &::placeholder {
    color: #aaa;
  }
`;

export const ModalSelect = styled.select`
  width: 100%;
  height: 46px;

  border-radius: 14px;
  border: 1px solid #dcdcdc;

  padding: 0 14px;

  font-size: 14px;
  font-weight: 500;

  background: white;

  outline: none;
  cursor: pointer;

  transition: all 0.2s ease;

  &:focus {
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(91, 108, 255, 0.12);
  }

  &:disabled {
    background: #f7f7f7;
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

//////////////////////////////////////////
// DATE ROW
//////////////////////////////////////////

export const DatesGrid = styled.div`
  display: grid;

  grid-template-columns: 1fr 1fr;

  gap: 18px;

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

//////////////////////////////////////////
// ACTIONS
//////////////////////////////////////////

export const ActionsRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;

  margin-top: 24px;
`;

//////////////////////////////////////////
// BUTTONS
//////////////////////////////////////////

export const SaveButton = styled.button`
  min-width: 120px;
  height: 46px;

  border: none;
  border-radius: 14px;

  background: ${theme.colors.primary};
  color: white;

  font-size: 14px;
  font-weight: 700;

  cursor: pointer;

  transition: all 0.2s ease;

  &:hover {
    opacity: 0.95;
  }

  &:active {
    transform: scale(0.97);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const CancelButton = styled.button`
  min-width: 120px;
  height: 46px;

  border-radius: 14px;
  border: 1px solid #d8d8d8;

  background: #f8f8f8;

  color: #444;

  font-size: 14px;
  font-weight: 600;

  cursor: pointer;

  transition: all 0.2s ease;

  &:hover {
    background: #efefef;
  }

  &:active {
    transform: scale(0.97);
  }
`;

//////////////////////////////////////////
// TABLE WRAPPER
//////////////////////////////////////////

export const TableWrapper = styled.div`
  height: 700px;
  width: 100%;
  background: white;
  border-radius: 18px;
  overflow: hidden;
  border: 1px solid #eee;
`;

//////////////////////////////////////////
// TOTAL BAR
//////////////////////////////////////////

export const TotalBar = styled.div`
  margin-top: 14px;

  display: flex;
  justify-content: flex-end;
  align-items: center;

  gap: 12px;

  padding: 16px 20px;

  background: white;

  border-radius: 14px;

  border: 1px solid #eee;
`;

export const TotalText = styled.span`
  font-size: 18px;

  font-weight: ${({ $bold }) =>
    $bold ? 700 : 500};

  color: ${theme.colors.text};
`;

// estilo del popover, la parte de detalles
export const DetailButton = styled.button`
  height: 34px;
  padding: 0 12px;
  border: none;
  border-radius: 10px;

  background: #f3f4f6;
  color: #334155;
  font-size: 13px;
  font-weight: 700;

  display: inline-flex;
  align-items: center;
  gap: 6px;

  cursor: pointer;
  transition: all 0.18s ease;

  &:hover {
    background: #e5e7eb;
    color: #0f172a;
  }
`;

export const DetailPopoverCard = styled.div`
  min-width: 450px;
  max-width: 500px;
    
  background: linear-gradient(180deg, #fff1f2 0%, #ffe4e6 100%);
  border-radius: 20px;
  border: 1px solid rgba(239, 68, 68, 0.32);
  box-shadow:
    0 20px 45px rgba(15, 23, 42, 0.18),
    0 8px 24px rgba(239, 68, 68, 0.14),
    inset 0 1px 0 rgba(255, 255, 255, 0.6);
  padding: 20px 20px 16px;
`;

export const DetailPopoverTitle = styled.h4`
  margin: 0 0 16px;

  font-size: 20px;
  font-weight: 800;
  color: #111827;
  display: flex;
  align-items: center;
  gap: 10px;

  &::before {
    content: "";
    width: 10px;
    height: 26px;
    border-radius: 999px;
    background: linear-gradient(180deg, #ef4444 0%, #dc2626 100%);
    box-shadow: 0 4px 10px rgba(239, 68, 68, 0.3);
  }
`;

export const DetailPopoverTable = styled.div`
  width: 100%;
`;

export const DetailPopoverHead = styled.div`
  display: grid;
  grid-template-columns:
    1.2fr
    1fr
    0.8fr
    1fr;
  gap: 12px;

  padding: 10px 12px;
  margin-bottom: 4px;
  border-radius: 12px;
  background: rgba(239, 68, 68, 0.12);

  font-size: 13px;
  font-weight: 800;
  color: #334155;
`;

export const DetailPopoverRow = styled.div`
  display: grid;
  grid-template-columns:
    1.2fr
    1fr
    0.8fr
    1fr;
  gap: 12px;

  padding: 12px;
  border-bottom: 1px solid rgba(203, 213, 225, 0.7);
  font-size: 14px;
  color: #0f172a;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.45);
    border-radius: 10px;
  }
`;
