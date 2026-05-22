// 🔥 IMPORTS
import React, { useState, useEffect, useRef } from "react";

import { X, MapPin } from "lucide-react";

import { useCustomer } from "../../hooks/useCustomer";

import {
  Overlay,
  ModalCard,
  Header,
  Title,
  CloseButton,
  FormGrid,
  Field,
  Label,
  Input,
  FullWidth,
  AddressWrapper,
  LocationButton,
  Footer,
  FinishButton,
  SecondaryButton,
  TotalCard,
  TotalLabel,
  TotalValue,
  TotalTop,
  PaymentInfo,
  PaymentLabel,
  PaymentBadge,
  CustomerDropdown,
  CustomerHeader,
  CustomerItem,
  CustomerCode,
  CustomerName,
  CustomerHeaderCode,
  CustomerHeaderName,
  CustomerEmpty,
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
} from "../ui/CheckoutModal";

import LocationPicker from "./LocationPicker";

const CheckoutModal = ({
  open,
  onClose,
  onFinish,
  total,
  paymentMethod,
  loading,
}) => {
  const initialCustomerData = {
    name: "",
    nitCi: "",
    businessName: "",
    phone: "",
    address: "",

    latitude: null,
    longitude: null,
  };

  const [customerData, setCustomerData] = useState(initialCustomerData);

  const [showMap, setShowMap] = useState(false);

  const [openCustomerDrop, setOpenCustomerDrop] = useState(false);

  const customerRef = useRef(null);

  const [generateInvoice, setGenerateInvoice] = useState(false);

  const [bankName, setBankName] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [customerAddresses, setCustomerAddresses] = useState([]);

  const [selectedAddressId, setSelectedAddressId] = useState(null);
  // 🔥 CUSTOMERS
  const { customers, setSearchTerm } = useCustomer();

  const handleClose = () => {
    setCustomerData(initialCustomerData);

    setShowMap(false);

    setOpenCustomerDrop(false);

    setGenerateInvoice(false);

    setBankName("");

    setSearchTerm("");

    onClose();
  };
  // =====================================================
  // 🔥 RESET
  // =====================================================

  useEffect(() => {
    if (!open) {
      setCustomerData(initialCustomerData);

      setShowMap(false);

      setOpenCustomerDrop(false);

      setSearchTerm("");
    }
  }, [open]);

  // =====================================================
  // 🔥 CLICK AFUERA
  // =====================================================

  useEffect(() => {
    const handler = (e) => {
      if (customerRef.current && !customerRef.current.contains(e.target)) {
        setOpenCustomerDrop(false);
      }
    };

    document.addEventListener("mousedown", handler);

    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    if (open) {
      window.addEventListener("keydown", handleEsc);
    }

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [open, handleClose]);

  if (!open) return null;

  // =====================================================
  // 🔥 HANDLE CHANGE
  // =====================================================

  const handleChange = (field, value) => {
    setCustomerData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // =====================================================
  // 🔥 LOCATION
  // =====================================================

  const getLocation = () => {
    setShowMap(!showMap);
  };

  // =====================================================
  // 🔥 FINISH
  // =====================================================

  const handleFinish = () => {
    if (paymentMethod === "Deposito bancario" && !bankName) {
      alert("Seleccione un banco");

      return;
    }
    console.log(generateInvoice);
    onFinish({
      ...customerData,
      generateInvoice,
      bankName,
    });

    handleClose();
  };

  // =====================================================
  // 🔥 SELECT CUSTOMER
  // =====================================================

  // =====================================================
  // 🔥 SELECT CUSTOMER
  // =====================================================

  const selectCustomer = (customer) => {
    console.log(customers);
    console.log(customer);
    setSelectedCustomer(customer);

    setCustomerAddresses(customer.addresses || []);

    // 🔥 DIRECCION PRINCIPAL
    const primaryAddress =
      customer.addresses?.find((a) => a.isPrimary) || customer.addresses?.[0];

    setSelectedAddressId(primaryAddress?.id || null);

    setCustomerData({
      name: customer.name || "",

      nitCi: customer.ci || "",

      businessName: customer.businessName || "",

      phone: customer.phone || "",

      address: primaryAddress?.address || "",

      latitude: primaryAddress?.latitude || null,

      longitude: primaryAddress?.longitude || null,
    });

    setSearchTerm("");

    setOpenCustomerDrop(false);
  };

  // =====================================================
  // 🔥 SEARCH CUSTOMER
  // =====================================================

  const handleCustomerSearch = (field, value) => {
    handleChange(field, value);

    setSearchTerm(value);

    setOpenCustomerDrop(true);
  };

  return (
    <Overlay>
      <ModalCard>
        {/* HEADER */}

        <Header>
          <div>
            <Title>Datos Cliente</Title>
          </div>

          <CloseButton onClick={handleClose}>
            <X size={20} />
          </CloseButton>
        </Header>

        {/* TOTAL */}

        <TotalCard>
          <TotalTop>
            <div>
              <TotalLabel>Total Venta</TotalLabel>

              <TotalValue>Bs {Number(total || 0).toFixed(2)}</TotalValue>
            </div>

            <PaymentInfo>
              <PaymentLabel>Método de pago</PaymentLabel>

              <PaymentBadge>{paymentMethod}</PaymentBadge>
            </PaymentInfo>
          </TotalTop>
        </TotalCard>

        {/* FORM */}

        <FormGrid>
          {/* NOMBRE */}

          <Field ref={customerRef}>
            <Label>Nombre o Razón Social</Label>

            <Input
              value={customerData.name}
              onFocus={() => {
                setSearchTerm(customerData.name);

                setOpenCustomerDrop(true);
              }}
              onChange={(e) => handleCustomerSearch("name", e.target.value)}
              placeholder="Ingrese nombre del cliente"
            />

            {/* 🔥 DROPDOWN */}

            {openCustomerDrop && (
              <CustomerDropdown>
                <CustomerHeader>
                  <CustomerHeaderCode>CI/NIT</CustomerHeaderCode>

                  <CustomerHeaderName>CLIENTE</CustomerHeaderName>
                </CustomerHeader>

                {customers.length === 0 ? (
                  <CustomerEmpty>Sin resultados</CustomerEmpty>
                ) : (
                  customers.slice(0, 10).map((customer) => (
                    <CustomerItem
                      key={customer.id}
                      onClick={() => selectCustomer(customer)}
                    >
                      <CustomerCode>{customer.ci || "-"}</CustomerCode>

                      <CustomerName>{customer.name}</CustomerName>
                    </CustomerItem>
                  ))
                )}
              </CustomerDropdown>
            )}
          </Field>

          {/* CI / NIT */}

          <Field>
            <Label>CI / NIT</Label>

            <Input
              value={customerData.nitCi}
              onFocus={() => {
                setSearchTerm(customerData.nitCi);

                setOpenCustomerDrop(true);
              }}
              onChange={(e) => handleCustomerSearch("nitCi", e.target.value)}
              placeholder="Buscar cliente..."
            />
          </Field>

          {/* NEGOCIO */}

          <Field>
            <Label>Profesión o Negocio</Label>

            <Input
              value={customerData.businessName}
              onChange={(e) => handleChange("businessName", e.target.value)}
              placeholder="Profesión o negocio"
            />
          </Field>

          {/* TELEFONO */}

          <Field>
            <Label>Teléfono</Label>

            <Input
              value={customerData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="+591 70000000"
            />
          </Field>

          {/* DIRECCION */}

          <FullWidth>
            <Label>Dirección</Label>

            <AddressWrapper>
              <Input
                value={customerData.address}
                onChange={(e) => {
                  handleChange("address", e.target.value);

                  // 🔥 NUEVA DIRECCION
                  setSelectedAddressId(null);
                }}
                placeholder="Dirección del domicilio o negocio"
              />

              <LocationButton type="button" onClick={getLocation}>
                <MapPin size={20} />
              </LocationButton>
            </AddressWrapper>
          </FullWidth>
          {/* 🔥 DIRECCIONES DEL CLIENTE */}

          {selectedCustomer && (
            <FullWidth>
              <Label>Direcciones guardadas</Label>

              <select
                value={selectedAddressId || "new"}
                onChange={(e) => {
                  const value = e.target.value;

                  //////////////////////////////////////////////////
                  // 🔥 NUEVA DIRECCION
                  //////////////////////////////////////////////////

                  if (value === "new") {
                    setSelectedAddressId(null);

                    setCustomerData((prev) => ({
                      ...prev,

                      address: "",

                      latitude: null,

                      longitude: null,
                    }));

                    return;
                  }

                  //////////////////////////////////////////////////
                  // 🔥 DIRECCION EXISTENTE
                  //////////////////////////////////////////////////

                  const addressId = Number(value);

                  setSelectedAddressId(addressId);

                  const selected = customerAddresses.find(
                    (a) => a.id === addressId,
                  );

                  if (!selected) return;

                  setCustomerData((prev) => ({
                    ...prev,

                    address: selected.address || "",

                    latitude: selected.latitude || null,

                    longitude: selected.longitude || null,
                  }));
                }}
                style={{
                  width: "100%",

                  padding: "12px 14px",

                  borderRadius: "12px",

                  border: "1px solid #E2E8F0",

                  background: "#fff",

                  fontSize: "14px",

                  color: "#0f172a",

                  outline: "none",

                  marginTop: "6px",
                }}
              >
                {/* 🔥 CREAR NUEVA */}
                <option value="new">+ Nueva dirección</option>

                {/* 🔥 DIRECCIONES */}
                {customerAddresses.map((address) => (
                  <option key={address.id} value={address.id}>
                    {address.address}
                  </option>
                ))}
              </select>
            </FullWidth>
          )}
        </FormGrid>

        {/* MAPA */}

        {showMap && (
          <div style={{ marginTop: 20 }}>
            <LocationPicker
              key={`${customerData.latitude}-${customerData.longitude}`}
              value={{
                lat: customerData.latitude,
                lng: customerData.longitude,
              }}
              onConfirm={(coords) => {
                setCustomerData((prev) => ({
                  ...prev,
                  latitude: coords.lat,
                  longitude: coords.lng,
                }));
              }}
            />
          </div>
        )}

        <InvoiceBox onClick={() => setGenerateInvoice((prev) => !prev)}>
          <InvoiceInfo>
            <InvoiceTitle>Generar factura</InvoiceTitle>

            <InvoiceSubtitle>
              Emitir factura electrónica para esta venta
            </InvoiceSubtitle>
          </InvoiceInfo>

          <SwitchWrapper onClick={(e) => e.stopPropagation()}>
            <SwitchInput
              type="checkbox"
              checked={generateInvoice}
              onChange={(e) => setGenerateInvoice(e.target.checked)}
            />

            <SwitchSlider />
          </SwitchWrapper>
        </InvoiceBox>
        {paymentMethod === "Deposito bancario" && (
          <BankSelectWrapper>
            <BankSelectLabel>Banco destino</BankSelectLabel>

            <BankSelect
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
            >
              <option value="">Seleccione un banco</option>

              <option value="Banco Union">Banco Unión</option>

              <option value="Banco BCP">Banco BCP</option>

              <option value="Banco Bisa">Banco Bisa</option>
            </BankSelect>
          </BankSelectWrapper>
        )}
        <Footer>
          <SecondaryButton onClick={handleClose}>Cancelar</SecondaryButton>

          <FinishButton disabled={loading} onClick={handleFinish}>
            {loading ? "Procesando..." : "Finalizar Venta"}
          </FinishButton>
        </Footer>
      </ModalCard>
    </Overlay>
  );
};

export default CheckoutModal;
