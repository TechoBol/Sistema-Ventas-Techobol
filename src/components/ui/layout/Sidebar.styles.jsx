import styled from "styled-components";
import { theme } from "../Theme";

export const SidebarWrapper = styled.aside`
  height: 100dvh;
  background: ${theme.colors.background};
  border-right: 1px solid #eeeeee;
  padding: ${({ $isCollapsed }) =>
    $isCollapsed ? "20px 10px" : "24px 16px"};
  box-sizing: border-box;

  display: flex;
  flex-direction: column;

  position: sticky;
  top: 0;
  z-index: 30;

  transition:
    width 0.25s ease,
    padding 0.25s ease;

  @media (max-width: 900px) {
    position: fixed;
    left: 0;
    top: 0;
    width: 260px;
    padding: 24px 16px;

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
  justify-content: ${({ $isCollapsed }) =>
    $isCollapsed ? "center" : "space-between"};
  gap: 8px;

  @media (max-width: 900px) {
    justify-content: space-between;
  }
`;

export const Brand = styled.div`
  display: flex;
  align-items: center;
  min-width: 0;
`;

export const BrandText = styled.h2`
  font-size: 25px;
  margin: 0;
  color: ${theme.colors.primary};
  white-space: nowrap;
`;

export const CollapseButton = styled.button`
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

  &:hover {
    background: #fff3eb;
    color: ${theme.colors.primary};
  }

  @media (max-width: 900px) {
    display: none;
  }
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
  margin-top: ${({ $isCollapsed }) =>
    $isCollapsed ? "28px" : "34px"};

  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;

  padding-right: ${({ $isCollapsed }) =>
    $isCollapsed ? "0" : "4px"};

  /* Firefox */
  scrollbar-width: thin;
  scrollbar-color: rgba(148, 163, 184, 0.35) transparent;

  /* Chrome / Edge */
  &::-webkit-scrollbar {
    width: 4px;
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

  @media (max-width: 900px) {
    padding-right: 4px;
  }
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
  padding: ${({ $isCollapsed }) =>
    $isCollapsed ? "0" : "0 12px"};
  border-radius: 10px;

  background: ${({ $active }) =>
    $active ? "#fff3eb" : "transparent"};

  color: ${({ $active }) =>
    $active ? theme.colors.primary : "#334155"};

  display: flex;
  align-items: center;
  justify-content: ${({ $isCollapsed }) =>
    $isCollapsed ? "center" : "flex-start"};
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

  @media (max-width: 900px) {
    padding: 0 12px;
    justify-content: flex-start;
  }
`;

export const NavItemText = styled.span`
  white-space: nowrap;
`;
