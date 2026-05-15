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

export const ErrorMessage = styled.p`
  margin: 0 0 16px;
  color: ${theme.colors.error};
  font-weight: 600;
`;
