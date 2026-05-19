import React, { useMemo, useState } from "react";
import AppLayout from "../components/layout/AppLayout";
import DataTable from "../components/table/DataTable";
import { Search, Pencil, Trash2, Plus } from "lucide-react";
import {
  PageSurface,
  PageWrapper,
  HeaderTitle,
  Title,
  Subtitle,
  SearchBox,
  SearchInput,
  Toolbar,
  PrimaryActionButton,
} from "../components/ui/Customer.styles";
import { useSucursales } from "../hooks/useSucursales";

const fechaHoy = () =>
  new Date().toLocaleDateString("es-BO", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const mapLocationType = (type) => {
  if (type === "WAREHOUSE") return "Almacén";
  if (type === "BRANCH") return "Sucursal";
  return "Sin tipo";
};

function Locations() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data, deleteLocation, loading, isLoading } = useSucursales();

  const locations = useMemo(() => {
    return data.map((location) => ({
      id: location.id,
      name: location.name,
      type: mapLocationType(location.type),
      abbreviation: location.abbreviation,
      address: location.address ?? "Sin dirección",
      saleCounter: location.saleCounter,
      isVisible: location.isVisible,
    }));
  }, [data]);

  const filteredLocations = useMemo(() => {
    const value = searchTerm.trim().toLowerCase();
    if (!value) return locations;
    return locations.filter((location) =>
      [
        location.name,
        location.type,
        location.abbreviation,
        location.address,
      ]
        .join(" ")
        .toLowerCase()
        .includes(value)
    );
  }, [searchTerm, locations]);

  const locationColumns = useMemo(
    () => [
      {
        field: "name",
        headerName: "Nombre",
        flex: 1.4,
        minWidth: 180,
      },
      {
        field: "type",
        headerName: "Tipo",
        flex: 0.9,
        minWidth: 130,
      },
      {
        field: "abbreviation",
        headerName: "Abreviatura",
        flex: 1,
        minWidth: 140,
      },
      {
        field: "address",
        headerName: "Dirección",
        flex: 1.6,
        minWidth: 220,
      },
    ],
    []
  );

  const locationActions = useMemo(
    () => [
      {
        key: "edit",
        title: "Editar sucursal",
        icon: Pencil,
        onClick: (location) => {
          console.log("Editar sucursal:", location);
        },
      },
      {
        key: "delete",
        title: "Eliminar sucursal",
        icon: Trash2,
        onClick: (location) => {
          deleteLocation(location.id);
        },
      },
    ],
    [deleteLocation]
  );

  const handleAddLocation = () => {
    console.log("Agregar sucursal");
  };

  return (
    <AppLayout>
      <PageSurface>
        <PageWrapper>
          <HeaderTitle>
            <Title>Sucursales</Title>
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

            <PrimaryActionButton type="button" onClick={handleAddLocation}>
              <Plus size={17} />
              Agregar sucursal
            </PrimaryActionButton>
          </Toolbar>

          <DataTable
            rows={filteredLocations}
            columns={locationColumns}
            actions={locationActions}
            pageSize={7}
            pageSizeOptions={[7, 10, 20]}
            noRowsLabel="No hay sucursales registradas"
          />
        </PageWrapper>
      </PageSurface>
    </AppLayout>
  );
}

export default Locations;
