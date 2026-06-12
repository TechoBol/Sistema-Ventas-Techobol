import { useMemo, useState } from "react";

import KardexFiltersModal from "../components/modals/KardexFiltersModal";

import {
  Wrapper,
  Header,
  HeaderTitle,
  Title,
  Subtitle,
  Content,
  AddButton,
  TableWrapper,
  GroupBar,
  GroupButton,
  TotalBar,
  TotalText,
  DetailButton,
  DetailPopoverCard,
  DetailPopoverTitle,
  DetailPopoverTable,
  DetailPopoverHead,
  DetailPopoverRow,
} from "../components/ui/Kardex";
import { usePermissions } from "../hooks/usePermissions";
import { DataGrid } from "@mui/x-data-grid";
import Popover from "@mui/material/Popover";
import { ChevronDown } from "lucide-react";

const fechaHoy = () => {
  const fecha = new Date().toLocaleDateString("es-BO", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return fecha.charAt(0).toUpperCase() + fecha.slice(1);
};

export default function Kardex() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFilters, setOpenFilters] = useState(true);
  const [rawRows, setRawRows] = useState([]);
  const [groupBy, setGroupBy] = useState("");

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedDetails, setSelectedDetails] = useState([]);
  const openDetailPopover = (event, details = []) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedDetails(details);
  };
  const { canViewProfits } = usePermissions();
  const closeDetailPopover = () => {
    setAnchorEl(null);
    setSelectedDetails([]);
  };
  const detailPopoverOpen = Boolean(anchorEl);
  // formato de moneda
  const formatMoney = (value) =>
    `Bs ${Number(value || 0).toLocaleString("es-BO", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  ////////////////////////////////////////////////////////////
  // 🔥 FORMATEAR FECHA
  ////////////////////////////////////////////////////////////

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("es-BO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  ////////////////////////////////////////////////////////////
  // 🔥 FORMATEAR MES
  ////////////////////////////////////////////////////////////

  const formatMonth = (date) => {
    return new Date(date).toLocaleDateString("es-BO", {
      month: "long",
      year: "numeric",
    });
  };

  const getLastFinalPrice = (details = []) => {
    if (!details.length) return 0;
    return Number(details[details.length - 1]?.finalPrice || 0);
  };

  const round = (value) => Number(Number(value || 0).toFixed(2));

  const rows = useMemo(() => {
    ////////////////////////////////////////////////////////////
    // 🔥 GENERAL
    ////////////////////////////////////////////////////////////

    if (!groupBy) {
      return rawRows.map((item) => {
        const purchasePrice = Number(item.purchasePrice || 0);

        const totalCost = purchasePrice * Number(item.quantity || 0);

        const utilityTotal = (item.details || []).reduce((acc, detail) => {
          return (
            acc +
            (Number(detail.finalPrice || 0) - purchasePrice) *
              Number(detail.quantity || 0)
          );
        }, 0);

        const utility =
          Number(item.quantity || 0) > 0
            ? utilityTotal / Number(item.quantity)
            : 0;
        return {
          id: item.id,

          name: item.product,

          quantity: Number(item.quantity || 0),

          purchasePrice,
          totalCost,

          price: item.price,

          utility,

          utilityTotal,

          details: item.details || [],

          subtotal: Number(item.subtotal || 0),

          discount: Number(item.discount || 0),

          total: Number(item.total || 0),

          date: item.date,
        };
      });
    }

    ////////////////////////////////////////////////////////////
    // 🔥 AGRUPAR POR VENDEDORES
    ////////////////////////////////////////////////////////////

    if (groupBy === "seller") {
      const grouped = {};

      rawRows.forEach((item) => {
        ////////////////////////////////////////////////////////
        // 🔥 RECORRER VENDEDORES DEL PRODUCTO
        ////////////////////////////////////////////////////////

        (item.sellers || []).forEach((seller) => {
          const sellerName = seller.name || "Sin vendedor";

          //////////////////////////////////////////////////////
          // 🔥 INIT
          //////////////////////////////////////////////////////

          if (!grouped[sellerName]) {
            grouped[sellerName] = {
              id: `seller-${sellerName}`,

              name: sellerName,

              quantity: 0,

              subtotal: 0,

              discount: 0,

              total: 0,
            };
          }

          //////////////////////////////////////////////////////
          // 🔥 ACUMULAR
          //////////////////////////////////////////////////////

          grouped[sellerName].quantity += Number(seller.quantity || 0);

          grouped[sellerName].subtotal = round(
            grouped[sellerName].subtotal + Number(seller.subtotal || 0),
          );

          grouped[sellerName].discount = round(
            grouped[sellerName].discount + Number(seller.discount || 0),
          );

          grouped[sellerName].total = round(
            grouped[sellerName].total + Number(seller.total || 0),
          );
        });
      });

      return Object.values(grouped);
    }
    if (groupBy === "date") {
      const grouped = {};

      rawRows.forEach((item) => {
        //////////////////////////////////////////////////////////
        // 🔥 RECORRER FECHAS DEL PRODUCTO
        //////////////////////////////////////////////////////////

        (item.dates || []).forEach((dateItem) => {
          ////////////////////////////////////////////////////////
          // 🔥 VALIDAR FECHA
          ////////////////////////////////////////////////////////

          if (!dateItem.date) return;

          const dateObj = new Date(dateItem.date);

          if (isNaN(dateObj.getTime())) return;

          ////////////////////////////////////////////////////////
          // 🔥 KEY
          ////////////////////////////////////////////////////////

          const dateKey = dateObj.toISOString().split("T")[0];

          ////////////////////////////////////////////////////////
          // 🔥 LABEL
          ////////////////////////////////////////////////////////

          const dateLabel = formatDate(dateItem.date);

          ////////////////////////////////////////////////////////
          // 🔥 INIT
          ////////////////////////////////////////////////////////

          if (!grouped[dateKey]) {
            grouped[dateKey] = {
              id: `date-${dateKey}`,

              name: dateLabel,

              orderDate: dateKey,

              quantity: 0,

              subtotal: 0,

              discount: 0,

              total: 0,
            };
          }

          ////////////////////////////////////////////////////////
          // 🔥 ACUMULAR
          ////////////////////////////////////////////////////////

          grouped[dateKey].quantity += Number(dateItem.quantity || 0);

          grouped[dateKey].subtotal = round(
            grouped[dateKey].subtotal + Number(dateItem.subtotal || 0),
          );

          grouped[dateKey].discount = round(
            grouped[dateKey].discount + Number(dateItem.discount || 0),
          );

          grouped[dateKey].total = round(
            grouped[dateKey].total + Number(dateItem.total || 0),
          );
        });
      });

      ////////////////////////////////////////////////////////////
      // 🔥 ORDENAR
      ////////////////////////////////////////////////////////////

      return Object.values(grouped).sort((a, b) =>
        b.orderDate.localeCompare(a.orderDate),
      );
    }

    ////////////////////////////////////////////////////////////
    // 🔥 AGRUPAR POR MES
    ////////////////////////////////////////////////////////////

    if (groupBy === "month") {
      rawRows.forEach((item) => {
        (item.dates || []).forEach((dateItem) => {
          if (!dateItem.date) return;

          const date = new Date(dateItem.date);

          if (isNaN(date.getTime())) return;

          const monthKey = `${date.getFullYear()}-${String(
            date.getMonth() + 1,
          ).padStart(2, "0")}`;

          const monthLabel = date.toLocaleDateString("es-BO", {
            month: "long",
            year: "numeric",
          });

          if (!grouped[monthKey]) {
            grouped[monthKey] = {
              id: `month-${monthKey}`,
              name: monthLabel.toUpperCase(),
              orderDate: monthKey,
              quantity: 0,
              subtotal: 0,
              discount: 0,
              total: 0,
            };
          }

          grouped[monthKey].quantity += Number(dateItem.quantity || 0);

          grouped[monthKey].subtotal = round(
            grouped[monthKey].subtotal + Number(dateItem.subtotal || 0),
          );

          grouped[monthKey].discount = round(
            grouped[monthKey].discount + Number(dateItem.discount || 0),
          );

          grouped[monthKey].total = round(
            grouped[monthKey].total + Number(dateItem.total || 0),
          );
        });
      });

      return Object.values(grouped).sort((a, b) =>
        b.orderDate.localeCompare(a.orderDate),
      );
    }
    ////////////////////////////////////////////////////////////
    // 🔥 AGRUPAR NORMAL
    ////////////////////////////////////////////////////////////

    const grouped = {};

    rawRows.forEach((item) => {
      const groupValue = item[groupBy] || "Sin grupo";

      //////////////////////////////////////////////////////////
      // 🔥 INIT
      //////////////////////////////////////////////////////////

      if (!grouped[groupValue]) {
        grouped[groupValue] = {
          id: `${groupBy}-${groupValue}`,

          name: groupValue,

          quantity: 0,

          subtotal: 0,

          discount: 0,

          total: 0,
        };
      }

      //////////////////////////////////////////////////////////
      // 🔥 ACUMULAR
      //////////////////////////////////////////////////////////

      grouped[groupValue].quantity += Number(item.quantity || 0);

      grouped[groupValue].subtotal = round(
        grouped[groupValue].subtotal + Number(item.subtotal || 0),
      );

      grouped[groupValue].discount = round(
        grouped[groupValue].discount + Number(item.discount || 0),
      );

      grouped[groupValue].total = round(
        grouped[groupValue].total + Number(item.total || 0),
      );
    });

    return Object.values(grouped);
  }, [rawRows, groupBy]);

  const totalGeneral = useMemo(() => {
    return Number(
      rows
        .reduce((acc, item) => acc + Number(item.subtotal || 0), 0)
        .toFixed(2),
    );
  }, [rows]);

  const totalDiscount = useMemo(() => {
    return Number(
      rows
        .reduce((acc, item) => acc + Number(item.discount || 0), 0)
        .toFixed(2),
    );
  }, [rows]);

  const totalNeto = useMemo(() => {
    return Number((totalGeneral - totalDiscount).toFixed(2));
  }, [totalGeneral, totalDiscount]);
  const totalUtility = useMemo(() => {
    return Number(
      rows
        .reduce((acc, item) => acc + Number(item.utilityTotal || 0), 0)
        .toFixed(2),
    );
  }, [rows]);

  const totalCostGeneral = useMemo(() => {
    return Number(
      rows
        .reduce((acc, item) => acc + Number(item.totalCost || 0), 0)
        .toFixed(2),
    );
  }, [rows]);

  const firstColumnTitle =
    groupBy === "seller"
      ? "Vendedor"
      : groupBy === "line"
      ? "Línea"
      : groupBy === "brand"
      ? "Marca"
      : groupBy === "branch"
      ? "Sucursal"
      : groupBy === "date"
      ? "Fecha"
      : groupBy === "month"
      ? "Mes"
      : "Producto";

  const columns = useMemo(() => {
    const baseColumns = [
      {
        field: "name",
        headerName: firstColumnTitle,
        flex: 1.8,
        minWidth: 320,
        sortable: true,
        renderCell: (params) => (
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: 4,
            }}
          >
            <div style={{ fontSize: 14, color: "#111827", lineHeight: 1.4 }}>
              {String(params.value || "").toUpperCase()}
            </div>
          </div>
        ),
      },
      {
        field: "quantity",
        headerName: "Cantidad",
        width: 100,
        sortable: true,
        renderCell: (params) => (
          <div style={{ fontSize: 14, color: "#111827", width: "100%" }}>
            {params.value}
          </div>
        ),
      },
    ];

    const detailColumns = !groupBy
      ? [
          ...(canViewProfits
            ? [
                {
                  field: "purchasePrice",
                  headerName: "Costo Unitario",
                  width: 150,
                  sortable: true,
                  renderCell: (params) => (
                    <div
                      style={{
                        fontSize: 14,
                        color: "#64748b",
                        width: "100%",
                      }}
                    >
                      {formatMoney(params.value)}
                    </div>
                  ),
                },
                {
                  field: "totalCost",
                  headerName: "Costo Total",
                  width: 160,
                  sortable: true,
                  renderCell: (params) => (
                    <div
                      style={{
                        fontSize: 14,
                        color: "#64748b",
                        width: "100%",
                        fontWeight: 600,
                      }}
                    >
                      {formatMoney(params.value)}
                    </div>
                  ),
                },
                {
                  field: "price",
                  headerName: "Precio Venta",
                  width: 160,
                  sortable: true,
                  renderCell: (params) => (
                    <div
                      style={{
                        fontSize: 14,
                        color: "#111827",
                        width: "100%",
                        fontWeight: 700,
                      }}
                    >
                      {formatMoney(params.value)}
                    </div>
                  ),
                },
                {
                  field: "utility",
                  headerName: "Utilidad",
                  width: 150,
                  sortable: true,
                  renderCell: (params) => (
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        width: "100%",
                      }}
                    >
                      {formatMoney(params.value)}
                    </div>
                  ),
                },
                {
                  field: "utilityPercent",
                  headerName: "% Utilidad",
                  width: 150,
                  valueGetter: (_, row) => {
                    const cost = Number(row.purchasePrice || 0);
                    const sale = Number(row.price || 0);

                    if (!cost) return 0;

                    return ((sale - cost) / cost) * 100;
                  },
                  renderCell: (params) => {
                    const value = Number(params.value || 0);

                    let color = "#dc2626";

                    if (value >= 80) color = "#16a34a";
                    else if (value >= 30) color = "#ca8a04";

                    return (
                      <div
                        style={{
                          fontWeight: 700,
                          color,
                          width: "100%",
                        }}
                      >
                        {value.toFixed(2)}%
                      </div>
                    );
                  },
                },
                {
                  field: "utilityTotal",
                  headerName: "Utilidad Total",
                  width: 180,
                  sortable: true,
                  renderCell: (params) => (
                    <div
                      style={{
                        fontWeight: 700,
                        width: "100%",
                      }}
                    >
                      {formatMoney(params.value)}
                    </div>
                  ),
                },
              ]
            : [
                {
                  field: "price",
                  headerName: "Precio Venta",
                  width: 150,
                  sortable: true,
                  renderCell: (params) => (
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: "#111827",
                        width: "100%",
                      }}
                    >
                      {formatMoney(params.value)}
                    </div>
                  ),
                },
              ]),

          {
            field: "details",
            headerName: "Detalle",
            width: 170,
            sortable: false,
            filterable: false,
            renderCell: (params) => {
              const details = params.row.details || [];

              if (!details.length || details.length === 1) {
                return (
                  <span
                    style={{
                      color: "#94a3b8",
                      fontSize: 14,
                    }}
                  >
                    Sin desglose
                  </span>
                );
              }

              return (
                <DetailButton
                  type="button"
                  onClick={(event) => openDetailPopover(event, details)}
                >
                  {details.length} precios
                  <ChevronDown size={16} />
                </DetailButton>
              );
            },
          },
        ]
      : [];

    const amountColumns = [
      {
        field: "subtotal",
        headerName: "Subtotal",
        width: 150,
        sortable: true,
        renderCell: (params) => (
          <div style={{ fontSize: 14, color: "#64748b", width: "100%" }}>
            {formatMoney(params.value)}
          </div>
        ),
      },
      {
        field: "discount",
        headerName: "Descuento",
        width: 150,
        sortable: true,
        renderCell: (params) => (
          <div
            style={{
              fontSize: 14,
              color: Number(params.value) > 0 ? "#dc2626" : "#9ca3af",
              width: "100%",
            }}
          >
            {Number(params.value) > 0 ? `- ${formatMoney(params.value)}` : "—"}
          </div>
        ),
      },
      {
        field: "total",
        headerName: "Total Neto",
        width: 150,
        sortable: true,
        renderCell: (params) => (
          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: "#0f766e",
              width: "100%",
            }}
          >
            {formatMoney(params.value)}
          </div>
        ),
      },
    ];

    return [...baseColumns, ...detailColumns, ...amountColumns];
  }, [groupBy, firstColumnTitle]);

  return (
    <Wrapper>
      <Header>
        <HeaderTitle>
          <Title>Matriz de Ventas</Title>
          <Subtitle>{fechaHoy()}</Subtitle>
        </HeaderTitle>
        <AddButton type="button" onClick={() => setOpenFilters(true)}>
          Filtros
        </AddButton>
      </Header>

      <Content>
        <GroupBar>
          <GroupButton $active={groupBy === ""} onClick={() => setGroupBy("")}>
            General
          </GroupButton>
          <GroupButton
            $active={groupBy === "seller"}
            onClick={() => setGroupBy("seller")}
          >
            Vendedores
          </GroupButton>
          <GroupButton
            $active={groupBy === "line"}
            onClick={() => setGroupBy("line")}
          >
            Líneas
          </GroupButton>
          <GroupButton
            $active={groupBy === "brand"}
            onClick={() => setGroupBy("brand")}
          >
            Marcas
          </GroupButton>
          <GroupButton
            $active={groupBy === "branch"}
            onClick={() => setGroupBy("branch")}
          >
            Sucursales
          </GroupButton>
          <GroupButton
            $active={groupBy === "date"}
            onClick={() => setGroupBy("date")}
          >
            Fechas
          </GroupButton>

          <GroupButton
            $active={groupBy === "month"}
            onClick={() => setGroupBy("month")}
          >
            Meses
          </GroupButton>
        </GroupBar>

        <TableWrapper>
          <DataGrid
            rows={rows}
            columns={columns}
            getRowId={(row) => row.id}
            disableRowSelectionOnClick
            pageSizeOptions={[10, 20, 50]}
            getRowHeight={() => 74}
            initialState={{
              pagination: { paginationModel: { pageSize: 10 } },
            }}
            sx={{
              border: "none",
              fontSize: 14,
              fontFamily: "inherit",
              backgroundColor: "white",
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#f8fafc",
                borderBottom: "1px solid #ececec",
                minHeight: "58px !important",
                maxHeight: "58px !important",
              },
              "& .MuiDataGrid-columnHeader": { padding: "0 18px" },
              "& .MuiDataGrid-columnHeaderTitle": {
                fontWeight: 700,
                fontSize: 14,
                color: "#111827",
              },
              "& .MuiDataGrid-row": {
                backgroundColor: "white",
                transition: "all 0.2s ease",
              },
              "& .MuiDataGrid-row:hover": { backgroundColor: "#fafafa" },
              "& .MuiDataGrid-cell": {
                borderBottom: "1px solid #f3f4f6",
                display: "flex",
                alignItems: "center",
                padding: "0 18px",
                fontSize: 14,
                color: "#111827",
                outline: "none !important",
              },
              "& .MuiDataGrid-footerContainer": {
                borderTop: "1px solid #ececec",
                minHeight: 56,
              },
              "& .MuiTablePagination-root": { fontSize: 14 },
            }}
          />
          <Popover
            open={detailPopoverOpen}
            anchorEl={anchorEl}
            onClose={closeDetailPopover}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            slotProps={{
              paper: {
                sx: {
                  mt: 1,
                  borderRadius: "20px",
                  boxShadow: "none",
                  background: "transparent",
                },
              },
            }}
          >
            <DetailPopoverCard>
              <DetailPopoverTitle>Detalle de venta</DetailPopoverTitle>

              <DetailPopoverTable>
                <DetailPopoverHead>
                  <span>Unidad base</span>
                  <span>Precio venta</span>
                  <span>Cantidad</span>
                  <span>Subtotal</span>
                </DetailPopoverHead>

                {selectedDetails.map((detail, index) => (
                  <DetailPopoverRow key={`${detail.finalPrice}-${index}`}>
                    <span>{detail.unitName || "-"}</span>

                    <span>{formatMoney(detail.finalPrice)}</span>

                    <span>{detail.quantity}</span>

                    <span>{formatMoney(detail.subtotal)}</span>
                  </DetailPopoverRow>
                ))}
              </DetailPopoverTable>
            </DetailPopoverCard>
          </Popover>
        </TableWrapper>

        <TotalBar>
          {!groupBy && canViewProfits && (
            <>
              <TotalText $bold >
                Total Costos
              </TotalText>

              <TotalText
                style={{
                  color: "#000000",
                }}
              >
                {formatMoney(totalCostGeneral)}
              </TotalText>
              <TotalText $bold style={{ color: "#16a34a" }}>
                Total Utilidad
              </TotalText>

              <TotalText
                style={{
                  color: "#16a34a",
                }}
              >
                {formatMoney(totalUtility)}
              </TotalText>
            </>
          )}
          <TotalText $bold>Subtotal</TotalText>
          <TotalText>
            {`Bs ${totalGeneral.toLocaleString("es-BO", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`}
          </TotalText>

          {totalDiscount > 0 && (
            <>
              <TotalText $bold style={{ color: "#dc2626" }}>
                Descuentos
              </TotalText>
              <TotalText style={{ color: "#dc2626" }}>
                {`- Bs ${totalDiscount.toLocaleString("es-BO", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`}
              </TotalText>
            </>
          )}

          <TotalText $bold style={{ color: "#0f766e" }}>
            Total Neto
          </TotalText>
          <TotalText style={{ color: "#0f766e", fontWeight: 700 }}>
            {`Bs ${totalNeto.toLocaleString("es-BO", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`}
          </TotalText>
        </TotalBar>
      </Content>

      <KardexFiltersModal
        groupBy={groupBy}
        open={openFilters}
        onClose={() => setOpenFilters(false)}
        onGenerate={(data) => {
          setRawRows(data);
          setOpenFilters(false);
        }}
      />
    </Wrapper>
  );
}
