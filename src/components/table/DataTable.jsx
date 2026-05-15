import React, { useMemo } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { MapPin, File } from "lucide-react";

import {
  TableContainer,
  TableActionGroup,
  TableIconButton,
  TableLocationButton,
} from "../ui/DataTable.styles";

{/* mensaje para cuando la tabla este vacia */}
function CustomNoRowsOverlay() {
  return (
    <div
      style={{
        height: "100%",
        minHeight: "260px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        color: "#8a98b3",
        gap: "10px",
      }}
    >
      <File size={46} strokeWidth={1.6} />
      <span style={{ fontSize: "15px", fontWeight: 500 }}>
        No hay registros para mostrar
      </span>
    </div>
  );
}

function DataTable({
  rows = [],
  columns = [],
  actions = [],
  getRowId = (row) => row.id,
  pageSize = 7,
  pageSizeOptions = [7, 10, 20],
  loading = false,
  locationConfig,
}) {
  const normalizedColumns = useMemo(() => {
    const baseColumns = columns.map((column) => ({
      flex: column.flex ?? 1,
      minWidth: column.minWidth ?? 140,
      sortable: column.sortable ?? true,
      filterable: column.filterable ?? true,
      headerAlign: column.headerAlign ?? "left",
      align: column.align ?? "left",
      ...column,
    }));

    const finalColumns = [...baseColumns];

    if (locationConfig) {
      finalColumns.push({
        field: "__location",
        headerName: locationConfig.headerName || "Ubicación",
        width: locationConfig.width || 130,
        sortable: false,
        filterable: false,
        align: "center",
        headerAlign: "center",
        renderCell: (params) => {
          const row = params.row;
          const latitude = row[locationConfig.latitudeField];
          const longitude = row[locationConfig.longitudeField];

          const hasLocation =
            latitude !== null &&
            latitude !== undefined &&
            longitude !== null &&
            longitude !== undefined;

          return (
            <TableLocationButton
              type="button"
              $active={hasLocation}
              disabled={!hasLocation}
              title={
                hasLocation
                  ? "Ver ubicación"
                  : "Sin ubicación registrada"
              }
              onClick={(event) => {
                event.stopPropagation();
                if (!hasLocation) return;
                locationConfig.onOpen?.(row);
              }}
            >
              <MapPin size={17} />
            </TableLocationButton>
          );
        },
      });
    }

    if (actions.length > 0) {
      finalColumns.push({
        field: "__actions",
        headerName: "Acciones",
        width: 140,
        sortable: false,
        filterable: false,
        align: "right",
        headerAlign: "right",
        renderCell: (params) => (
          <TableActionGroup>
            {actions.map((action) => {
              const Icon = action.icon;

              return (
                <TableIconButton
                  key={action.key}
                  type="button"
                  title={action.title}
                  onClick={(event) => {
                    event.stopPropagation();
                    action.onClick?.(params.row);
                  }}
                >
                  <Icon size={17} />
                </TableIconButton>
              );
            })}
          </TableActionGroup>
        ),
      });
    }

    return finalColumns;
  }, [columns, actions, locationConfig]);

  return (
    <TableContainer>
      <DataGrid
        rows={rows}
        columns={normalizedColumns}
        getRowId={getRowId}
        loading={loading}
        disableRowSelectionOnClick
        pageSizeOptions={pageSizeOptions}
        slots={{
          noRowsOverlay: CustomNoRowsOverlay,
          noResultsOverlay: CustomNoRowsOverlay,
        }}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize,
              page: 0,
            },
          },
        }}
      />
    </TableContainer>
  );
}

export default DataTable;
