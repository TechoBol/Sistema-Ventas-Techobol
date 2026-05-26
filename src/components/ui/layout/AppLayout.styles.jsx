import styled from "styled-components";
import { theme } from "../Theme";

export const LayoutWrapper = styled.div`
  min-height: 100dvh;
  min-width: 300px;
  display: grid;
  grid-template-columns: ${({ $isCollapsed }) =>
    $isCollapsed ? "76px 1fr" : "260px 1fr"};
  background: ${theme.colors.background};

  transition: grid-template-columns 0.25s ease;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const MainWrapper = styled.main`
  min-width: 0;
  height: 100dvh;
  overflow: auto;
`;

export const ContentWrapper = styled.div`
  padding: 12px 28px;

  @media (max-width: 768px) {
    padding: 18px 16px;
  }
`;

export const MobileOverlay = styled.div`
  display: none;

  @media (max-width: 900px) {
    display: block;
    position: fixed;
    inset: 0;
    z-index: 20;
    background: #ffffff;
  }
`;
