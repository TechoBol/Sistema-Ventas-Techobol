import React, { useEffect, useRef, useState } from "react";
import { ArrowLeft, MapPin, ReceiptText, ShieldCheck, CreditCard, Info } from "lucide-react";
import { useCustomer } from "../../hooks/useCustomer";
import LocationPicker from "../modals/LocationPicker";
import { errorToast } from "../../services/toasts"; // Aseguramos consistencia visual

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

  const customerRef = useRef(null);
  const { customers, setSearchTerm } = useCustomer();
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
    const addresses = customer.addresses || [];
    setCustomerAddresses(addresses);

    const primaryAddress = addresses.find((addr) => addr.isPrimary) || addresses[0];
    setSelectedAddressId(primaryAddress?.id || "new");

    setCustomerData({
      name: customer.name || "",
      ci: customer.ci || "",
      occupation: customer.occupation || "",
      phone: customer.phone || "",
      whatsapp: customer.whatsapp || "",
      originChannel: customer.originChannel || "facebook",
      address: primaryAddress?.address || "",
      latitude: primaryAddress?.latitude || null,
      longitude: primaryAddress?.longitude || null,
    });

    setSearchTerm("");
    setOpenCustomerDrop(false);
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

    let finalCi = tieneNit ? customerData.ci.trim() : null;
    let finalName = tieneNombre ? customerData.name.trim() : "S/N (Sin Nombre)";

    // Generar identificador único temporal para anonimato en ventas rápidas
    if (!tieneNit && !tieneNombre && mode === "venta") {
      finalCi = `SN-${Date.now()}`;
      finalName = "Anónimo / Sin Nombre";
    }

    onFinish?.({
      ...customerData,
      ci: finalCi,
      name: finalName,
      customerId: selectedCustomer ? selectedCustomer.id : null,
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
          colorTheme: "#2563eb"
        };
      case "reserva":
        return {
          title: "Datos de la Reserva",
          labelTotal: "SALDO PENDIENTE",
          btnText: "Confirmar Reserva",
          colorTheme: "#d97706"
        };
      case "venta":
      default:
        return {
          title: "Datos del Cliente",
          labelTotal: "TOTAL VENTA",
          btnText: `Cobrar Bs ${Number(total || 0).toFixed(2)}`,
          colorTheme: "#fb0404"
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
              {/* Corrección del stopPropagation para evitar doble evento */}
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
                    <CustomerHeaderCode>Código / CI</CustomerHeaderCode>
                    <CustomerHeaderName>Nombre / Razón Social</CustomerHeaderName>
                  </CustomerHeader>
                  {customers.length > 0 ? (
                    customers.map((c) => (
                      <CustomerItem key={c.id} onClick={() => selectCustomer(c)}>
                        <CustomerCode>{c.ci || "S/C"}</CustomerCode>
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
              <Input
                value={customerData.ci}
                onFocus={() => { setSearchTerm(customerData.ci); setOpenCustomerDrop(true); }}
                onChange={(event) => handleCustomerSearch("ci", event.target.value)}
                placeholder="Buscar o ingresar NIT/CI..."
              />
            </Field>

            <Field>
              <Label>TELÉFONO</Label>
              <div style={{ display: "flex", gap: "8px" }}>
                <span style={{ display: "flex", alignItems: "center", padding: "0 12px", backgroundColor: "#f1f5f9", border: "1px solid #cbd5e1", borderRadius: "12px", color: "#64748b", fontSize: "14px", height: "52px", boxSizing: "border-box" }}>+591</span>
                <Input
                  value={customerData.phone}
                  onChange={(event) => handleChange("phone", event.target.value)}
                  placeholder="70000000"
                />
              </div>
            </Field>

            <Field>
              <Label>WHATSAPP</Label>
              <Input
                value={customerData.whatsapp}
                onChange={(event) => handleChange("whatsapp", event.target.value)}
                placeholder="Mismo del teléfono o alternativo"
              />
            </Field>

            <Field style={{ gridColumn: "span 2" }}>
              <Label>¿CÓMO NOS CONOCIÓ?</Label>
              <AddressSelect
                value={customerData.originChannel}
                onChange={(event) => handleChange("originChannel", event.target.value)}
                disabled={!!selectedCustomer}
              >
                <option value="facebook">Facebook</option>
                <option value="instagram">Instagram</option>
                <option value="tiktok">TikTok</option>
                <option value="referido">Referido</option>
              </AddressSelect>
            </Field>

            <Field style={{ gridColumn: "span 2" }}>
              <Label style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <MapPin size={16} style={{ color: "var(--form-primary)" }} /> DIRECCIÓN DE ENTREGA
              </Label>
              <AddressWrapper>
                <Input
                  style={{ paddingRight: "50px" }}
                  value={customerData.address}
                  onChange={(event) => { 
                    handleChange("address", event.target.value); 
                    setSelectedAddressId("new"); // Reseteamos el selector de arriba
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