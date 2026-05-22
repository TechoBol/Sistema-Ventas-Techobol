import React, { useMemo } from "react";
import { Search, Pencil, ChevronDown, ShoppingBag } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import DataTable from "../components/table/DataTable";
import { useCustomer } from "../hooks/useCustomer";

import {
  PageSurface,
  PageWrapper,
  HeaderTitle,
  Title,
  Subtitle,
  Toolbar,
  SearchBox,
  SearchInput,
  ErrorMessage,
} from "../components/ui/Page.styles";

const fechaHoy = () => {
  const fecha = new Date().toLocaleDateString("es-BO", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return fecha.charAt(0).toUpperCase() + fecha.slice(1);
};

function Customer() {
  const { customers, searchTerm, setSearchTerm, isLoading, error } =
    useCustomer();

  const customerColumns = useMemo(
    () => [
      {
        field: "name",
        headerName: "Nombre",
        flex: 1.4,
      },
      {
        field: "ci",
        headerName: "CI",
        flex: 0.8,
      },
      {
        field: "phone",
        headerName: "Teléfono",
        flex: 0.9,
      },
      {
        field: "address",
        headerName: "Dirección",
        flex: 1.3,
      },
    ],
    []
  );

  const customerActions = useMemo(
    () => [
      {
        key: "whatsapp",
        title: "Contactarse",
        icon: FaWhatsapp,
        onClick: (customer) => {
          handleOpenWhatsApp(customer);
        },
      },
      {
        key: "edit",
        title: "Editar cliente",
        icon: Pencil,
        onClick: (customer) => {
          console.log("Editar cliente:", customer);
        },
      },
      {
        key: "more",
        title: "Ver compras",
        icon: ShoppingBag,
        onClick: (customer) => {
          console.log("Más acciones:", customer);
        },
      },
    ],
    []
  );

  const handleOpenLocation = (customer) => {
    if (!customer.latitude || !customer.longitude) return;
    const url = `https://www.google.com/maps?q=${customer.latitude},${customer.longitude}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  // ABRIR WAHTSAPP
  const formatPhoneForWhatsApp = (phone) => {
    const cleanPhone = String(phone || "").replace(/\D/g, "");
    if (!cleanPhone) return "";
    if (cleanPhone.startsWith("591")) {
      return cleanPhone;
    }
    return `591${cleanPhone}`;
  };

  const handleOpenWhatsApp = (customer) => {
    const phone = formatPhoneForWhatsApp(customer.phone);
    if (!phone) return;
    const url = `https://wa.me/${phone}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <PageSurface>
        <PageWrapper>
          {/* titulo y fecha */}
          <HeaderTitle>
            <Title>Clientes</Title>
            <Subtitle>{fechaHoy()}</Subtitle>
          </HeaderTitle>
          {/* buscador */}
          <Toolbar>
            <SearchBox>
              <Search size={18} />
              <SearchInput
                type="text"
                placeholder="Buscar"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </SearchBox>
          </Toolbar>

          {error && <ErrorMessage>Error al cargar clientes</ErrorMessage>}

          <DataTable
            rows={customers}
            columns={customerColumns}
            loading={isLoading}
            pageSize={7}
            locationConfig={{
              latitudeField: "latitude",
              longitudeField: "longitude",
              onOpen: handleOpenLocation,
            }}
            actions={customerActions}
          />
        </PageWrapper>
      </PageSurface>
    </>
  );
}

export default Customer;
