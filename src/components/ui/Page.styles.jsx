import styled from "styled-components";
import { theme } from "./Theme";

export const PageSurface = styled.section`
  width: 100%;
  min-height: calc(100dvh - 90px);
  padding: 28px 32px;
  box-sizing: border-box;

  @media (max-width: 900px) {
    padding: 28px 20px;
  }
`;

export const PageWrapper = styled.div`
  width: 100%;
`;

// titulo y fecha
export const HeaderTitle = styled.header`
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-bottom: 22px;
`;

export const Title = styled.h1`
  margin: 0;
  font-size: 26px;
  font-weight: 700;
  color: ${theme.colors.text};
`;

export const Subtitle = styled.p`
  font-size: 13px;
  color: ${theme.colors.textSecondary};
  margin: 0;
`;

// buscador
export const SearchBox = styled.div`
  width: 320px;
  height: 42px;
  padding: 0 16px;
  //margin-bottom: 24px;

  border-radius: 22px;
  background: ${theme.colors.background};
  color: ${theme.colors.textMuted};

  display: flex;
  align-items: center;
  gap: 10px;

  box-shadow: 0 6px 16px rgba(15, 23, 42, 0.04);

  @media (max-width: 700px) {
    width: 100%;
  }
`;

export const SearchInput = styled.input`
  width: 100%;
  border: none;
  outline: none;
  background: transparent;

  font-size: 14px;
  color: ${theme.colors.textPrimary};

  &::placeholder {
    color: ${theme.colors.textMuted};
  }
`;

export const ErrorMessage = styled.p`
  margin: 0 0 16px;
  color: ${theme.colors.error};
  font-weight: 600;
`;

/* =========================================================
   TOOLBAR / FILTER BUTTONS
========================================================= */

export const Toolbar = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;

  @media (max-width: 700px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const FilterButtonGroup = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;

  overflow-x: auto;
  overflow-y: hidden;
  padding: 4px 0 12px;
  margin-bottom: 20px;
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

export const FilterButton = styled.button`
  height: 40px;
  padding: 0 16px;
  border: none;
  border-radius: 20px;

  background: ${({ $active }) => $active ? "rgba(242, 12, 31, 0.10)" : theme.colors.background};
  color: ${({ $active }) => $active ? theme.colors.primary : theme.colors.textSecondary};
  font-size: 13px;
  font-weight: 700;

  white-space: nowrap;
  flex: 0 0 auto;
  cursor: pointer;
  transition: all 0.18s ease;
  box-shadow: 0 6px 16px rgba(15, 23, 42, 0.04);

  &:hover {
    color: ${theme.colors.primary};
    background: rgba(242, 12, 31, 0.08);
    transform: translateY(-1px);
  }
`;

export const PrimaryActionButton = styled.button`
  height: 42px;
  padding: 0 16px;

  border: none;
  border-radius: 22px;

  background: ${theme.colors.primary};
  color: ${theme.colors.background};

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  font-size: 14px;
  font-weight: 700;

  cursor: pointer;
  transition: all 0.18s ease;

  box-shadow: 0 10px 24px rgba(17, 24, 39, 0.12);

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 14px 30px rgba(17, 24, 39, 0.16);
  }

  &:active {
    transform: scale(0.98);
  }

  @media (max-width: 700px) {
    width: 100%;
  }
`;

/* =========================================================
   STATUS
========================================================= */

export const StatusBadge = styled.span`
  min-width: 88px;
  height: 28px;
  padding: 0 12px;

  border-radius: 999px;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  font-size: 12px;
  font-weight: 700;
  text-transform: capitalize;

  color: ${({ $status }) => {
    if ($status === "aprobado") return "#047857";
    if ($status === "rechazado") return "#dc2626";
    return "#b45309";
  }};

  background: ${({ $status }) => {
    if ($status === "aprobado") return "rgba(105, 213, 132, 0.18)";
    if ($status === "rechazado") return "rgba(220, 101, 95, 0.16)";
    return "rgba(245, 158, 11, 0.16)";
  }};
`;

/* =========================================================
   BRANDS
========================================================= */

export const BrandLinesCell = styled.div`
  width: 100%;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: nowrap;
  overflow: hidden;
`;

export const BrandLineChip = styled.span`
  max-width: 140px;
  height: 26px;
  padding: 0 10px;

  border-radius: 5px;
  background: ${({ $match }) => $match ? "rgba(242, 12, 31, 0.16)" : "rgba(242, 12, 31, 0.08)"};
  color: ${theme.colors.primary};

  display: inline-flex;
  align-items: center;
  font-size: 12px;
  font-weight: ${({ $match }) => ($match ? 700 : 550)};

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  flex-shrink: 0;
`;

export const BrandMoreButton = styled.button`
  min-height: 28px;
  padding: 0 12px;
  border: none;
  border-radius: 5px;

  background: #f3f4f6;
  color: ${theme.colors.textSecondary};

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  font-size: 12px;
  font-weight: 700;

  cursor: pointer;
  transition: all 0.18s ease;

  flex-shrink: 0;

  &:hover {
    background: #e9edf3;
    color: ${theme.colors.primary};
  }
`;

export const BrandPopoverContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const BrandPopoverTitle = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: ${theme.colors.text};
`;

export const BrandPopoverList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const BrandPopoverItem = styled.span`
  font-size: 13px;
  font-weight: ${({ $match }) => ($match ? 700 : 500)};
  color: ${({ $match }) => $match ? theme.colors.primary : theme.colors.textSecondary};

  line-height: 1.4;
  padding: ${({ $match }) => ($match ? "4px 8px" : "0")};
  border-radius: 8px;
  background: ${({ $match }) => $match ? "rgba(242, 12, 31, 0.08)" : "transparent"};
`;
