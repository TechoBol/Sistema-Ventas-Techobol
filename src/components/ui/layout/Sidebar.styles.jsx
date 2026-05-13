import styled from "styled-components";
import { theme } from "../Theme";

export const SidebarWrapper = styled.aside`
  height: 100dvh;
  background: ${theme.colors.background};
  border-right: 1px solid #eeeeee;
  padding: 24px 16px;
  box-sizing: border-box;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  position: sticky;
  top: 0;
  z-index: 30;

  @media (max-width: 900px) {
    position: fixed;
    left: 0;
    top: 0;
    width: 260px;
    transform: ${({ $isOpen }) =>
      $isOpen ? "translateX(0)" : "translateX(-100%)"};
    transition: transform 0.25s ease;
    box-shadow: ${({ $isOpen }) =>
      $isOpen ? "8px 0 24px rgba(15, 23, 42, 0.16)" : "none"};
  }
`;

export const SidebarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const Brand = styled.div`
  display: flex;
  align-items: center;
`;

export const BrandText = styled.h2`
  font-size: 25px;
  margin: 0;
  color: ${theme.colors.primary};
`;

export const CloseButton = styled.button`
  display: none;

  @media (max-width: 900px) {
    width: 34px;
    height: 34px;
    border: none;
    border-radius: 10px;
    background: ${theme.colors.surface};
    color: ${theme.colors.text};

    display: flex;
    align-items: center;
    justify-content: center;

    cursor: pointer;
  }
`;

export const NavContent = styled.nav`
  margin-top: 34px;
  flex: 1;
  overflow-y: auto;
`;

export const NavSection = styled.div`
  margin-bottom: 22px;
`;

export const SectionTitle = styled.p`
  margin: 0 0 8px;
  font-size: 11px;
  font-weight: 700;
  color: ${theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

export const NavItem = styled.div`
  width: 100%;
  height: 40px;
  padding: 0 12px;
  border-radius: 10px;

  background: ${({ $active }) =>
    $active ? "#fff3eb" : "transparent"};

  color: ${({ $active }) =>
    $active ? theme.colors.primary : "#334155"};

  display: flex;
  align-items: center;
  gap: 10px;

  font-size: 14px;
  font-weight: 600;
  text-align: left;

  cursor: pointer;
  transition: 0.2s;

  &:hover {
    background: #fff7f0;
    color: ${theme.colors.primary};
  }
`;
