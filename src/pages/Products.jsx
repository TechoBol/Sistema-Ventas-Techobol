import React, { useMemo, useState } from "react";

import ProductForm from "../components/forms/ProductForm";
import DataTable from "../components/table/DataTable";

import useInventory from "../hooks/useInventory";
import { usePermissions } from "../hooks/usePermissions";
import {
  PageContainer,
  PageHeader,
  HeaderTitle,
  Title,
  Subtitle,
  AddButton,
  SearchInput,
  TopActions,
  SearchWrapper,
} from "../components/ui/Products";
import { Pencil, Plus, Search } from "lucide-react";
import { useLoginStore } from "../components/store/loginStore";
import { useLocationStore } from "../components/store/locationStore";

const fechaHoy = () => {
  const fecha = new Date().toLocaleDateString("es-BO", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return fecha.charAt(0).toUpperCase() + fecha.slice(1);
};

function Products() {
  const [showForm, setShowForm] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const { location } = useLoginStore();
  const { selectedLocation } = useLocationStore();
  const permissions = usePermissions();

  const activeLocationId =
    permissions.isAdmin || permissions.isManager
      ? selectedLocation?.id
      : location?.id;
      
  const { products, search, onFilterTextBoxChanged, isLoading } =
    useInventory();
  ////////////////////////////////////////////////////////////
  // EDITAR PRODUCTO
  ////////////////////////////////////////////////////////////

  const handleEditProduct = (product) => {
    if (!permissions.canEditProduct) return;

    setSelectedProduct(product);
    setShowForm(true);
  };

  ////////////////////////////////////////////////////////////
  // COLUMNAS TABLA
  ////////////////////////////////////////////////////////////

  const columns = useMemo(
    () => [
      {
        field: "code",
        headerName: "Código",
        flex: 1,
      },

      {
        field: "name",
        headerName: "Nombre",
        flex: 1.5,
      },
      {
        field: "purchasePrice",
        headerName: "Precio Unitario",
        flex: 1,
        valueFormatter: (value) => `${Number(value || 0).toFixed(2)}`,
      },

      {
        field: "salePrice",
        headerName: "Precio Venta",
        flex: 1,
        valueFormatter: (value) => `${Number(value || 0).toFixed(2)}`,
      },

      {
        field: "baseUnit",
        headerName: "Unidad Base",
        flex: 1,
        valueGetter: (_, row) => row?.baseUnit?.name || "-",
      },

      {
        field: "stock",
        headerName: "Stock",
        flex: 0.8,

        valueGetter: (_, row) => {
          const inventory = row?.inventories?.find(
            (inv) => inv.locationId === activeLocationId,
          );

          return inventory?.quantity || 0;
        },

        valueFormatter: (value) => Number(value || 0).toFixed(2),
      },
    ],
    [activeLocationId],
  );

  ////////////////////////////////////////////////////////////
  // ACCIONES
  ////////////////////////////////////////////////////////////
  const actions = useMemo(
    () =>
      permissions.canEditProduct
        ? [
            {
              key: "edit",
              title: "Editar producto",
              icon: Pencil,
              onClick: handleEditProduct,
            },
          ]
        : [],
    [permissions],
  );

  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      product.inventories?.some((inv) => inv.locationId === activeLocationId),
    );
  }, [products, activeLocationId]);
  ////////////////////////////////////////////////////////////
  // RENDER
  ////////////////////////////////////////////////////////////

  return (
    <>
      <PageContainer>
        {!showForm ? (
          <>
            <PageHeader>
              <HeaderTitle>
                <Title>Inventario</Title>

                <Subtitle>{fechaHoy()}</Subtitle>
              </HeaderTitle>

              <TopActions>
                <SearchWrapper>
                  <Search size={18} />
                  <SearchInput
                    value={search}
                    onChange={onFilterTextBoxChanged}
                    placeholder="Buscar producto..."
                  />
                </SearchWrapper>

                {permissions.canCreateProduct && (
                  <AddButton
                    type="button"
                    onClick={() => {
                      setSelectedProduct(null);
                      setShowForm(true);
                    }}
                  >
                    <Plus size={18} strokeWidth={3} />
                    Añadir Producto
                  </AddButton>
                )}
              </TopActions>
            </PageHeader>

            <DataTable
              rows={filteredProducts || []}
              columns={columns}
              actions={actions}
              loading={isLoading}
              getRowId={(row) => row.id}
              pageSize={7}
              pageSizeOptions={[7, 10, 20]}
              noRowsLabel="No hay productos registrados"
            />
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
    </>
  );
}

export default Products;
