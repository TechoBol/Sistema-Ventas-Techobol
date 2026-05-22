import React, { useMemo, useState } from "react";
import AppLayout from "../components/layout/AppLayout";
import DataTable from "../components/table/DataTable";
import BrandModal from "../components/modals/BrandModal";
import { Search, Pencil, Trash2, Plus, ChevronDown } from "lucide-react";
import Popover from "@mui/material/Popover";
import { useLines } from "../hooks/useLine";
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

function BrandLinesPreview({ lines = [], searchTerm = "" }) {
  const [anchorEl, setAnchorEl] = useState(null);

  if (!lines.length) return "-";

  const normalizedSearch = searchTerm.trim().toLowerCase();

  const matchingLines = normalizedSearch
    ? lines.filter((line) => line.toLowerCase().includes(normalizedSearch))
    : [];

  const nonMatchingLines = normalizedSearch
    ? lines.filter((line) => !line.toLowerCase().includes(normalizedSearch))
    : lines;

  const visibleLines = normalizedSearch
    ? [...matchingLines, ...nonMatchingLines].slice(0, 2)
    : lines.slice(0, 2);

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
        {visibleLines.map((line) => {
          const isMatch =
            normalizedSearch &&
            line.toLowerCase().includes(normalizedSearch);

          return (
            <BrandLineChip key={line} $match={isMatch}>
              {line}
            </BrandLineChip>
          );
        })}

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
              maxWidth: "320px",
            },
          },
        }}
      >
        <BrandPopoverContent>
          <BrandPopoverTitle>Líneas de la marca</BrandPopoverTitle>

          <BrandPopoverList>
            {lines.map((line) => {
              const isMatch =
                normalizedSearch &&
                line.toLowerCase().includes(normalizedSearch);

              return (
                <BrandPopoverItem key={line} $match={isMatch}>
                  {line}
                </BrandPopoverItem>
              );
            })}
          </BrandPopoverList>
        </BrandPopoverContent>
      </Popover>
    </>
  );
}

function Brands() {
  const [searchTerm, setSearchTerm] = useState("");
  const {
    lines,
    createLine,
    updateLine,
    deleteLine,
    isLoading,
  } = useLines();
  const [modalState, setModalState] = useState({
    open: false,
    mode: "create",
    selectedBrand: null,
  });

  const brands = useMemo(() => {
    return lines.map((line) => {
      const brandLines = Array.isArray(line.brands) ? line.brands : [];
      return {
        id: line.id,
        name: line.name,
        lines: brandLines,
        linesText: brandLines.length > 0 ? brandLines.join(", ") : "Sin líneas",
      };
    });
  }, [lines]);

  const filteredBrands = useMemo(() => {
    const value = searchTerm.trim().toLowerCase();

    if (!value) return brands;

    return brands.filter((brand) =>
      [brand.name, brand.linesText]
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
        renderCell: (params) => (<BrandLinesPreview lines={params.row.lines} searchTerm={searchTerm}/>)},
    ],
    [searchTerm]
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

  const handleSubmitBrand = async (formData) => {
    if (modalState.mode === "edit" && modalState.selectedBrand) {
      await updateLine(modalState.selectedBrand.id, formData);
    } else {
      await createLine(formData);
    }
    closeModal();
  };

  const handleDeleteBrand = async (brand) => {
    await deleteLine(brand.id);
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
    [deleteLine]
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
        loading={isLoading}
      />
    </PageSurface>
  );
}

export default Brands;





