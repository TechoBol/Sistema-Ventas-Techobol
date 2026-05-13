import styled from "styled-components";
import { theme } from "../Theme";

export const TopbarWrapper = styled.header`
  height: 64px;
  padding: 0 28px;
  background: ${theme.colors.background};

  display: flex;
  align-items: center;
  justify-content: space-between;

  position: sticky;
  top: 0;
  z-index: 10;

  @media (max-width: 768px) {
    height: 58px;
    padding: 0 16px;
  }
`;

export const LeftActions = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
`;

export const MenuButton = styled.button`
  display: none;

  @media (max-width: 900px) {
    width: 40px;
    height: 40px;
    border: none;
    border-radius: 12px;
    background: ${theme.colors.background};
    color: ${theme.colors.text};

    display: flex;
    align-items: center;
    justify-content: center;

    cursor: pointer;
  }
`;

export const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;

  @media (max-width: 480px) {
    gap: 8px;
  }
`;

export const IconButton = styled.button`
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background: ${theme.colors.background};
  color: ${theme.colors.text};

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;
`;

export const UserProfile = styled.button`
  border: none;
  background: transparent;
  padding: 0;

  display: flex;
  align-items: center;
  gap: 10px;

  cursor: pointer;

  @media (max-width: 600px) {
    gap: 6px;
  }
`;

export const Avatar = styled.div`
  width: 38px;
  height: 38px;
  border-radius: 50%;

  background: ${theme.colors.background};
  border: 1px solid rgba(0, 0, 0, 0.12);
  color: ${theme.colors.text};

  display: flex;
  align-items: center;
  justify-content: center;

  flex: 0 0 auto;
`;

export const UserText = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  @media (max-width: 600px) {
    display: none;
  }
`;

export const UserName = styled.p`
  margin: 0;
  font-size: 13px;
  font-weight: 700;
  color: ${theme.colors.text};
`;

export const UserRole = styled.span`
  font-size: 12px;
  color: ${theme.colors.textSecondary};
`;
