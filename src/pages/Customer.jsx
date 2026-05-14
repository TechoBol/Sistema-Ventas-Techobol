import React from "react";
import AppLayout from "../components/layout/AppLayout";
import { Search } from "lucide-react";
import CustomerTable from "../components/common/CustomerTable";
import { useCustomer } from "../hooks/useCustomer";
import {
  PageSurface,
  PageWrapper,
  PageHeader,
  Title,
	Subtitle,
  SearchBox,
  SearchInput,
} from "../components/ui/Customer.styles";

const fechaHoy = () =>
  new Date().toLocaleDateString("es-BO", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

function Customer() {
  const {
    customers,
    searchTerm,
    setSearchTerm,
    isLoading,
    error,
  } = useCustomer();

  const handleEditCustomer = (customer) => {
    console.log("Editar cliente:", customer);
  };

  const handleMoreActions = (customer) => {
    console.log("Más acciones:", customer);
  };

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
          <PageHeader>
            <Title>Clientes</Title>
						<Subtitle>{fechaHoy()}</Subtitle>
          </PageHeader>
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

          {error && (
            <p style={{ color: "#dc2626", fontWeight: 600 }}>
              Error al cargar clientes
            </p>
          )}

          <CustomerTable
            customers={customers}
            loading={isLoading}
            onEdit={handleEditCustomer}
            onMoreActions={handleMoreActions}
            onOpenLocation={handleOpenLocation}
          />
        </PageWrapper>
      </PageSurface>
    </AppLayout>
  );
}

export default Customer;
