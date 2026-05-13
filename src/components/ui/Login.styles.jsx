import styled from "styled-components";
import { theme } from "./Theme";

export const Wrapper = styled.div`
  min-height: 100dvh;
  position: relative;
  overflow: hidden;
  background: ${theme.colors.background};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  box-sizing: border-box;

  &::before {
    content: "";
    position: absolute;
    left: -24.3%;
    bottom: -7%;
    width: 85%;
    height: 75%;
    background: ${theme.colors.primary};
    transform: rotate(-20deg);
    border-radius: 10px;
    z-index: 0;
  }

  @media (max-width: 768px) {
    padding: 20px;
    &::before {
      left: -45%;
      bottom: -20%;
      width: 130%;
      height: 55%;
      transform: rotate(-12deg);
    }
  }
`;

export const Brand = styled.h1`
  position: absolute;
  top: 24px;
  left: 48px;
  margin: 0;
  color: ${theme.colors.primary};
  font-size: 30px;
  font-weight: 800;
  z-index: 1;

  @media (max-width: 768px) {
    left: 24px;
    font-size: 26px;
  }
`;

export const Card = styled.div`
  position: relative;
  z-index: 1;

  width: 100%;
  max-width: 450px;
  min-height: 355px;

  display: flex;
  flex-direction: column;
  justify-content: center;

  background: ${theme.colors.background};
  border-radius: 16px;
  padding: 44px 72px 32px;

  box-sizing: border-box;

  box-shadow:
    0 10px 18px rgba(0, 0, 0, 0.22),
    0 0 0 1px rgba(0, 0, 0, 0.08);

  @media (max-width: 768px) {
    max-width: 420px;
    padding: 36px 28px 30px;
  }

  @media (max-width: 480px) {
    padding: 32px 22px 28px;
    border-radius: 14px;
  }
`;

export const Logo = styled.h1`
  text-align: center;
  color: ${theme.colors.primary};
  font-family: var(--font-title);
  font-size: 45px;
  font-weight: 700;
  margin: 0 0 30px;
`;

export const Title = styled.h2`
  text-align: center;
  font-size: 28px;
  font-weight: 800;
  color: ${theme.colors.text};
  margin: 0 0 28px;

  @media (max-width: 480px) {
    font-size: 24px;
  }
`;

export const Subtitle = styled.p`
  text-align: center;
  font-size: 14px;
  color: ${theme.colors.text};
  margin-bottom: 10px;
  margin-top: 20px;
`;

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
`;

export const Label = styled.label`
  font-size: 14px;
  margin-bottom: 6px;
  text-align: left;
  color: ${theme.colors.text};
  font-weight: 500;
`;

export const Input = styled.input`
  width: 100%;
  height: 40px;
  padding: 0 42px 0 12px;

  background: ${theme.colors.background};
  border: 1px solid rgba(0, 0, 0, 0.35);
  border-radius: 12px;

  font-size: 14px;
  color: ${theme.colors.text};

  outline: none;
  box-sizing: border-box;

  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;

  &::placeholder {
    color: rgba(0, 0, 0, 0.45);
  }

  &:focus {
    border-color: ${theme.colors.text};
    box-shadow: 0 0 0 3px rgba(122, 121, 121, 0.12);
  }

  /* Quita el ojito nativo de Edge */
  &::-ms-reveal,
  &::-ms-clear {
    display: none;
  }
`;

export const PasswordWrapper = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
`;

export const IconWrapper = styled.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);

  border: none;
  background: transparent;
  padding: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  color: rgba(0, 0, 0, 0.55);
  cursor: pointer;
`;

export const Button = styled.button`
  width: 100%;
  height: 40px;
  margin-top: 12px;

  background-color: ${theme.colors.primary};
  color: ${theme.colors.background};

  border: none;
  border-radius: 12px;

  font-size: 15px;
  font-weight: 700;

  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    opacity 0.2s ease;

  box-shadow: 0 5px 8px rgba(0, 0, 0, 0.2);

  &:hover {
    opacity: 0.95;
    transform: translateY(-1px);
  }

  &:active {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
    transform: none;
  }
`;

export const LinkText = styled.p`
  text-align: center;
  font-size: 14px;
  margin-top: 10px;
`;