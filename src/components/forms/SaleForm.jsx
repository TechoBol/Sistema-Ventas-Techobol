import React, { useEffect, useRef, useState } from "react";
import { ArrowLeft, MapPin, ReceiptText, ShieldCheck, CreditCard, Info } from "lucide-react";
import { useCustomer } from "../../hooks/useCustomer";
import { useLoginStore } from "../store/loginStore";
import LocationPicker from "../modals/LocationPicker";
import { errorToast } from "../../services/toasts";
import { CHANNELS } from "../ui/SaleForm.channels";
import NitSelector from "../utils/NitSelector";
import { addCustomerNitService } from "../../services/customerService";

import {
  SaleCard,
  MainContainer,
  LeftColumn,
  RightColumn,
  Header,
  BackButton,
  Title,
  TotalCard,
  TotalLabel,
  TotalValue,
  PaymentInfo,
  PaymentLabel,
  PaymentBadge,
  FormGrid,
  Field,
  Label,
  Input,
  AddressWrapper,
  LocationButton,
  CustomerDropdown,
  CustomerHeader,
  CustomerHeaderCode,
  CustomerHeaderName,
  CustomerItem,
  CustomerCode,
  CustomerName,
  CustomerEmpty,
  AddressSelect,
  InvoiceBox,
  InvoiceInfo,
  InvoiceTitle,
  InvoiceSubtitle,
  SwitchWrapper,
  SwitchInput,
  SwitchSlider,
  BankSelectWrapper,
  BankSelectLabel,
  BankSelect,
  StatusBox,
  NotificationBox,
  Footer,
  FinishButton,
  PhoneWrapper,
  PhoneFlagPrefix,
  PhoneFlagEmoji,
  PhoneInput,
  ChannelGrid,
  ChannelButton,
  ChannelIconBox,
  ChannelLabel,
  ChannelCheck,
  ChannelTooltip,
} from "../ui/SaleForm.styles";

function SaleForm({
  customerData,
  setCustomerData,
  total,
  totalCartAmount = 0,
  mode = "venta",
  paymentMethod,
  validityDays = 7,
  loading,
  onBack,
  onFinish,
}) {
  const [showMap, setShowMap] = useState(false);
  const [openCustomerDrop, setOpenCustomerDrop] = useState(false);
  const [generateInvoice, setGenerateInvoice] = useState(false);
  const [bankName, setBankName] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerAddresses, setCustomerAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("new");
  const [customerNits, setCustomerNits] = useState([]);
  const [selectedNit, setSelectedNit] = useState(null);
  const [savingNit, setSavingNit] = useState(false);

  const customerRef = useRef(null);
  const { customers, setSearchTerm } = useCustomer();
  const { token } = useLoginStore();
  const pendingAmount = Math.max(0, totalCartAmount - total);

  useEffect(() => {
    const handler = (event) => {
      if (customerRef.current && !customerRef.current.contains(event.target)) {
        setOpenCustomerDrop(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleChange = (field, value) => {
    setCustomerData((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleCustomerSearch = (field, value) => {
    handleChange(field, value);
    setSearchTerm(value);
    setOpenCustomerDrop(true);
  };

  const selectCustomer = (customer) => {
    setSelectedCustomer(customer);

    // Direcciones
    const addresses = customer.addresses || [];
    setCustomerAddresses(addresses);
    const primaryAddress = addresses.find((addr) => addr.isPrimary) || addresses[0];
    setSelectedAddressId(primaryAddress?.id || "new");

    // NITs
    const nits = customer.nits || [];
    setCustomerNits(nits);
    const primaryNit = nits.find((n) => n.isPrimary) || nits[0] || null;
    setSelectedNit(primaryNit);

    // Setear customerData en una sola llamada
    setCustomerData({
      name: customer.name || "",
      ci: primaryNit?.number || "",
      occupation: customer.occupation || "",
      phone: customer.phone || "",
      whatsapp: customer.whatsapp || "",
      originChannel: customer.originChannel || "",
      address: primaryAddress?.address || "",
      latitude: primaryAddress?.latitude || null,
      longitude: primaryAddress?.longitude || null,
    });

    setSearchTerm("");
    setOpenCustomerDrop(false);
  };

  const handleAddNit = async ({ number, companyName }) => {
    setSavingNit(true);
    try {
      const newNit = await addCustomerNitService(
        selectedCustomer.id,
        { number, companyName },
        token,
      );
      setCustomerNits((prev) => [...prev, newNit]);
      setSelectedNit(newNit);
      handleChange("ci", newNit.number);
    } catch (error) {
      errorToast(error.message || "No se pudo agregar el NIT.");
    } finally {
      setSavingNit(false);
    }
  };

  const handleFinish = () => {
    if (mode !== "cotizacion" && paymentMethod === "Deposito bancario" && !bankName) {
      errorToast("Por favor, seleccione un banco destino.");
      return;
    }

    const tieneNombre = customerData.name?.trim();
    const tieneNit = customerData.ci?.trim();

    if (mode === "reserva" && (!tieneNombre || !tieneNit)) {
      errorToast("Para registrar una reserva es obligatorio el Nombre y CI/NIT del cliente.");
      return;
    }

    const finalCi = tieneNit ? customerData.ci.trim() : null;
    const finalName = tieneNombre ? customerData.name.trim() : null;

    onFinish?.({
      ...customerData,
      ci: finalCi,
      name: finalName,
      customerId: selectedCustomer ? selectedCustomer.id : null,
      nitId: selectedNit ? selectedNit.id : null,
      generateInvoice: mode === "cotizacion" ? false : generateInvoice,
      bankName: mode === "cotizacion" ? "" : bankName,
    });
  };

  const getModeSettings = () => {
    switch (mode) {
      case "cotizacion":
        return {
          title: "Datos de la Cotización",
          labelTotal: "TOTAL COTIZADO",
          btnText: "Guardar Cotización",
          colorTheme: "#2563eb",
        };
      case "reserva":
        return {
          title: "Datos de la Reserva",
          labelTotal: "SALDO PENDIENTE",
          btnText: "Confirmar Reserva",
          colorTheme: "#d97706",
        };
      case "venta":
      default:
        return {
          title: "Datos del Cliente",
          labelTotal: "TOTAL VENTA",
          btnText: `Cobrar Bs ${Number(total || 0).toFixed(2)}`,
          colorTheme: "#fb0404",
        };
    }
  };

  const settings = getModeSettings();

  return (
    <SaleCard className={`mode-${mode}`}>
      <Header>
        <BackButton type="button" onClick={onBack} title="Volver al carrito">
          <ArrowLeft size={20} />
        </BackButton>
        <Title>{settings.title}</Title>
      </Header>

      <MainContainer>
        {/* COLUMNA IZQUIERDA: FORMULARIO */}
        <LeftColumn>
          {mode !== "cotizacion" && (
            <InvoiceBox onClick={() => setGenerateInvoice((current) => !current)}>
              <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                <ReceiptText size={22} style={{ color: generateInvoice ? "var(--form-primary)" : "#64748b", marginTop: "2px" }} />
                <InvoiceInfo>
                  <InvoiceTitle>Generar factura electrónica</InvoiceTitle>
                  <InvoiceSubtitle>
                    {generateInvoice ? "Se emitirá una factura válida para crédito fiscal." : "Se emitirá un recibo de control interno."}
                  </InvoiceSubtitle>
                </InvoiceInfo>
              </div>
              <SwitchWrapper onClick={(event) => event.stopPropagation()}>
                <SwitchInput
                  type="checkbox"
                  checked={generateInvoice}
                  onChange={(event) => setGenerateInvoice(event.target.checked)}
                />
                <SwitchSlider />
              </SwitchWrapper>
            </InvoiceBox>
          )}

          <FormGrid>
            <Field ref={customerRef}>
              <Label>NOMBRE O RAZÓN SOCIAL</Label>
              <Input
                value={customerData.name}
                onFocus={() => { setSearchTerm(customerData.name); setOpenCustomerDrop(true); }}
                onChange={(event) => handleCustomerSearch("name", event.target.value)}
                placeholder="Ingrese nombre del cliente"
              />
              {openCustomerDrop && (
                <CustomerDropdown>
                  <CustomerHeader>
                    <CustomerHeaderCode>NIT / CI</CustomerHeaderCode>
                    <CustomerHeaderName>Nombre / Razón Social</CustomerHeaderName>
                  </CustomerHeader>
                  {customers.length > 0 ? (
                    customers.map((c) => (
                      <CustomerItem key={c.id} onClick={() => selectCustomer(c)}>
                        <CustomerCode>
                          {c.nits?.[0]?.number || "S/N"}
                        </CustomerCode>
                        <CustomerName>{c.name}</CustomerName>
                      </CustomerItem>
                    ))
                  ) : (
                    <CustomerEmpty>No se encontraron clientes</CustomerEmpty>
                  )}
                </CustomerDropdown>
              )}
            </Field>

            <Field>
              <Label>CI / NIT</Label>
              {selectedCustomer ? (
                <NitSelector
                  nits={customerNits}
                  selectedNit={selectedNit}
                  onChange={(nit) => {
                    setSelectedNit(nit);
                    handleChange("ci", nit.number);
                  }}
                  onAddNit={handleAddNit}
                  loading={savingNit}
                />
              ) : (
                <Input
                  value={customerData.ci}
                  onFocus={() => { setSearchTerm(customerData.ci); setOpenCustomerDrop(true); }}
                  onChange={(event) => handleCustomerSearch("ci", event.target.value)}
                  placeholder="Buscar o ingresar NIT/CI..."
                />
              )}
            </Field>

            <Field>
              <Label>TELÉFONO</Label>
              <PhoneWrapper>
                <PhoneFlagPrefix>
                  <PhoneFlagEmoji>🇧🇴</PhoneFlagEmoji>
                </PhoneFlagPrefix>
                <PhoneInput
                  value={customerData.phone}
                  onChange={(e) => {
                    const v = e.target.value.replace(/\D/g, "").slice(0, 8);
                    handleChange("phone", v);
                  }}
                  placeholder="7X XXX XXX"
                  maxLength={8}
                  inputMode="numeric"
                />
              </PhoneWrapper>
            </Field>

            <Field>
              <Label>WHATSAPP</Label>
              <PhoneWrapper>
                <PhoneFlagPrefix>
                  <PhoneFlagEmoji>🇧🇴</PhoneFlagEmoji>
                </PhoneFlagPrefix>
                <PhoneInput
                  value={customerData.whatsapp}
                  onChange={(e) => {
                    const v = e.target.value.replace(/\D/g, "").slice(0, 8);
                    handleChange("whatsapp", v);
                  }}
                  placeholder="7X XXX XXX"
                  maxLength={8}
                  inputMode="numeric"
                />
              </PhoneWrapper>
            </Field>

            <Field>
              <Label>PROFESIÓN / OCUPACIÓN</Label>
              <Input
                value={customerData.occupation}
                onChange={(event) => handleChange("occupation", event.target.value)}
                placeholder="Ej: Médico, Ingeniero, Comerciante..."
              />
            </Field>

            <Field>
              <Label>¿CÓMO NOS CONOCIÓ?</Label>
              <ChannelGrid>
                {CHANNELS.map(({ value, activeBg, iconBg, icon }) => {
                  const isActive = customerData.originChannel === value;
                  return (
                    <ChannelButton
                      key={value}
                      type="button"
                      disabled={!!selectedCustomer}
                      $active={isActive}
                      $activeBg={activeBg}
                      onClick={() => handleChange("originChannel", value)}
                    >
                      <ChannelIconBox $bg={isActive ? "rgba(255,255,255,0.15)" : iconBg}>
                        {icon}
                      </ChannelIconBox>
                      <ChannelTooltip>{value}</ChannelTooltip>
                    </ChannelButton>
                  );
                })}
              </ChannelGrid>
            </Field>

            <Field style={{ gridColumn: "span 2" }}>
              <Label style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                DIRECCIÓN DE ENTREGA
              </Label>
              <AddressWrapper>
                <Input
                  style={{ paddingRight: "50px" }}
                  value={customerData.address}
                  onChange={(event) => {
                    handleChange("address", event.target.value);
                    setSelectedAddressId("new");
                  }}
                  placeholder="Calle, avenida, número de casa..."
                />
                <LocationButton type="button" onClick={() => setShowMap((current) => !current)} className={showMap ? "active" : ""}>
                  <MapPin size={18} />
                </LocationButton>
              </AddressWrapper>
            </Field>

            <Field style={{ gridColumn: "span 2" }}>
              <Label>DIRECCIONES GUARDADAS</Label>
              <AddressSelect
                disabled={!selectedCustomer || customerAddresses.length === 0}
                value={selectedAddressId}
                onChange={(event) => {
                  const value = event.target.value;
                  if (value === "new") {
                    setSelectedAddressId("new");
                    setCustomerData((current) => ({ ...current, address: "", latitude: null, longitude: null }));
                    return;
                  }
                  const addressId = Number(value);
                  setSelectedAddressId(addressId);
                  const selectedAddress = customerAddresses.find((a) => a.id === addressId);
                  if (!selectedAddress) return;
                  setCustomerData((current) => ({
                    ...current,
                    address: selectedAddress.address || "",
                    latitude: selectedAddress.latitude || null,
                    longitude: selectedAddress.longitude || null,
                  }));
                }}
              >
                <option value="new">Nueva dirección (Usar la de arriba)</option>
                {customerAddresses.map((addr) => (
                  <option key={addr.id} value={addr.id}>
                    {addr.address} {addr.isPrimary ? "(Principal)" : ""}
                  </option>
                ))}
              </AddressSelect>
            </Field>
          </FormGrid>

          {showMap && (
            <div style={{ borderRadius: "12px", overflow: "hidden", border: "1px solid #e2e8f0", marginTop: "12px" }}>
              <LocationPicker
                key={`${customerData.latitude}-${customerData.longitude}`}
                value={{ lat: customerData.latitude, lng: customerData.longitude }}
                onConfirm={(coords) => {
                  setCustomerData((current) => ({ ...current, latitude: coords.lat, longitude: coords.lng }));
                }}
              />
            </div>
          )}
        </LeftColumn>

        {/* COLUMNA DERECHA: RESUMEN */}
        <RightColumn>
          <TotalCard>
            <TotalLabel>{settings.labelTotal}</TotalLabel>
            <TotalValue>
              {mode === "reserva"
                ? `Bs ${Number(pendingAmount).toFixed(2)}`
                : `Bs ${Number(total || 0).toFixed(2)}`
              }
            </TotalValue>

            <div style={{ borderTop: "1px dashed rgba(255,255,255,0.3)", marginTop: "20px", paddingTop: "16px" }}>
              {mode === "cotizacion" ? (
                <>
                  <PaymentLabel>VALIDEZ DE LA OFERTA</PaymentLabel>
                  <PaymentBadge style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "6px" }}>
                    Días válidos: {validityDays} días
                  </PaymentBadge>
                </>
              ) : (
                <>
                  <PaymentLabel>MÉTODO DE PAGO</PaymentLabel>
                  <PaymentBadge style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "6px" }}>
                    <CreditCard size={16} /> {paymentMethod}
                  </PaymentBadge>
                </>
              )}
            </div>

            {mode === "reserva" && (
              <div style={{ marginTop: "12px" }}>
                <PaymentLabel>MONTO ADELANTADO</PaymentLabel>
                <div style={{ fontSize: "16px", fontWeight: "700", marginTop: "2px" }}>
                  Bs {Number(total || 0).toFixed(2)}
                </div>
              </div>
            )}
          </TotalCard>

          {mode !== "cotizacion" && paymentMethod === "Deposito bancario" && (
            <BankSelectWrapper>
              <BankSelectLabel>Banco destino</BankSelectLabel>
              <BankSelect value={bankName} onChange={(event) => setBankName(event.target.value)}>
                <option value="">Seleccione un banco</option>
                <option value="Banco Union">Banco Unión</option>
                <option value="Banco BCP">Banco BCP</option>
                <option value="Banco Bisa">Banco Bisa</option>
              </BankSelect>
            </BankSelectWrapper>
          )}

          <StatusBox>
            <ShieldCheck size={20} style={{ color: generateInvoice ? "#10b981" : "#64748b", flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: "14px", fontWeight: "600", color: "#1e293b" }}>
                {mode === "cotizacion" ? "Presupuesto Informativo" : generateInvoice ? "Facturación Activa" : "Operación regular"}
              </div>
              <div style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>
                {mode === "cotizacion"
                  ? "Este documento no genera obligaciones fiscales legales."
                  : generateInvoice
                    ? "Los datos se validarán para emitir la factura electrónica."
                    : "Se emitirá un recibo de control interno para el despacho."
                }
              </div>
            </div>
          </StatusBox>
        </RightColumn>
      </MainContainer>

      <Footer>
        <NotificationBox>
          <Info size={16} style={{ color: "var(--form-primary)" }} />
          <span>
            {mode === "cotizacion"
              ? "La cotización se guardará en el historial para consultas posteriores."
              : "La venta se registrará automáticamente. El cliente se guardará si es nuevo."
            }
          </span>
        </NotificationBox>

        <FinishButton type="button" disabled={loading} onClick={handleFinish}>
          {loading ? "Procesando..." : settings.btnText}
        </FinishButton>
      </Footer>
    </SaleCard>
  );
}

export default SaleForm;