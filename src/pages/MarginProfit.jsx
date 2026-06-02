import React, { useMemo, useState } from "react";
import { Search } from "lucide-react";

import DataTable from "../components/table/DataTable";

import useInventory from "../hooks/useInventory";
import { useLines } from "../hooks/useLine";
import { useProduct } from "../hooks/useProduct";

import {
  PageSurface,
  PageWrapper,
  HeaderTitle,
  Title,
  Subtitle,
  Toolbar,
  SearchBox,
  SearchInput,
  FilterButtonGroup,
  FilterButton,
} from "../components/ui/Page.styles";

import { socket } from "../services/SocketIOConnection";

const fechaHoy = () => {
  const fecha = new Date().toLocaleDateString("es-BO", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return fecha.charAt(0).toUpperCase() + fecha.slice(1);
};

const formatMoney = (value) =>
  `Bs ${Number(value || 0).toLocaleString("es-BO", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const formatPercent = (value) =>
  `${Math.round(Number(value || 0))}%`;

function MarginProfit() {
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedBrandId, setSelectedBrandId] =
    useState("all");

  ////////////////////////////////////////////////////
  // ESTADOS TEMPORALES DE EDICIÓN
  ////////////////////////////////////////////////////

  const [editingDiscounts, setEditingDiscounts] =
    useState({});

  const [editingBossDiscounts, setEditingBossDiscounts] =
    useState({});

  const { products, isLoading } = useInventory();

  const { lines } = useLines();

  const { updateMargen } = useProduct();

  ////////////////////////////////////////////////////
  // COSTO + IVA
  ////////////////////////////////////////////////////

  const calculateCostWithIva = (unitCost) => {
    return Number(unitCost || 0) * 1.1494;
  };

  ////////////////////////////////////////////////////
  // FILTROS
  ////////////////////////////////////////////////////

  const brandFilters = useMemo(() => {
    return [
      { id: "all", name: "Todos" },

      ...lines.map((line) => ({
        id: line.id,
        name: line.name,
      })),
    ];
  }, [lines]);

  ////////////////////////////////////////////////////
  // ROWS
  ////////////////////////////////////////////////////

  const rows = useMemo(() => {
    return products.map((product) => {
      const unitCost = Number(
        product.purchasePrice || 0,
      );

      const costIva =
        calculateCostWithIva(unitCost);

      const profitMargin = Number(
        product.porcentajeGanancia || 0,
      );

      ////////////////////////////////////////////////////
      // DESCUENTOS
      ////////////////////////////////////////////////////

      const quantityDiscount = Number(
        product.quantityDiscount || 0,
      );

      const bossDiscount = Number(
        product.bossDiscount || 0,
      );

      ////////////////////////////////////////////////////
      // PRECIO EJECUTIVO
      ////////////////////////////////////////////////////

      const executivePrice = Math.round(
        costIva * (1 + profitMargin / 100),
      );

      ////////////////////////////////////////////////////
      // +5 UNIDADES
      ////////////////////////////////////////////////////

      const quantityPrice =
        executivePrice - quantityDiscount;

      const quantityPercent =
        costIva > 0
          ? ((quantityPrice - costIva) / costIva) *
            100
          : 0;

      ////////////////////////////////////////////////////
      // JEFE
      ////////////////////////////////////////////////////

      const bossPrice =
        executivePrice - bossDiscount;

      const bossPercent =
        costIva > 0
          ? ((bossPrice - costIva) / costIva) *
            100
          : 0;

      return {
        id: product.id,

        brandId: product.lineId,

        brand:
          product.line?.name ?? "Sin marca",

        line:
          product.brandName ?? "Sin línea",

        product: product.name,

        stock: product.stockTotal ?? 0,

        unitCost,

        costIva,

        profitMargin,

        executivePrice,

        ////////////////////////////////////////////////////
        // +5
        ////////////////////////////////////////////////////

        quantityDiscount,

        quantityPrice,

        quantityPercent,

        ////////////////////////////////////////////////////
        // JEFE
        ////////////////////////////////////////////////////

        bossDiscount,

        bossPrice,

        bossPercent,
      };
    });
  }, [products]);

  ////////////////////////////////////////////////////
  // FILTRADO
  ////////////////////////////////////////////////////

  const filteredRows = useMemo(() => {
    const value = searchTerm
      .trim()
      .toLowerCase();

    return rows.filter((row) => {
      const matchesBrand =
        selectedBrandId === "all" ||
        row.brandId === selectedBrandId;

      const matchesSearch =
        !value ||
        [row.brand, row.line, row.product]
          .join(" ")
          .toLowerCase()
          .includes(value);

      return matchesBrand && matchesSearch;
    });
  }, [rows, searchTerm, selectedBrandId]);

  ////////////////////////////////////////////////////
  // UPDATE
  ////////////////////////////////////////////////////

  const handleProcessRowUpdate = async (
    newRow,
    oldRow,
  ) => {
    try {
      ////////////////////////////////////////////////////
      // VALORES
      ////////////////////////////////////////////////////

      const profitMargin = Number(
        newRow.profitMargin || 0,
      );

      const quantityDiscount =
        editingDiscounts[newRow.id] !== undefined
          ? Number(
              editingDiscounts[newRow.id],
            )
          : Number(
              newRow.quantityDiscount || 0,
            );

      const bossDiscount =
        editingBossDiscounts[newRow.id] !==
        undefined
          ? Number(
              editingBossDiscounts[
                newRow.id
              ],
            )
          : Number(
              newRow.bossDiscount || 0,
            );

      ////////////////////////////////////////////////////
      // VALIDACIONES
      ////////////////////////////////////////////////////

      if (
        Number.isNaN(profitMargin) ||
        Number.isNaN(quantityDiscount) ||
        Number.isNaN(bossDiscount)
      ) {
        return oldRow;
      }

      ////////////////////////////////////////////////////
      // PRECIO EJECUTIVO
      ////////////////////////////////////////////////////

      const executivePrice = Math.round(
        Number(newRow.costIva || 0) *
          (1 + profitMargin / 100),
      );

      ////////////////////////////////////////////////////
      // +5 UNIDADES
      ////////////////////////////////////////////////////

      const quantityPrice =
        executivePrice - quantityDiscount;

      const quantityPercent =
        Number(newRow.costIva || 0) > 0
          ? ((quantityPrice -
              Number(newRow.costIva || 0)) /
              Number(newRow.costIva || 0)) *
            100
          : 0;

      ////////////////////////////////////////////////////
      // JEFE
      ////////////////////////////////////////////////////

      const bossPrice =
        executivePrice - bossDiscount;

      const bossPercent =
        Number(newRow.costIva || 0) > 0
          ? ((bossPrice -
              Number(newRow.costIva || 0)) /
              Number(newRow.costIva || 0)) *
            100
          : 0;

      ////////////////////////////////////////////////////
      // BACKEND
      ////////////////////////////////////////////////////

      await updateMargen(newRow.id, {
        porcentajeGanancia: profitMargin,

        quantityDiscount,

        bossDiscount,
      });

      ////////////////////////////////////////////////////
      // SOCKET
      ////////////////////////////////////////////////////

      socket.emit("updateProductMargin", {
        id: newRow.id,

        porcentajeGanancia: profitMargin,

        quantityDiscount,

        bossDiscount,
      });

      ////////////////////////////////////////////////////
      // LIMPIAR ESTADOS TEMPORALES
      ////////////////////////////////////////////////////

      setEditingDiscounts((prev) => {
        const copy = { ...prev };

        delete copy[newRow.id];

        return copy;
      });

      setEditingBossDiscounts((prev) => {
        const copy = { ...prev };

        delete copy[newRow.id];

        return copy;
      });

      ////////////////////////////////////////////////////
      // RETURN
      ////////////////////////////////////////////////////

      return {
        ...newRow,

        profitMargin,

        executivePrice,

        quantityDiscount,
        quantityPrice,
        quantityPercent,

        bossDiscount,
        bossPrice,
        bossPercent,
      };
    } catch (error) {
      console.error(error);

      return oldRow;
    }
  };

  // verificacion de porcentajes para el cambio de color por celdas
  const getPercentCellClassName = (params) => {
    const percent = Number(params.value || 0);
    if (percent < 30) return "percent-cell-danger";
    if (percent < 80) return "percent-cell-warning";
    return "percent-cell-success";
  };

  ////////////////////////////////////////////////////
  // COLUMNAS
  ////////////////////////////////////////////////////

  const columns = useMemo(
    () => [
      {
        field: "brand",
        headerName: "Marca",
        flex: 1,
        minWidth: 150,
      },

      {
        field: "line",
        headerName: "Línea",
        flex: 1,
        minWidth: 150,
      },

      {
        field: "product",
        headerName:
          "Nombre del producto",
        flex: 1.7,
        minWidth: 260,
      },

      {
        field: "stock",
        headerName: "Stock en almacén",
        flex: 0.9,
        minWidth: 150,
        type: "number",
      },

      {
        field: "unitCost",
        headerName: "Costo unit.",
        flex: 1,
        minWidth: 140,
        valueFormatter: (value) =>
          formatMoney(value),
      },

      {
        field: "costIva",
        headerName: "Costo + IVA",
        flex: 1,
        minWidth: 140,
        valueFormatter: (value) =>
          formatMoney(value),
      },

      {
        field: "profitMargin",
        headerName: "%",
        editable: true,
        type: "number",
        flex: 0.8,
        minWidth: 100,
        cellClassName: getPercentCellClassName,
        valueFormatter: (value) => `${Number(value || 0)}%`,
      },

      {
        field: "executivePrice",
        headerName: "Precio ejecutivo",
        flex: 1,
        minWidth: 160,
        valueFormatter: (value) =>
          formatMoney(value),
      },

      ////////////////////////////////////////////////////
      // +5
      ////////////////////////////////////////////////////

      {
        field: "quantityPercent",
        headerName: "%",
        flex: 0.9,
        minWidth: 100,
        cellClassName: getPercentCellClassName,
        valueFormatter: (value) => formatPercent(value),
      },

      {
        field: "quantityPrice",

        headerName:
          "Precio arriba 5 unidades",

        flex: 1,

        minWidth: 160,

        editable: true,

        valueFormatter: (value) =>
          formatMoney(value),

        renderEditCell: (params) => {
          return (
            <input
              type="number"
              defaultValue={
                params.row.quantityDiscount
              }
              autoFocus
              onChange={(e) => {
                setEditingDiscounts(
                  (prev) => ({
                    ...prev,

                    [params.id]: Number(
                      e.target.value,
                    ),
                  }),
                );
              }}
              onBlur={() => {
                params.api.stopCellEditMode({
                  id: params.id,

                  field: "quantityPrice",
                });
              }}
              style={{
                width: "100%",
                height: "100%",
                border: "none",
                outline: "none",
                padding: "0 8px",
              }}
            />
          );
        },
      },

      ////////////////////////////////////////////////////
      // JEFE
      ////////////////////////////////////////////////////

      {
        field: "bossPercent",
        headerName: "%",
        flex: 0.9,
        minWidth: 100,
        cellClassName: getPercentCellClassName,
        valueFormatter: (value) => formatPercent(value),
      },

      {
        field: "bossPrice",

        headerName: "Precio jefe",

        flex: 1,

        minWidth: 150,

        editable: true,

        valueFormatter: (value) =>
          formatMoney(value),

        renderEditCell: (params) => {
          return (
            <input
              type="number"
              defaultValue={
                params.row.bossDiscount
              }
              autoFocus
              onChange={(e) => {
                setEditingBossDiscounts(
                  (prev) => ({
                    ...prev,

                    [params.id]: Number(
                      e.target.value,
                    ),
                  }),
                );
              }}
              onBlur={() => {
                params.api.stopCellEditMode({
                  id: params.id,

                  field: "bossPrice",
                });
              }}
              style={{
                width: "100%",
                height: "100%",
                border: "none",
                outline: "none",
                padding: "0 8px",
              }}
            />
          );
        },
      },
    ],
    [editingDiscounts, editingBossDiscounts],
  );

  return (
    <PageSurface>
      <PageWrapper>
        <HeaderTitle>
          <Title>
            Márgenes y Utilidades
          </Title>

          <Subtitle>{fechaHoy()}</Subtitle>
        </HeaderTitle>

        <Toolbar>
          <SearchBox>
            <Search size={18} />

            <SearchInput
              type="text"
              placeholder="Buscar producto, marca o línea"
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(
                  event.target.value,
                )
              }
            />
          </SearchBox>
        </Toolbar>

        <FilterButtonGroup>
          {brandFilters.map((brand) => (
            <FilterButton
              key={brand.id}
              type="button"
              $active={
                selectedBrandId === brand.id
              }
              onClick={() =>
                setSelectedBrandId(
                  brand.id,
                )
              }
            >
              {brand.name}
            </FilterButton>
          ))}
        </FilterButtonGroup>

        <DataTable
          rows={filteredRows}
          columns={columns}
          loading={isLoading}
          pageSize={7}
          pageSizeOptions={[7, 10, 20]}
          noRowsLabel="No hay productos registrados"
          processRowUpdate={handleProcessRowUpdate}
          experimentalFeatures={{
            newEditingApi: true,
          }}
        />
      </PageWrapper>
    </PageSurface>
  );
}

export default MarginProfit;