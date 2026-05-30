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

  margin-bottom: 36px;
`;

export const WizardHeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

export const WizardBackButton = styled.button`
  width: 52px;
  height: 52px;

  border: none;
  border-radius: 16px;

  background: #f8fafc;
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

export const WizardSubtitle = styled.p`
  margin: 6px 0 0;
  font-size: 14px;
  font-weight: 500;

  color: ${theme.colors.textSecondary};
`;

export const StepperWrapper = styled.div`
  width: 100%;

  display: flex;
  align-items: flex-start;

  margin-bottom: 38px;

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

  padding: 28px 30px;
  box-sizing: border-box;

  @media (max-width: 700px) {
    padding: 22px 18px;
  }
`;

export const StepPanelTitle = styled.h3`
  margin: 0 0 12px;

  font-size: 24px;
  font-weight: 800;

  color: ${theme.colors.text};
`;

export const StepPanelText = styled.p`
  margin: 0 0 24px;

  font-size: 15px;
  line-height: 1.6;

  color: ${theme.colors.textSecondary};
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
