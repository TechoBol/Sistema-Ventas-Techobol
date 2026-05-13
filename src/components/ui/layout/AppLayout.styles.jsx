import styled from "styled-components";
import { theme } from "../Theme";

export const LayoutWrapper = styled.div`
  min-height: 100dvh;
  display: grid;
  grid-template-columns: 260px 1fr;
  background: ${theme.colors.background};

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
  padding: 24px 28px;

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
    background: rgba(17, 42, 15, 0.35);
  }
`;
