import styled from "styled-components";
import { theme } from "./Theme";

export const PageSurface = styled.section`
  width: 100%;
  min-height: calc(100dvh - 90px);
  background: ${theme.colors.backgroundSoft};
  padding: 42px 48px;
  box-sizing: border-box;

  @media (max-width: 900px) {
    padding: 28px 20px;
  }
`;

export const PageWrapper = styled.div`
  width: 100%;
`;

// titulo y fecha
export const PageHeader = styled.header`
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
  margin-bottom: 24px;

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

export const CustomerName = styled.span`
  font-weight: 600;
  color: #06132b;
`;

export const CustomerCode = styled.span`
  color: #7f91b1;
  font-weight: 500;
`;

export const ActionsGroup = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

export const IconButton = styled.button`
  width: 34px;
  height: 34px;

  border: 1px solid #edf0f5;
  border-radius: 50%;
  background: ${theme.colors.background};
  color: #30425f;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;

  transition:
    color 0.18s ease,
    background 0.18s ease,
    border-color 0.18s ease,
    transform 0.18s ease;

  &:hover {
    color: ${theme.colors.primary};
    background: #fff3f4;
    border-color: #ffd2d6;
    transform: translateY(-1px);
  }

  &:active {
    transform: scale(0.96);
  }
`;

export const LocationButton = styled(IconButton)`
  color: ${({ $active }) => ($active ? theme.colors.primary : "#9cabc1")};
  background: ${({ $active }) => ($active ? "#fff3f4" : "#f8fafc")};
  border-color: ${({ $active }) => ($active ? "#ffd2d6" : "#edf0f5")};
  opacity: ${({ $active }) => ($active ? 1 : 0.7)};
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};

  &:hover {
    color: ${({ $active }) => ($active ? theme.colors.primary : "#9cabc1")};
    background: ${({ $active }) => ($active ? "#fff3f4" : "#f8fafc")};
    border-color: ${({ $active }) => ($active ? "#ffd2d6" : "#edf0f5")};
    transform: ${({ disabled }) => (disabled ? "none" : "translateY(-1px)")};
  }
`;
