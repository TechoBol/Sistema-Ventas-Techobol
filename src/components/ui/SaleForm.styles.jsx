  import styled from "styled-components";
  import { theme } from "./Theme";

  export const SaleCard = styled.section`
    width: 100%;
    max-width: 1400px;
    background: #ffffff;
    border-radius: 22px;
    padding: 32px;
    box-sizing: border-box;
    box-shadow: 0 10px 30px rgba(15, 23, 42, 0.04);

    /* ── Variables de Color Dinámicas por Modo (Se mantienen intactas) ── */
    &.mode-venta {
      --form-primary: #fb0404;      /* Tu Rojo original */
      --form-gradient: #dc2626;
      --form-shadow: rgba(251, 4, 4, 0.2);
      --form-hover-bg: #fff3f4;
    }
    &.mode-cotizacion {
      --form-primary: #2563eb;   /* Azul */
      --form-gradient: #1d4ed8;
      --form-shadow: rgba(37, 99, 235, 0.2);
      --form-hover-bg: #eff6ff;
    }
    &.mode-reserva {
      --form-primary: #d97706;   /* Naranja */
      --form-gradient: #b45309;
      --form-shadow: rgba(217, 119, 6, 0.2);
      --form-hover-bg: #fffbeb;
    }

    @media (max-width: 992px) {
      padding: 20px;
      border-radius: 18px;
    }
  `;

  export const Header = styled.div`
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 24px;
  `;

  export const BackButton = styled.button`
    width: 38px;
    height: 38px;
    border: none;
    border-radius: 50%;
    background: #f1f5f9;
    color: #64748b;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: var(--form-hover-bg);
      color: var(--form-primary);
    }
  `;

  export const Title = styled.h2`
    margin: 0;
    font-size: 22px;
    font-weight: 800;
    color: #0f172a;
  `;

  /* ── NUEVO: Contenedor que divide la pantalla en 2 columnas asimétricas ── */
  export const MainContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr 380px; /* Formulario amplio / Panel lateral compacto */
    gap: 40px;
    align-items: start;

    @media (max-width: 992px) {
      grid-template-columns: 1fr; /* Se apila en pantallas medianas/móviles */
      gap: 24px;
    }
  `;

  export const LeftColumn = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
  `;

  export const RightColumn = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
    position: sticky;
    top: 20px; /* Se queda fijo si el formulario de la izquierda es muy largo */
  `;

  /* ── MODIFICADO: Ahora es la tarjeta flotante de la derecha ── */
  export const TotalCard = styled.div`
    background: linear-gradient(135deg, var(--form-primary) 0%, var(--form-gradient) 100%);
    border-radius: 20px;
    padding: 24px;
    color: white;
    box-shadow: 0 10px 25px var(--form-shadow);
    transition: all 0.3s ease;
  `;

  export const TotalLabel = styled.div`
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    opacity: 0.85;
    font-weight: 700;
  `;

  export const TotalValue = styled.div`
    font-size: 38px;
    font-weight: 800;
    margin-top: 4px;
  `;

  export const PaymentInfo = styled.div`
    display: flex;
    flex-direction: column;
    gap: 6px;
  `;

  export const PaymentLabel = styled.span`
    font-size: 11px;
    font-weight: 700;
    opacity: 0.85;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  `;

  export const PaymentBadge = styled.div`
    padding: 10px 14px;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.1);
    font-size: 14px;
    font-weight: 600;
    color: white;
  `;

  export const FormGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;

    @media (max-width: 576px) {
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
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  `;

  export const Input = styled.input`
    width: 100%;
    height: 46px;
    border-radius: 12px;
    border: 1px solid #e2e8f0;
    background: #ffffff;
    padding: 0 16px;
    font-size: 14px;
    color: #0f172a;
    outline: none;
    box-sizing: border-box;
    transition: all 0.2s ease;

    &::placeholder {
      color: #94a3b8;
    }

    &:focus {
      border-color: var(--form-primary);
      background: #ffffff;
      box-shadow: 0 0 0 4px var(--form-shadow);
    }
  `;

  export const AddressWrapper = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
    position: relative;
  `;

  export const LocationButton = styled.button`
    position: absolute;
    right: 8px;
    width: 34px;
    height: 34px;
    border-radius: 8px;
    border: #ffffff;
    background: #ffffff;
    color: var(--form-primary);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
  `;

  /* ── DROPDOWN DE CLIENTES ── */
  export const CustomerDropdown = styled.div`
    position: absolute;
    top: calc(100% + 6px);
    left: 0;
    width: 100%;
    max-height: 280px;
    overflow-y: auto;
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0 12px 30px rgba(15, 23, 42, 0.12);
    z-index: 100;
    border: 1px solid #e2e8f0;
  `;

  export const CustomerHeader = styled.div`
    display: flex;
    align-items: center;
    padding: 10px 16px;
    border-bottom: 1px solid #e2e8f0;
    background: #f8fafc;
    position: sticky;
    top: 0;
    z-index: 2;
  `;

  export const CustomerItem = styled.div`
    display: flex;
    align-items: center;
    padding: 12px 16px;
    cursor: pointer;
    transition: background 0.15s ease;

    &:hover {
      background: var(--form-hover-bg);
    }
  `;

  export const CustomerCode = styled.span`
    width: 100px;
    flex-shrink: 0;
    font-size: 13px;
    color: #94a3b8;
  `;

  export const CustomerName = styled.span`
    font-size: 14px;
    font-weight: 500;
    color: #0f172a;
  `;

  export const CustomerHeaderCode = styled.span`
    width: 100px;
    font-size: 11px;
    font-weight: 700;
    color: #64748b;
  `;

  export const CustomerHeaderName = styled.span`
    font-size: 11px;
    font-weight: 700;
    color: #64748b;
  `;

  export const CustomerEmpty = styled.div`
    padding: 24px;
    text-align: center;
    font-size: 14px;
    color: #94a3b8;
  `;

  export const AddressSelect = styled.select`
    width: 100%;
    height: 46px;
    border-radius: 12px;
    border: 1px solid #e2e8f0;
    background: #ffffff;
    padding: 0 16px;
    font-size: 14px;
    color: #0f172a;
    outline: none;
    cursor: pointer;
    transition: all 0.2s ease;

    &:focus {
      border-color: var(--form-primary);
      box-shadow: 0 0 0 4px var(--form-shadow);
    }
  `;

  /* ── BOX DE FACTURACIÓN (Actualizado con estilo de la imagen) ── */
  export const InvoiceBox = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 18px;
    border-radius: 16px;
    background: #ffffff;
    border: 1px solid #e2e8f0;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      border-color: #cbd5e1;
    }
  `;

  export const InvoiceInfo = styled.div`
    display: flex;
    flex-direction: column;
  `;

  export const InvoiceTitle = styled.span`
    font-size: 14px;
    font-weight: 700;
    color: #1e293b;
  `;

  export const InvoiceSubtitle = styled.span`
    font-size: 12px;
    color: #64748b;
  `;

  /* ── SWITCH SLIDER ── */
  export const SwitchWrapper = styled.label`
    position: relative;
    width: 50px;
    height: 28px;
    display: inline-block;
    cursor: pointer;
  `;

  export const SwitchInput = styled.input`
    opacity: 0;
    width: 0;
    height: 0;

    &:checked + span {
      background: linear-gradient(135deg, var(--form-primary) 0%, var(--form-gradient) 100%);
    }

    &:checked + span:before {
      transform: translateX(22px);
    }
  `;

  export const SwitchSlider = styled.span`
    position: absolute;
    inset: 0;
    background: #cbd5e1;
    border-radius: 999px;
    transition: 0.2s ease;

    &:before {
      content: "";
      position: absolute;
      width: 20px;
      height: 20px;
      left: 4px;
      top: 4px;
      background: white;
      border-radius: 50%;
      transition: 0.2s ease;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
    }
  `;

  /* ── NUEVO: Estado del tipo de operación (Debajo del TotalCard) ── */
  export const StatusBox = styled.div`
    display: flex;
    gap: 12px;
    padding: 16px;
    border-radius: 16px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
  `;

  /* ── BANCOS ── */
  export const BankSelectWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
  `;

  export const BankSelectLabel = styled.label`
    font-size: 12px;
    font-weight: 700;
    color: #64748b;
    text-transform: uppercase;
  `;

  export const BankSelect = styled.select`
    width: 100%;
    height: 46px;
    border-radius: 12px;
    border: 1px solid #e2e8f0;
    background: #ffffff;
    padding: 0 16px;
    font-size: 14px;
    outline: none;
    cursor: pointer;
    transition: all 0.2s ease;

    &:focus {
      border-color: var(--form-primary);
      box-shadow: 0 0 0 4px var(--form-shadow);
    }
  `;

  /* ── FOOTER E INFO INFERIOR ── */
  export const Footer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 32px;
    padding-top: 20px;
    border-top: 1px solid #f1f5f9;

    @media (max-width: 768px) {
      flex-direction: column;
      gap: 16px;
      align-items: stretch;
    }
  `;

  export const NotificationBox = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    color: #64748b;
    font-size: 13px;
    font-weight: 500;
  `;

  export const FinishButton = styled.button`
    height: 48px;
    padding: 0 32px;

    display: flex;
    align-items: center;
    justify-content: center;

    border: none;
    border-radius: 12px;

    background: linear-gradient(
      135deg,
      var(--form-primary) 0%,
      var(--form-gradient) 100%
    );

    color: white;
    font-size: 15px;
    font-weight: 700;
    line-height: 1;

    cursor: pointer;

    box-shadow: 0 6px 20px var(--form-shadow);
    transition: all 0.2s ease;

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 8px 24px var(--form-shadow);
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

  /* Estilos especializados para el selector de banco en la columna derecha */
  export const BankSelectWrapperCard = styled.div`
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 14px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 16px;
  `;

  export const BankSelectLabelCard = styled.label`
    font-size: 11px;
    font-weight: 700;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  `;

  export const BankSelectCard = styled.select`
    width: 100%;
    height: 40px;
    border-radius: 10px;
    border: 1px solid #cbd5e1;
    background: #ffffff;
    padding: 0 12px;
    font-size: 13.5px;
    color: #0f172a;
    outline: none;
    cursor: pointer;
    transition: all 0.2s ease;

    &:focus {
      border-color: var(--form-primary);
      box-shadow: 0 0 0 3px var(--form-shadow);
    }
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
  border: 1px solid #e2e8f0;
  border-right: none;
  border-radius: 12px 0 0 12px;
  flex-shrink: 0;
  box-sizing: border-box;
`;

export const PhoneFlagEmoji = styled.span`
  font-size: 20px;
  line-height: 1;
`;

export const PhoneInput = styled(Input)`
  border-radius: 0 12px 12px 0;
  border-left: none;
`;

export const ChannelGrid = styled.div`
  display: flex;
  gap: 8px;
`;

export const ChannelButton = styled.button`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 46px;
  height: 46px;
  border-radius: 12px;
  border: ${({ $active }) => ($active ? "2px solid transparent" : "1px solid #e2e8f0")};
  background: ${({ $active, $activeBg }) => ($active ? $activeBg : "#f8fafc")};
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  transition: all 0.15s;

  &:hover:not(:disabled) {
    border-color: #cbd5e1;
    background: ${({ $active, $activeBg }) => ($active ? $activeBg : "#f1f5f9")};
  }
`;

export const ChannelIconBox = styled.span`
  width: 24px;
  height: 24px;
  border-radius: 6px;
  background: ${({ $bg }) => $bg};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const ChannelLabel = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: ${({ $active }) => ($active ? "#ffffff" : "#475569")};
  white-space: nowrap;
`;

export const ChannelCheck = styled.span`
  margin-left: auto;
  color: #fff;
  font-size: 12px;
`;

export const ChannelTooltip = styled.span`
  position: absolute;
  bottom: calc(100% + 6px);
  left: 50%;
  transform: translateX(-50%);
  background: #1e293b;
  color: white;
  font-size: 11px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 6px;
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.15s;

  ${ChannelButton}:hover & {
    opacity: 1;
  }
`;

/* ── NIT SELECTOR ── */
export const NitTrigger = styled.div`
  width: 100%;
  height: 46px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  background: #ffffff;
  padding: 0 14px;
  font-size: 14px;
  color: #0f172a;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  box-sizing: border-box;
  transition: all 0.2s ease;
  user-select: none;

  &:hover {
    border-color: #cbd5e1;
  }

  &.open {
    border-color: var(--form-primary);
    box-shadow: 0 0 0 4px var(--form-shadow);
  }
`;

export const NitTriggerText = styled.span`
  font-size: 14px;
  color: ${({ $hasValue }) => ($hasValue ? "#0f172a" : "#94a3b8")};
  font-weight: ${({ $hasValue }) => ($hasValue ? "600" : "400")};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const NitTriggerSub = styled.span`
  font-size: 11px;
  color: #64748b;
  margin-top: 1px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const NitDropdown = styled.div`
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  width: 100%;
  background: #ffffff;
  border-radius: 14px;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.12);
  z-index: 200;
  border: 1px solid #e2e8f0;
  overflow: hidden;
`;

export const NitSectionLabel = styled.div`
  font-size: 10px;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  padding: 8px 14px 4px;
`;

export const NitOption = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  cursor: pointer;
  transition: background 0.12s ease;

  &:hover {
    background: var(--form-hover-bg);
  }
`;

export const NitOptionNumber = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #0f172a;
`;

export const NitOptionCompany = styled.span`
  font-size: 12px;
  color: #64748b;
  margin-top: 1px;
`;

export const NitCheckMark = styled.span`
  margin-left: auto;
  color: var(--form-primary);
  display: flex;
  align-items: center;
`;

export const NitDivider = styled.div`
  height: 1px;
  background: #f1f5f9;
  margin: 2px 0;
`;

export const NitAddRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  cursor: pointer;
  color: var(--form-primary);
  font-size: 14px;
  font-weight: 600;
  transition: background 0.12s ease;

  &:hover {
    background: var(--form-hover-bg);
  }
`;

export const NitAddForm = styled.div`
  padding: 12px 14px;
  background: #f8fafc;
  border-top: 1px solid #f1f5f9;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const NitAddFormTitle = styled.div`
  font-size: 12px;
  font-weight: 700;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.4px;
`;

export const NitAddFormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
`;

export const NitMiniLabel = styled.label`
  font-size: 11px;
  font-weight: 600;
  color: #64748b;
  margin-bottom: 4px;
  display: block;
`;

export const NitMiniInput = styled.input`
  width: 100%;
  height: 38px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  background: #ffffff;
  padding: 0 12px;
  font-size: 13px;
  color: #0f172a;
  outline: none;
  box-sizing: border-box;
  transition: all 0.2s ease;

  &::placeholder {
    color: #94a3b8;
  }

  &:focus {
    border-color: var(--form-primary);
    box-shadow: 0 0 0 3px var(--form-shadow);
  }

  &.error {
    border-color: #ef4444;
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15);
  }
`;

export const NitAddFormActions = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
`;

export const NitBtnCancel = styled.button`
  height: 34px;
  padding: 0 14px;
  border-radius: 9px;
  border: 1px solid #e2e8f0;
  background: #ffffff;
  color: #64748b;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: #f1f5f9;
  }
`;

export const NitBtnSave = styled.button`
  height: 34px;
  padding: 0 16px;
  border-radius: 9px;
  border: none;
  background: linear-gradient(135deg, var(--form-primary) 0%, var(--form-gradient) 100%);
  color: #ffffff;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s ease;
  box-shadow: 0 3px 10px var(--form-shadow);

  &:hover {
    filter: brightness(1.06);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    filter: none;
  }
`;