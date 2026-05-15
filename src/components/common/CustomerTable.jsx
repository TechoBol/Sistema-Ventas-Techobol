import React, { useMemo } from "react";
import { MapPin, Pencil, ChevronDown } from "lucide-react";
import DataTable from "../common/DataTable";

import {
  CustomerName,
  CustomerCode,
  ActionsGroup,
  IconButton,
  LocationButton,
} from "../ui/Customer.styles";

function CustomerTable({
  customers = [],
  loading = false,
  onEdit,
  onMoreActions,
  onOpenLocation,
}) {
  const columns = useMemo(
    () => [
      {
        field: "name",
        headerName: "Nombre",
        flex: 1.4,
        minWidth: 220,
        sortable: true,
        renderCell: (params) => (
          <CustomerName>{params.row.name || "-"}</CustomerName>
        ),
      },
      {
        field: "ci",
        headerName: "CI",
        flex: 0.8,
        minWidth: 130,
        sortable: true,
        renderCell: (params) => (
          <CustomerCode>{params.row.ci || "-"}</CustomerCode>
        ),
      },
      {
        field: "phone",
        headerName: "Teléfono",
        flex: 0.9,
        minWidth: 150,
        sortable: true,
        renderCell: (params) => params.row.phone || "-",
      },
      {
        field: "address",
        headerName: "Dirección",
        flex: 1.3,
        minWidth: 220,
        sortable: true,
        renderCell: (params) => params.row.address || "-",
      },
      {
        field: "location",
        headerName: "Ubicación",
        width: 130,
        sortable: false,
        filterable: false,
        align: "center",
        headerAlign: "center",
        renderCell: (params) => {
          const customer = params.row;

          const hasLocation =
            customer.latitude !== null &&
            customer.latitude !== undefined &&
            customer.longitude !== null &&
            customer.longitude !== undefined;

          return (
            <LocationButton
              type="button"
              $active={hasLocation}
              disabled={!hasLocation}
              title={
                hasLocation
                  ? "Ver ubicación del cliente"
                  : "Sin ubicación registrada"
              }
              onClick={() => onOpenLocation(customer)}
            >
              <MapPin size={17} />
            </LocationButton>
          );
        },
      },
      {
        field: "actions",
        headerName: "Acciones",
        width: 140,
        sortable: false,
        filterable: false,
        align: "right",
        headerAlign: "right",
        renderCell: (params) => {
          const customer = params.row;

          return (
            <ActionsGroup>
              <IconButton
                type="button"
                title="Editar cliente"
                onClick={() => onEdit(customer)}
              >
                <Pencil size={17} />
              </IconButton>

              <IconButton
                type="button"
                title="Más acciones"
                onClick={() => onMoreActions(customer)}
              >
                <ChevronDown size={18} />
              </IconButton>
            </ActionsGroup>
          );
        },
      },
    ],
    [onEdit, onMoreActions, onOpenLocation]
  );

  return (
    <DataTable
      rows={customers}
      columns={columns}
      loading={loading}
      getRowId={(row) => row.id}
      pageSize={5}
    />
  );
}

export default CustomerTable;
