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

const formatPercent = (value) => `${Number(value || 0)}%`;

function MarginProfit() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrandId, setSelectedBrandId] = useState("all");

  const { products, isLoading } = useInventory();
  const { lines } = useLines();
  const { updateMargen } = useProduct();
  const calculateCostWithIva = (unitCost) => {
    return Number(unitCost || 0) * 1.1494;
  };
  // filtros de marcas
  const brandFilters = useMemo(() => {
    return [
      { id: "all", name: "Todos" },
      ...lines.map((line) => ({
        id: line.id,
        name: line.name,
      })),
    ];
  }, [lines]);
  // mapeo de productos
  const rows = useMemo(() => {
    return products.map((product) => {
      const unitCost = Number(product.purchasePrice || 0);
      const costIva = calculateCostWithIva(unitCost);
      const profitMargin = Number(product.porcentajeGanancia || 0);

      return {
        id: product.id,
        brandId: product.lineId,
        brand: product.line?.name ?? "Sin marca",
        line: product.brandName ?? "Sin línea",
        product: product.name,
        stock: product.stockTotal ?? 0,

        unitCost,
        costIva,

        profitMargin,
        executivePrice: Math.round(costIva * (1 + profitMargin / 100)),

        quantityPercent: "",
        quantityPrice: "",
        bossPercent: "",
        bossPrice: "",
      };
    });
  }, [products]);

  const filteredRows = useMemo(() => {
    const value = searchTerm.trim().toLowerCase();
    return rows.filter((row) => {
      const matchesBrand =
        selectedBrandId === "all" || row.brandId === selectedBrandId;
      const matchesSearch =
        !value ||
        [row.brand, row.line, row.product]
          .join(" ")
          .toLowerCase()
          .includes(value);
      return matchesBrand && matchesSearch;
    });
  }, [rows, searchTerm, selectedBrandId]);

  // guardado de la columna "Porcentaje ganacia"
  const handleProcessRowUpdate = async (newRow, oldRow) => {
    try {
      const profitMargin = Number(newRow.profitMargin || 0);

      if (Number.isNaN(profitMargin)) {
        return oldRow;
      }

      ////////////////////////////////////////////////////
      // CALCULAR
      ////////////////////////////////////////////////////

      const executivePrice = Math.round(
        Number(newRow.costIva || 0) * (1 + profitMargin / 100),
      );

      ////////////////////////////////////////////////////
      // UPDATE API
      ////////////////////////////////////////////////////

      await updateMargen(newRow.id, {
        porcentajeGanancia: profitMargin,
      });

      ////////////////////////////////////////////////////
      // SOCKET
      ////////////////////////////////////////////////////

      socket.emit("updateProductMargin", {
        id: newRow.id,
        porcentajeGanancia: profitMargin,
      });

      ////////////////////////////////////////////////////
      // RETURN
      ////////////////////////////////////////////////////

      return {
        ...newRow,

        profitMargin,

        executivePrice
      };
    } catch (error) {
      console.error(error);

      return oldRow;
    }
  };

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
        headerName: "Nombre del producto",
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
        valueFormatter: (value) => formatMoney(value),
      },
      {
        field: "costIva",
        headerName: "Costo + IVA",
        flex: 1,
        minWidth: 140,
        valueFormatter: (value) => formatMoney(value),
      },
      {
        field: "profitMargin",
        headerName: "Margen de ganancia",
        editable: true,
        type: "number",

        valueFormatter: (value) => `${Number(value || 0)}%`,

        preProcessEditCellProps: (params) => {
          const hasError = isNaN(Number(params.props.value));

          return {
            ...params.props,
            error: hasError,
          };
        },
      },
      {
        field: "executivePrice",
        headerName: "Precio ejecutivo",
        flex: 1,
        minWidth: 160,
        valueFormatter: (value) => formatMoney(value),
      },
      {
        field: "quantityPercent",
        headerName: "% Cantidad",
        flex: 0.9,
        minWidth: 130,
        valueFormatter: (value) => formatPercent(value),
      },
      {
        field: "quantityPrice",
        headerName: "Precio cantidad",
        flex: 1,
        minWidth: 160,
        valueFormatter: (value) => formatMoney(value),
      },
      {
        field: "bossPercent",
        headerName: "% Jefe",
        flex: 0.9,
        minWidth: 120,
        valueFormatter: (value) => formatPercent(value),
      },
      {
        field: "bossPrice",
        headerName: "Precio jefe",
        flex: 1,
        minWidth: 150,
        valueFormatter: (value) => formatMoney(value),
      },
    ],
    [],
  );

  return (
    <PageSurface>
      <PageWrapper>
        <HeaderTitle>
          <Title>Márgenes y Utilidades</Title>
          <Subtitle>{fechaHoy()}</Subtitle>
        </HeaderTitle>

        <Toolbar>
          <SearchBox>
            <Search size={18} />

            <SearchInput
              type="text"
              placeholder="Buscar producto, marca o línea"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </SearchBox>
        </Toolbar>

        <FilterButtonGroup>
          {brandFilters.map((brand) => (
            <FilterButton
              key={brand.id}
              type="button"
              $active={selectedBrandId === brand.id}
              onClick={() => setSelectedBrandId(brand.id)}
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
