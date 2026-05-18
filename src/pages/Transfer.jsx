import React, { useMemo, useState } from "react";
import AppLayout from "../components/layout/AppLayout";
import DataTable from "../components/table/DataTable";

import {
  Search,
  Eye,
  FileText,
  Send,
} from "lucide-react";

import {
  PageSurface,
  PageWrapper,
  HeaderTitle,
  Title,
  Subtitle,
  SearchBox,
  SearchInput,
  Toolbar,
  FilterButtonGroup,
  FilterButton,
  PrimaryActionButton,
  StatusBadge,
} from "../components/ui/Customer.styles";

const fechaHoy = () =>
  new Date().toLocaleDateString("es-BO", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const transferMock = [
  {
    id: 1,
    code: "TR-0001",
    products: "CALAMINA, CEMENTO",
    origin: "Almacén Central",
    destination: "Sucursal Norte",
    date: "2026-05-14T10:30:00",
    status: "aprobado",
    pdfUrl: "transferencia-0001.pdf",
  },
  {
    id: 2,
    code: "TR-0002",
    products: "COMPRESORA",
    origin: "Almacén Central",
    destination: "Sucursal Sur",
    date: "2026-05-14T12:10:00",
    status: "pendiente",
    pdfUrl: "transferencia-0002.pdf",
  },
  {
    id: 3,
    code: "TR-0003",
    products: "TALADRO, LIJADORA",
    origin: "Sucursal Norte",
    destination: "Almacén Central",
    date: "2026-05-13T16:45:00",
    status: "rechazado",
    pdfUrl: "transferencia-0003.pdf",
  },
];

function Transfer() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedView, setSelectedView] = useState("all");

  const filteredTransfers = useMemo(() => {
    const value = searchTerm.trim().toLowerCase();

    let result = transferMock;

    if (selectedView === "requests") {
      // Por ahora queda preparado para filtrar "mis solicitudes"
      // cuando el backend devuelva el usuario solicitante.
      result = result;
    }

    if (!value) return result;

    return result.filter((transfer) =>
      [
        transfer.code,
        transfer.products,
        transfer.origin,
        transfer.destination,
        transfer.status,
      ]
        .join(" ")
        .toLowerCase()
        .includes(value)
    );
  }, [searchTerm, selectedView]);

  const transferColumns = useMemo(
    () => [
      {
        field: "code",
        headerName: "Código",
        flex: 0.9,
        minWidth: 130,
      },
      {
        field: "products",
        headerName: "Productos",
        flex: 1.6,
        minWidth: 220,
      },
      {
        field: "origin",
        headerName: "Origen",
        flex: 1.2,
        minWidth: 170,
      },
      {
        field: "destination",
        headerName: "Destino",
        flex: 1.2,
        minWidth: 170,
      },
      {
        field: "date",
        headerName: "Fecha",
        flex: 1.2,
        minWidth: 180,
        valueFormatter: (value) => {
          if (!value) return "-";

          return new Date(value).toLocaleString("es-BO", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          });
        },
      },
      {
        field: "status",
        headerName: "Estado",
        flex: 0.9,
        minWidth: 140,
        renderCell: (params) => (
          <StatusBadge $status={params.row.status}>
            {params.row.status}
          </StatusBadge>
        ),
      },
    ],
    []
  );

  const transferActions = useMemo(
    () => [
      {
        key: "details",
        title: "Ver detalles",
        icon: Eye,
        onClick: (transfer) => {
          console.log("Ver detalles de transferencia:", transfer);
        },
      },
      {
        key: "pdf",
        title: "Ver PDF",
        icon: FileText,
        onClick: (transfer) => {
          console.log("Ver PDF de transferencia:", transfer);
        },
      },
    ],
    []
  );

  const handleCreateTransfer = () => {
    console.log("Realizar transferencia");
  };

  return (
    <AppLayout>
      <PageSurface>
        <PageWrapper>
          <HeaderTitle>
            <Title>Transferencias</Title>
            <Subtitle>{fechaHoy()}</Subtitle>
          </HeaderTitle>

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

            <PrimaryActionButton
              type="button"
              onClick={handleCreateTransfer}
            >
              <Send size={18} />
              Realizar transferencia
            </PrimaryActionButton>
          </Toolbar>

          <FilterButtonGroup>
            <FilterButton
              type="button"
              $active={selectedView === "all"}
              onClick={() => setSelectedView("all")}
            >
              Todas las transferencias
            </FilterButton>

            <FilterButton
              type="button"
              $active={selectedView === "requests"}
              onClick={() => setSelectedView("requests")}
            >
              Mis solicitudes
            </FilterButton>
          </FilterButtonGroup>

          <DataTable
            rows={filteredTransfers}
            columns={transferColumns}
            actions={transferActions}
            pageSize={7}
            pageSizeOptions={[7, 10, 20]}
            noRowsLabel="No hay transferencias registradas"
          />
        </PageWrapper>
      </PageSurface>
    </AppLayout>
  );
}

export default Transfer;
