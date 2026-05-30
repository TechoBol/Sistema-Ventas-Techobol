import styled from "styled-components";

const red = "#c0392b";
const border = "#e2e8f0";
const textPrimary = "#0f172a";
const textSecondary = "#64748b";
const textMuted = "#94a3b8";
const white = "#ffffff";

export const FormPageCard = styled.section`
  width: 100%;
  background: ${white};
  border-radius: 22px;
  padding: 32px;
  box-sizing: border-box;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.04);

  @media (max-width: 900px) {
    padding: 20px;
    border-radius: 18px;
  }
`;

export const FormHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 28px;
`;

export const BackButton = styled.button`
  width: 38px;
  height: 38px;
  border: none;
  border-radius: 50%;
  background: #f1f5f9;
  color: ${textSecondary};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #fff3f4;
    color: ${red};
  }
`;

export const FormTitle = styled.h2`
  margin: 0;
  font-size: 22px;
  font-weight: 800;
  color: ${textPrimary};
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const FormSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const SectionTitle = styled.h3`
  margin: 0;
  font-size: 12px;
  font-weight: 700;
  color: ${textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const FieldsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(${({ $columns }) => $columns || 2}, 1fr);
  gap: 20px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;
`;

export const Label = styled.label`
  font-size: 12px;
  font-weight: 700;
  color: ${textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const FieldHint = styled.span`
  font-size: 11px;
  color: ${textMuted};
`;

export const Input = styled.input`
  width: 100%;
  height: 46px;
  border-radius: 12px;
  border: 1px solid ${border};
  background: ${white};
  padding: 0 16px;
  font-size: 14px;
  color: ${textPrimary};
  outline: none;
  box-sizing: border-box;
  transition: all 0.2s ease;

  &::placeholder {
    color: ${textMuted};
  }

  &:focus {
    border-color: ${red};
    box-shadow: 0 0 0 4px rgba(192, 57, 43, 0.08);
  }
`;

export const SelectWrapper = styled.div`
  position: relative;
`;

export const Select = styled.select`
  width: 100%;
  height: 46px;
  border-radius: 12px;
  border: 1px solid ${border};
  background: ${white};
  padding: 0 44px 0 16px;
  font-size: 14px;
  color: ${({ value }) => (value ? textPrimary : textMuted)};
  outline: none;
  appearance: none;
  cursor: pointer;
  box-sizing: border-box;
  transition: all 0.2s ease;

  &:focus {
    border-color: ${red};
    box-shadow: 0 0 0 4px rgba(192, 57, 43, 0.08);
  }

  option { color: ${textPrimary}; }
`;

export const SelectIcon = styled.span`
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: ${textSecondary};
  pointer-events: none;
  display: flex;
  align-items: center;
`;

export const PhoneWrapper = styled.div`
  display: flex;
`;

export const PhoneFlagPrefix = styled.span`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 12px;
  height: 46px;
  background: #f1f5f9;
  border: 1px solid ${border};
  border-right: none;
  border-radius: 12px 0 0 12px;
  flex-shrink: 0;
  font-size: 20px;
  color: ${textSecondary};
  font-weight: 600;
  box-sizing: border-box;
`;

export const PhoneInput = styled(Input)`
  border-radius: 0 12px 12px 0;
  border-left: none;
`;

export const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-top: 20px;
  border-top: 1px solid #f1f5f9;
  margin-top: 8px;
`;

export const SaveButton = styled.button`
  height: 48px;
  padding: 0 32px;
  border: none;
  border-radius: 12px;
  background: ${red};
  color: ${white};
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 6px 20px rgba(192, 57, 43, 0.25);
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 24px rgba(192, 57, 43, 0.3);
    filter: brightness(1.05);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
    filter: none;
  }
`;