import React, { useMemo, useState } from "react";
import AppLayout from "../components/layout/AppLayout";
import DataTable from "../components/table/DataTable";
import BrandModal from "../components/modals/BrandModal";
import { Search, Pencil, Trash2, Plus, ChevronDown } from "lucide-react";
import Popover from "@mui/material/Popover";

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
  BrandLinesCell,
  BrandLineChip,
  BrandMoreButton,
  BrandPopoverContent,
  BrandPopoverTitle,
  BrandPopoverList,
  BrandPopoverItem,
} from "../components/ui/Page.styles";

const fechaHoy = () =>
  new Date().toLocaleDateString("es-BO", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const brandsMock = [
  {
    id: 1,
    name: "Tramontina",
    lines: ["Herramientas", "Jardinería", "Cocina", "Electricidad"],
  },
  {
    id: 2,
    name: "Bosch",
    lines: ["Taladros", "Sierras", "Accesorios", "Medición", "Industrial"],
  },
  {
    id: 3,
    name: "Stanley",
    lines: ["Manuales", "Construcción", "Seguridad"],
  },
];

function BrandLinesPreview({ lines = [] }) {
  const [anchorEl, setAnchorEl] = useState(null);

  if (!lines.length) return "-";

  const visibleLines = lines.slice(0, 2);
  const extraCount = lines.length - visibleLines.length;

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <BrandLinesCell>
        {visibleLines.map((line) => (
          <BrandLineChip key={line}>{line}</BrandLineChip>
        ))}

        {extraCount > 0 && (
          <BrandMoreButton type="button" onClick={handleOpen}>
            +{extraCount} más
            <ChevronDown size={14} />
          </BrandMoreButton>
        )}
      </BrandLinesCell>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
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
              borderRadius: "14px",
              boxShadow: "0 12px 28px rgba(15, 23, 42, 0.14)",
              padding: "14px 16px",
              minWidth: "220px",
            },
          },
        }}
      >
        <BrandPopoverContent>
          <BrandPopoverTitle>Líneas de la marca</BrandPopoverTitle>

          <BrandPopoverList>
            {lines.map((line) => (
              <BrandPopoverItem key={line}>{line}</BrandPopoverItem>
            ))}
          </BrandPopoverList>
        </BrandPopoverContent>
      </Popover>
    </>
  );
}

function Brands() {
  const [searchTerm, setSearchTerm] = useState("");
  const [brands, setBrands] = useState(brandsMock);
  const [modalState, setModalState] = useState({
    open: false,
    mode: "create",
    selectedBrand: null,
  });

  const filteredBrands = useMemo(() => {
    const value = searchTerm.trim().toLowerCase();

    if (!value) return brands;

    return brands.filter((brand) =>
      [brand.name, ...(brand.lines || [])]
        .join(" ")
        .toLowerCase()
        .includes(value)
    );
  }, [searchTerm, brands]);

  const brandColumns = useMemo(
    () => [
      {
        field: "name",
        headerName: "Nombre",
        flex: 1,
        minWidth: 180,
      },
      {
        field: "lines",
        headerName: "Líneas",
        flex: 1.8,
        minWidth: 320,
        sortable: false,
        renderCell: (params) => <BrandLinesPreview lines={params.row.lines} />,
      },
    ],
    []
  );

  // ACCIONES MODAL
  const openCreateModal = () => {
    setModalState({
      open: true,
      mode: "create",
      selectedBrand: null,
    });
  };

  const openEditModal = (brand) => {
    setModalState({
      open: true,
      mode: "edit",
      selectedBrand: brand,
    });
  };

  const closeModal = () => {
    setModalState({
      open: false,
      mode: "create",
      selectedBrand: null,
    });
  };

  const handleSubmitBrand = (formData) => {
    if (modalState.mode === "edit" && modalState.selectedBrand) {
      setBrands((currentBrands) =>
        currentBrands.map((brand) =>
          brand.id === modalState.selectedBrand.id
            ? {
                ...brand,
                ...formData,
              }
            : brand
        )
      );
    } else {
      setBrands((currentBrands) => [
        ...currentBrands,
        {
          id: Date.now(),
          ...formData,
        },
      ]);
    }
    closeModal();
  };

  const handleDeleteBrand = (brandToDelete) => {
    setBrands((currentBrands) =>
      currentBrands.filter((brand) => brand.id !== brandToDelete.id)
    );
  };

  const brandActions = useMemo(
    () => [
      {
        key: "edit",
        title: "Editar marca",
        icon: Pencil,
        onClick: openEditModal,
      },
      {
        key: "delete",
        title: "Eliminar marca",
        icon: Trash2,
        onClick: handleDeleteBrand,
      },
    ],
    []
  );

  return (
    <PageSurface>
      <PageWrapper>
        <HeaderTitle>
          <Title>Marcas</Title>
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

          <PrimaryActionButton type="button" onClick={openCreateModal}>
            <Plus size={17} />
            Agregar marca
          </PrimaryActionButton>
        </Toolbar>

        <DataTable
          rows={filteredBrands}
          columns={brandColumns}
          actions={brandActions}
          pageSize={7}
          pageSizeOptions={[7, 10, 20]}
        />
      </PageWrapper>
      {/* MODAL */}
      <BrandModal
        open={modalState.open}
        mode={modalState.mode}
        initialData={modalState.selectedBrand}
        onClose={closeModal}
        onSubmit={handleSubmitBrand}
      />
    </PageSurface>
  );
}

export default Brands;
