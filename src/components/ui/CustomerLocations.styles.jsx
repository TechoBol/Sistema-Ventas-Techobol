import styled from "styled-components";
import { theme } from "./Theme";

const c = theme.colors;

export const ExpandButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 22px;
  color: ${c.textSecondary};

  &:hover {
    color: ${c.text};
  }
`;

export const LocationSelect = styled.select`
  position: absolute;
  bottom: 12px;
  left: 12px;
  right: 12px;
  z-index: 1000;
  padding: 10px 14px;
  border-radius: 12px;
  border: 1px solid ${c.border};
  background: ${c.background};
  outline: none;
  appearance: none;
  cursor: pointer;
`;

export const FloatingHeader = styled.div`
  position: absolute;
  top: 12px;
  left: 12px;
  right: 12px;
  z-index: 1000;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${c.background};
  border-radius: 12px;
  border: 1px solid ${c.border};
  padding: 8px 12px;
`;

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1100;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ModalContainer = styled.div`
  width: 95%;
  height: 90vh;
  background: ${c.background};
  border-radius: 20px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

export const ModalHeader = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid ${c.borderLight};
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
`;

export const ModalHeaderText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const ModalTitle = styled.span`
  font-size: 15px;
  font-weight: 700;
  color: ${c.textPrimary};
`;

export const ModalSubtitle = styled.span`
  font-size: 12px;
  color: ${c.textMuted};
`;

export const CloseButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid ${c.border};
  background: ${c.background};
  cursor: pointer;
  font-size: 14px;
  color: ${c.textSecondary};
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${c.surfaceHover};
    color: ${c.text};
  }
`;

export const ModalBody = styled.div`
  flex: 1;
  display: flex;
  overflow: hidden;
`;

export const Sidebar = styled.div`
  width: 280px;
  border-right: 1px solid ${c.borderLight};
  overflow-y: auto;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex-shrink: 0;
`;

export const LocationItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px;
  border-radius: 12px;
  cursor: pointer;
  border: 1px solid ${({ $active }) => ($active ? c.primaryBorder : "transparent")};
  background: ${({ $active }) => ($active ? c.primaryLighter : "transparent")};
  transition: 0.15s ease;

  &:hover {
    background: ${({ $active }) => ($active ? c.primaryLighter : c.backgroundHover)};
    border-color: ${({ $active }) => ($active ? c.primaryBorder : c.borderLight)};
  }
`;

export const LocationPin = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: ${({ $active }) => ($active ? c.primaryLight : c.surfaceHover)};
  color: ${({ $active }) => ($active ? c.primary : c.textMuted)};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  flex-shrink: 0;
  margin-top: 1px;
`;

export const LocationInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
`;

export const LocationAddress = styled.span`
  font-size: 13px;
  font-weight: ${({ $active }) => ($active ? "600" : "400")};
  color: ${({ $active }) => ($active ? c.text : c.textPrimary)};
  line-height: 1.4;
`;

export const PrimaryBadge = styled.span`
  font-size: 10px;
  font-weight: 600;
  color: ${c.primary};
  background: ${c.primaryLight};
  padding: 2px 8px;
  border-radius: 999px;
  width: fit-content;
`;

export const MapWrapper = styled.div`
  flex: 1;
  position: relative;

  .leaflet-container {
    position: absolute;
    inset: 0;
    height: 100% !important;
    width: 100% !important;
  }
`;

export const MapContainerWrapper = styled.div`
  position: relative;
  height: 360px;

  .leaflet-container {
    position: absolute;
    inset: 0;
    height: 100% !important;
    width: 100% !important;
  }

  .leaflet-top,
  .leaflet-bottom {
    z-index: 500;
  }
`;

export const DropdownWrapper = styled.div`
  position: absolute;
  bottom: 12px;
  left: 12px;
  right: 12px;
  z-index: 1000;
`;

export const DropdownSelected = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  border-radius: 12px;
  border: 1px solid ${c.border};
  background: ${c.background};
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: ${c.text};
  user-select: none;
`;

export const DropdownList = styled.div`
  position: absolute;
  bottom: calc(100% + 6px);
  left: 0;
  right: 0;
  background: ${c.background};
  border: 1px solid ${c.border};
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
`;

export const DropdownItem = styled.div`
  padding: 10px 14px;
  font-size: 14px;
  cursor: pointer;
  color: ${({ $active }) => ($active ? c.text : c.textSecondary)};
  font-weight: ${({ $active }) => ($active ? "600" : "400")};
  background: ${({ $active }) => ($active ? c.backgroundHover : c.background)};

  &:hover {
    background: ${c.surfaceHover};
    color: ${c.text};
  }

  &:not(:last-child) {
    border-bottom: 1px solid ${c.borderLight};
  }
`;