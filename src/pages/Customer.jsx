import React, { useMemo } from "react";
import { Search, ChevronRight } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const { customers, searchTerm, setSearchTerm, isLoading, error } =
    useCustomer();

  const formatPhoneForWhatsApp = (phone) => {
    const cleanPhone = String(phone || "").replace(/\D/g, "");
    if (!cleanPhone) return "";
    return cleanPhone.startsWith("591") ? cleanPhone : `591${cleanPhone}`;
  };

  const handleOpenWhatsApp = (customer) => {
    const phone = formatPhoneForWhatsApp(customer.phone);
    if (!phone) return;
    window.open(`https://wa.me/${phone}`, "_blank", "noopener,noreferrer");
  };

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
        field: "occupation",
        headerName: "Profesión",
        flex: 1,
      },
      {
        field: "createdAt",
        headerName: "Fecha de registro",
        flex: 1,
        renderCell: (params) =>
          new Date(params.row.createdAt).toLocaleDateString("es-BO"),
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
        onClick: (customer) => handleOpenWhatsApp(customer),
      },
      {
        key: "detail",
        title: "Ver detalle",
        icon: ChevronRight,
        onClick: (customer) => navigate(`/customer/${customer.id}`),
      },
    ],
    [navigate]
  );

  return (
    <>
      <PageSurface>
        <PageWrapper>
          <HeaderTitle>
            <Title>Clientes</Title>
            <Subtitle>{fechaHoy()}</Subtitle>
          </HeaderTitle>

          <Toolbar>
            <SearchBox>
              <Search size={18} />
              <SearchInput
                type="text"
                placeholder="Buscar"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </SearchBox>
          </Toolbar>

          {error && <ErrorMessage>Error al cargar clientes</ErrorMessage>}

          <DataTable
            rows={customers}
            columns={customerColumns}
            loading={isLoading}
            pageSize={7}
            actions={customerActions}
          />
        </PageWrapper>
      </PageSurface>
    </>
  );
}

export default Customer;