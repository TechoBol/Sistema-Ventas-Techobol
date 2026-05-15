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

  // 🔥 CUSTOMERS
  const { customers, setSearchTerm } = useCustomer();

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
    setShowMap(true);
  };

  // =====================================================
  // 🔥 FINISH
  // =====================================================

  const handleFinish = () => {
    onFinish(customerData);
  };

  // =====================================================
  // 🔥 SELECT CUSTOMER
  // =====================================================

  const selectCustomer = (customer) => {
    setCustomerData({
      name: customer.name || "",
      nitCi: customer.ci || "",
      businessName: customer.businessName || "",
      phone: customer.phone || "",
      address: customer.address || "",
      latitude: customer.latitude,
      longitude: customer.longitude,
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

          <CloseButton onClick={onClose}>
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
                onChange={(e) => handleChange("address", e.target.value)}
                placeholder="Dirección del domicilio o negocio"
              />

              <LocationButton type="button" onClick={getLocation}>
                <MapPin size={20} />
              </LocationButton>
            </AddressWrapper>
          </FullWidth>
        </FormGrid>

        {/* MAPA */}

        {showMap && (
          <div style={{ marginTop: 20 }}>
            <LocationPicker
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

        {/* FOOTER */}

        <Footer>
          <SecondaryButton onClick={onClose}>Cancelar</SecondaryButton>

          <FinishButton disabled={loading} onClick={handleFinish}>
            {loading ? "Procesando..." : "Finalizar Venta"}
          </FinishButton>
        </Footer>
      </ModalCard>
    </Overlay>
  );
};

export default CheckoutModal;
