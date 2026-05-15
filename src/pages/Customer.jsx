import React, { useMemo } from "react";
import AppLayout from "../components/layout/AppLayout";
import { Search, Pencil, ChevronDown, ShoppingBag } from "lucide-react";
import DataTable from "../components/table/DataTable";
import { useCustomer } from "../hooks/useCustomer";

import {
  PageSurface,
  PageWrapper,
  HeaderTitle,
  Title,
  Subtitle,
  SearchBox,
  SearchInput,
  ErrorMessage,
} from "../components/ui/Customer.styles";

const fechaHoy = () =>
  new Date().toLocaleDateString("es-BO", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

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

  return (
    <AppLayout>
      <PageSurface>
        <PageWrapper>
          {/* titulo y fecha */}
          <HeaderTitle>
            <Title>Clientes</Title>
            <Subtitle>{fechaHoy()}</Subtitle>
          </HeaderTitle>
          {/* buscador */}
          <SearchBox>
            <Search size={18} />
            <SearchInput
              type="text"
              placeholder="Buscar"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </SearchBox>

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
    </AppLayout>
  );
}

export default Customer;
