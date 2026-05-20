import React, { useMemo } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { MapPin, File } from "lucide-react";
import Tooltip from "@mui/material/Tooltip";

import {
  TableContainer,
  TableActionGroup,
  TableIconButton,
  TableLocationButton,
  tooltipProps,
  actionTooltipProps,
} from "../ui/DataTable.styles";

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
    const baseColumns = columns.map((column) => {
      const hasCustomRender = !!column.renderCell;

      return {
        flex: column.flex ?? 1,
        minWidth: column.minWidth ?? 140,
        sortable: true,
        filterable: true,
        disableColumnMenu: true,
        headerAlign: column.headerAlign ?? "left",
        align: column.align ?? "left",

        ...column,

        renderCell: hasCustomRender
          ? column.renderCell
          : (params) => {
              const value = params.formattedValue ?? params.value;

              if (
                value === null ||
                value === undefined ||
                value === "" ||
                value === "-"
              ) {
                return (
                  <div
                    style={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      width: "100%",
                    }}
                  >
                    -
                  </div>
                );
              }

              return (
                <Tooltip title={value} {...tooltipProps}>
                  <div
                    style={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      width: "100%",
                    }}
                  >
                    {value}
                  </div>
                </Tooltip>
              );
            },
      };
    });

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
            <Tooltip
              title={hasLocation ? "Ver ubicación" : "Sin ubicación registrada"}
              {...tooltipProps}
            >
              <span>
                <TableLocationButton
                  type="button"
                  $active={hasLocation}
                  disabled={!hasLocation}
                  title={
                    hasLocation ? "Ver ubicación" : "Sin ubicación registrada"
                  }
                  onClick={(event) => {
                    event.stopPropagation();

                    if (!hasLocation) return;

                    locationConfig.onOpen?.(row);
                  }}
                >
                  <MapPin size={17} />
                </TableLocationButton>
              </span>
            </Tooltip>
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
        renderCell: (params) => (
          <TableActionGroup>
            {actions.map((action) => {
              const Icon = action.icon;

              return (
                <Tooltip
                  key={action.key}
                  title={action.title}
                  {...actionTooltipProps}
                >
                  <TableIconButton
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      action.onClick?.(params.row);
                    }}
                  >
                    <Icon size={17} />
                  </TableIconButton>
                </Tooltip>
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
