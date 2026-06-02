import styled from "styled-components";
import { theme } from "../Theme";

export const SidebarWrapper = styled.aside`
  height: 100dvh;
  background: ${theme.colors.background};
  border-right: 1px solid #eeeeee;
  padding: ${({ $isCollapsed }) => ($isCollapsed ? "20px 10px" : "24px 16px")};
  box-sizing: border-box;

  display: flex;
  flex-direction: column;

  position: sticky;
  top: 0;
  z-index: 30;

  transition: width 0.25s ease, padding 0.25s ease;

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
    $isCollapsed ? "flex-start" : "space-between"};
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

  margin-left: ${({ $isCollapsed }) => ($isCollapsed ? "0px" : "0")};

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
  margin-top: ${({ $isCollapsed }) => ($isCollapsed ? "28px" : "34px")};

  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;

  padding-right: ${({ $isCollapsed }) => ($isCollapsed ? "0" : "4px")};

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
  margin-bottom: 2px;
  padding: ${({ $isCollapsed }) => ($isCollapsed ? "0" : "0 12px")};
  border-radius: 10px;
  border: none;
  background: ${({ $active }) => ($active ? "#fff3eb" : "transparent")};

  color: ${({ $active }) => ($active ? theme.colors.primary : "#334155")};

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

// SUB-MENU
export const ToggleIcon = styled.span`
  margin-left: auto;

  display: flex;
  align-items: center;
  justify-content: center;

  transition: transform 0.2s ease;
  transform: ${({ $isOpen }) => ($isOpen ? "rotate(180deg)" : "rotate(0deg)")};
`;

export const SubNavList = styled.div`
  margin: 6px 0 8px 18px;
  padding-left: 14px;

  display: flex;
  flex-direction: column;
  gap: 4px;

  border-left: 2px solid rgba(148, 163, 184, 0.18);
`;

export const SubNavItem = styled.div`
  width: 100%;
  height: 36px;
  padding: 0 14px;
  box-sizing: border-box;

  border-radius: 10px;
  display: flex;
  align-items: center;
  font-size: 13px;
  font-weight: 600;

  color: ${({ $active }) => ($active ? theme.colors.primary : "#425065")};

  background: ${({ $active }) =>
    $active ? "rgba(242, 12, 31, 0.08)" : "transparent"};

  cursor: pointer;
  transition: 0.2s;

  &:hover {
    color: ${theme.colors.primary};
    background: rgba(242, 12, 31, 0.06);
  }
`;

export const SubNavItemText = styled.span`
  white-space: nowrap;
`;

export const BranchSelectorWrapper = styled.div`
  position: relative;
  width: 100%;
`;

export const BranchSelectorButton = styled.button`
  width: 100%;
  border: none;
  background: transparent;
  padding: 0;
  cursor: pointer;

  display: flex;
  flex-direction: column;
  align-items: flex-start;

  text-align: left;
`;

export const ActiveBranchRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: ${theme.colors.primary};
  margin-top: 2px;
`;

export const ActiveBranchText = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: ${theme.colors.primary};

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const BranchDropdownIcon = styled.div`
  display: flex;
  align-items: center;
  color: ${theme.colors.textSecondary};
`;

export const BranchDropdown = styled.div`
  position: absolute;
  top: calc(100% + 12px);
  left: 0;

  width: 260px;

  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 14px;

  overflow: hidden;

  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.12),
    0 2px 8px rgba(15, 23, 42, 0.08);

  z-index: 999;
`;

export const BranchDropdownHeader = styled.div`
  padding: 12px 16px;

  font-size: 11px;
  font-weight: 700;

  text-transform: uppercase;
  letter-spacing: 0.05em;

  color: ${theme.colors.textSecondary};

  background: #fafafa;
  border-bottom: 1px solid #eeeeee;
`;

export const BranchOption = styled.div`
  padding: 12px 16px;

  display: flex;
  flex-direction: column;
  gap: 4px;

  cursor: pointer;
  transition: all 0.2s ease;

  background: ${({ $active }) => ($active ? "#fff3eb" : "transparent")};

  &:hover {
    background: #fff7f0;
  }

  &:not(:last-child) {
    border-bottom: 1px solid #f5f5f5;
  }
`;

export const BranchOptionTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const BranchName = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #0f172a;
`;

export const BranchCode = styled.span`
  font-size: 12px;
  color: #64748b;
`;

export const BranchBadge = styled.span`
  font-size: 10px;
  font-weight: 700;

  color: ${theme.colors.primary};

  text-transform: uppercase;
`;
