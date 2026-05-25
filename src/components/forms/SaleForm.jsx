import React, { useEffect, useRef, useState } from "react";
import { ArrowLeft, MapPin } from "lucide-react";
import { useCustomer } from "../../hooks/useCustomer";
import LocationPicker from "../modals/LocationPicker";

import {
  SaleCard,
  Header,
  BackButton,
  Title,
  TotalCard,
  TotalTop,
  TotalLabel,
  TotalValue,
  PaymentInfo,
  PaymentLabel,
  PaymentBadge,
  FormGrid,
  Field,
  Label,
  Input,
  FullWidth,
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
  Footer,
  SecondaryButton,
  FinishButton,
} from "../ui/SaleForm.styles";

const initialCustomerData = {
  name: "",
  nitCi: "",
  businessName: "",
  phone: "",
  address: "",
  latitude: null,
  longitude: null,
};

function SaleForm({
  total,
  paymentMethod,
  loading,
  onBack,
  onFinish,
}) {
  const [customerData, setCustomerData] = useState(initialCustomerData);
  const [showMap, setShowMap] = useState(false);
  const [openCustomerDrop, setOpenCustomerDrop] = useState(false);
  const [generateInvoice, setGenerateInvoice] = useState(false);
  const [bankName, setBankName] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerAddresses, setCustomerAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  const customerRef = useRef(null);

  const { customers, setSearchTerm } = useCustomer();

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
    setCustomerAddresses(customer.addresses || []);

    const primaryAddress =
      customer.addresses?.find((address) => address.isPrimary) ||
      customer.addresses?.[0];

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

  const handleFinish = () => {
    if (paymentMethod === "Deposito bancario" && !bankName) {
      alert("Seleccione un banco");
      return;
    }

    onFinish?.({
      ...customerData,
      generateInvoice,
      bankName,
    });
  };

  return (
    <SaleCard>
      <Header>
        <BackButton type="button" onClick={onBack} title="Volver">
          <ArrowLeft size={20} />
        </BackButton>
        <Title>Datos Cliente</Title>
      </Header>

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

      <FormGrid>
        <Field ref={customerRef}>
          <Label>Nombre o Razón Social</Label>
          <Input
            value={customerData.name}
            onFocus={() => {
              setSearchTerm(customerData.name);
              setOpenCustomerDrop(true);
            }}
            onChange={(event) =>
              handleCustomerSearch("name", event.target.value)
            }
            placeholder="Ingrese nombre del cliente"
          />

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

        <Field>
          <Label>CI / NIT</Label>
          <Input
            value={customerData.nitCi}
            onFocus={() => {
              setSearchTerm(customerData.nitCi);
              setOpenCustomerDrop(true);
            }}
            onChange={(event) =>
              handleCustomerSearch("nitCi", event.target.value)
            }
            placeholder="Buscar cliente..."
          />
        </Field>

        <Field>
          <Label>Profesión o Negocio</Label>
          <Input
            value={customerData.businessName}
            onChange={(event) =>
              handleChange("businessName", event.target.value)
            }
            placeholder="Profesión o negocio"
          />
        </Field>

        <Field>
          <Label>Teléfono</Label>
          <Input
            value={customerData.phone}
            onChange={(event) => handleChange("phone", event.target.value)}
            placeholder="+591 70000000"
          />
        </Field>

        <FullWidth>
          <Label>Dirección</Label>

          <AddressWrapper>
            <Input
              value={customerData.address}
              onChange={(event) => {
                handleChange("address", event.target.value);
                setSelectedAddressId(null);
              }}
              placeholder="Dirección del domicilio o negocio"
            />

            <LocationButton
              type="button"
              onClick={() => setShowMap((current) => !current)}
            >
              <MapPin size={20} />
            </LocationButton>
          </AddressWrapper>
        </FullWidth>

        {selectedCustomer && (
          <FullWidth>
            <Label>Direcciones guardadas</Label>

            <AddressSelect
              value={selectedAddressId || "new"}
              onChange={(event) => {
                const value = event.target.value;

                if (value === "new") {
                  setSelectedAddressId(null);
                  setCustomerData((current) => ({
                    ...current,
                    address: "",
                    latitude: null,
                    longitude: null,
                  }));

                  return;
                }

                const addressId = Number(value);
                setSelectedAddressId(addressId);

                const selectedAddress = customerAddresses.find(
                  (address) => address.id === addressId
                );

                if (!selectedAddress) return;

                setCustomerData((current) => ({
                  ...current,
                  address: selectedAddress.address || "",
                  latitude: selectedAddress.latitude || null,
                  longitude: selectedAddress.longitude || null,
                }));
              }}
            >
              <option value="new">+ Nueva dirección</option>

              {customerAddresses.map((address) => (
                <option key={address.id} value={address.id}>
                  {address.address}
                </option>
              ))}
            </AddressSelect>
          </FullWidth>
        )}
      </FormGrid>

      {showMap && (
        <div style={{ marginTop: 20 }}>
          <LocationPicker
            key={`${customerData.latitude}-${customerData.longitude}`}
            value={{
              lat: customerData.latitude,
              lng: customerData.longitude,
            }}
            onConfirm={(coords) => {
              setCustomerData((current) => ({
                ...current,
                latitude: coords.lat,
                longitude: coords.lng,
              }));
            }}
          />
        </div>
      )}

      <InvoiceBox onClick={() => setGenerateInvoice((current) => !current)}>
        <InvoiceInfo>
          <InvoiceTitle>Generar factura</InvoiceTitle>
          <InvoiceSubtitle>
            Emitir factura electrónica para esta venta
          </InvoiceSubtitle>
        </InvoiceInfo>

        <SwitchWrapper onClick={(event) => event.stopPropagation()}>
          <SwitchInput
            type="checkbox"
            checked={generateInvoice}
            onChange={(event) => setGenerateInvoice(event.target.checked)}
          />
          <SwitchSlider />
        </SwitchWrapper>
      </InvoiceBox>

      {paymentMethod === "Deposito bancario" && (
        <BankSelectWrapper>
          <BankSelectLabel>Banco destino</BankSelectLabel>

          <BankSelect
            value={bankName}
            onChange={(event) => setBankName(event.target.value)}
          >
            <option value="">Seleccione un banco</option>
            <option value="Banco Union">Banco Unión</option>
            <option value="Banco BCP">Banco BCP</option>
            <option value="Banco Bisa">Banco Bisa</option>
          </BankSelect>
        </BankSelectWrapper>
      )}

      <Footer>
        <SecondaryButton type="button" onClick={onBack}>
          Cancelar
        </SecondaryButton>

        <FinishButton type="button" disabled={loading} onClick={handleFinish}>
          {loading ? "Procesando..." : "Finalizar Venta"}
        </FinishButton>
      </Footer>
    </SaleCard>
  );
}

export default SaleForm;
