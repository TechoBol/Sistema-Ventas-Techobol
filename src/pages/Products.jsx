import React, { useState } from "react";

import { DataGrid } from "@mui/x-data-grid";

import AppLayout from "../components/layout/AppLayout";

import ProductForm from "../components/forms/ProductForm";

import useInventory from "../hooks/useInventory";

import {
  PageContainer,
  PageHeader,
  Title,
  AddButton,
  TableContainer,
  SearchInput,
  TopActions,
  SearchWrapper,
  ActionButton,
} from "../components/ui/Products";
import { Pencil, Plus } from "lucide-react";

function Products() {
  const [showForm, setShowForm] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState(null);

  const { products, search, onFilterTextBoxChanged, isLoading } =
    useInventory();

  const columns = [
    {
      field: "code",
      headerName: "Código",
      flex: 1,
      minWidth: 110,
    },

    {
      field: "name",
      headerName: "Nombre",
      flex: 1.5,
      minWidth: 110,
    },
    {
      field: "line",
      headerName: "Marca",
      flex: 1.2,
      minWidth: 110,

      valueGetter: (_, row) => row?.line?.name || "-",
    },

    {
      field: "brandName",
      headerName: "Linea",
      flex: 1.2,
      minWidth: 110,
    },

    {
      field: "price",
      headerName: "Costo",
      flex: 1,
      minWidth: 110,

      valueFormatter: (value) => `${Number(value || 0).toFixed(2)}`,
    },

    {
      field: "finalPrice",
      headerName: "Venta",
      flex: 1,
      minWidth: 110,

      valueFormatter: (value) => `${Number(value || 0).toFixed(2)}`,
    },

    {
      field: "stockTotal",
      headerName: "Stock",
      flex: 0.8,
      minWidth: 110,
    },

    {
      field: "actions",
      headerName: "",
      width: 120,
      sortable: false,
      filterable: false,

      renderCell: (params) => (
        <ActionButton
          title="Editar producto"
          onClick={() => {
            setSelectedProduct(params.row);
            setShowForm(true);
          }}
        >
          <Pencil size={20} strokeWidth={2.3} />
        </ActionButton>
      ),
    },
  ];

  return (
    <AppLayout>
      <PageContainer>
        {!showForm ? (
          <>
            <PageHeader>
              <Title>Productos</Title>

              <TopActions>
                <SearchWrapper>
                  <SearchInput
                    value={search}
                    onChange={onFilterTextBoxChanged}
                    placeholder="Buscar producto..."
                  />
                </SearchWrapper>

                <AddButton
                  onClick={() => {
                    setSelectedProduct(null);
                    setShowForm(true);
                  }}
                >
                  Añadir Producto
                  <Plus size={18} strokeWidth={3} />
                </AddButton>
              </TopActions>
            </PageHeader>

            <TableContainer>
              <DataGrid
                rows={products || []}
                columns={columns}
                loading={isLoading}
                autoHeight
                disableRowSelectionOnClick
                hideFooter
                getRowId={(row) => row.id}
                localeText={{
                  noRowsLabel: "No hay productos registrados",
                }}
              />
            </TableContainer>
          </>
        ) : (
          <ProductForm
            product={selectedProduct}
            onBack={() => {
              setShowForm(false);
              setSelectedProduct(null);
            }}
          />
        )}
      </PageContainer>
    </AppLayout>
  );
}

export default Products;
