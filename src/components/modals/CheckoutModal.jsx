import React, { useState, useEffect } from "react";
import { X, MapPin } from "lucide-react";

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

} from "../ui/CheckoutModal";
import LocationPicker from "./LocationPicker";

const CheckoutModal = ({ open, onClose, onFinish, total , paymentMethod }) => {

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

  useEffect(() => {
    if (!open) {
      setCustomerData(initialCustomerData);
      setShowMap(false)
    }
  }, [open]);
  if (!open) return null;

  const handleChange = (field, value) => {
    setCustomerData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const getLocation = () => {
    setShowMap(true);
  };

  const handleFinish = () => {
    onFinish(customerData);
  };

  return (
    <Overlay>
      <ModalCard>
        <Header>
          <div>
            <Title>Datos Cliente</Title>
          </div>

          <CloseButton onClick={onClose}>
            <X size={20} />
          </CloseButton>
        </Header>

        <TotalCard>
  <TotalTop>
    <div>
      <TotalLabel>Total Venta</TotalLabel>

      <TotalValue>
        Bs {Number(total || 0).toFixed(2)}
      </TotalValue>
    </div>

    <PaymentInfo>
      <PaymentLabel>Método de pago</PaymentLabel>

      <PaymentBadge>
        {paymentMethod}
      </PaymentBadge>
    </PaymentInfo>
  </TotalTop>
</TotalCard>

        <FormGrid>
          {/* NOMBRE */}

          <Field>
            <Label>Nombre o Razón Social</Label>

            <Input
              value={customerData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Ingrese nombre del cliente"
            />
          </Field>

          {/* CI NIT */}

          <Field>
            <Label>CI / NIT</Label>

            <Input
              value={customerData.nitCi}
              onChange={(e) => handleChange("nitCi", e.target.value)}
              placeholder="Ingrese CI o NIT"
            />
          </Field>

          {/* PROFESION */}

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

        {/* UBICACION */}

        {showMap && (
          <div style={{ marginTop: 20 }}>
            <LocationPicker
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

        <Footer>
          <SecondaryButton onClick={onClose}>Cancelar</SecondaryButton>

          <FinishButton onClick={handleFinish}>Finalizar Venta</FinishButton>
        </Footer>
      </ModalCard>
    </Overlay>
  );
};

export default CheckoutModal;
