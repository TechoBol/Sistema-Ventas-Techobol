import React, { useMemo, useState } from "react";
import { Search, Plus, FileText, Pencil } from "lucide-react";
import DataTable from "../components/table/DataTable";
import ImportationWizard from "../components/forms/importationSteps/ImportationWizard";
import { useImportations } from "../hooks/useImportations";
import { useAmazonS3 } from "../hooks/useAmazonS3";
import { errorToast } from "../services/toasts";
import {
  PageSurface,
  PageWrapper,
  HeaderTitle,
  Title,
  Subtitle,
  Toolbar,
  SearchBox,
  SearchInput,
  PrimaryActionButton,
  StatusBadge,
} from "../components/ui/Page.styles";

const fechaHoy = () =>
  new Date().toLocaleDateString("es-BO", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const formatDate = (value) => {
  if (!value) return "-";
  const [datePart] = String(value).split("T");
  const [year, month, day] = datePart.split("-");
  if (!year || !month || !day) return "-";
  return `${day}/${month}/${year}`;
};

const formatExchangeRate = (value) => {
  if (!value) return "-";
  return Number(value).toLocaleString("es-BO", {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  });
};

const getStatusLabel = (status) => {
  if (status === "VERIFIED" || status === "verificado") {
    return "Verificado";
  }
  return "Borrador";
};

const getStatusValue = (status) => {
  if (status === "VERIFIED") {
    return "verificado";
  }
  return "borrador";
};

/* Al editar un borrador se utiliza la misma clave, por lo que el archivo anterior es reemplazado */
const getImportationPdfCode = (importation) => {
  return `IMPORTACION-${importation?.referenceNumber || importation?.id}`;
};

function Costs() {
  const [searchTerm, setSearchTerm] =
    useState("");

  const [viewState, setViewState] =
    useState({
      mode: "list",
      selectedImportation: null,
    });

  const {
    data,
    createImportation,
    updateImportation,
    isLoading,
  } = useImportations();

  const { getFileUrl } = useAmazonS3();

  const importations = useMemo(() => {
    return data.map((item) => ({
      id: item.id,

      supplier:
        item.supplierName ||
        "Sin proveedor",

      reference:
        item.referenceNumber ||
        "Sin referencia",

      date:
        item.importationDate || "",

      exchangeRate:
        item.officialExchangeRate || 0,

      productCount:
        item.productCount || 0,

      status: getStatusValue(
        item.status
      ),

      rawData: item,
    }));
  }, [data]);

  const filteredImports = useMemo(() => {
    const value = searchTerm
      .trim()
      .toLowerCase();

    if (!value) return importations;

    return importations.filter(
      (item) =>
        [
          item.supplier,
          item.reference,
          item.date,
          item.exchangeRate,
          item.productCount,
          getStatusLabel(item.status),
        ]
          .join(" ")
          .toLowerCase()
          .includes(value)
    );
  }, [searchTerm, importations]);

  const importColumns = useMemo(
    () => [
      {
        field: "supplier",
        headerName: "Proveedor",
        flex: 1.4,
        minWidth: 190,
      },
      {
        field: "reference",
        headerName:
          "Referencia / Factura",
        flex: 1.1,
        minWidth: 180,
      },
      {
        field: "date",
        headerName: "Fecha",
        flex: 0.9,
        minWidth: 130,
        valueFormatter: (value) =>
          formatDate(value),
      },
      {
        field: "exchangeRate",
        headerName: "Tipo de cambio",
        flex: 0.9,
        minWidth: 150,
        valueFormatter: (value) =>
          formatExchangeRate(value),
      },
      {
        field: "productCount",
        headerName: "Productos",
        flex: 0.8,
        minWidth: 120,
      },
      {
        field: "status",
        headerName: "Estado",
        flex: 0.9,
        minWidth: 140,
        sortable: false,
        filterable: false,
        renderCell: (params) => (
          <StatusBadge
            $status={params.value}
          >
            {getStatusLabel(params.value)}
          </StatusBadge>
        ),
      },
    ],
    []
  );

  const handleOpenCreate = () => {
    setViewState({
      mode: "create",
      selectedImportation: null,
    });
  };

  const handleOpenEdit = (
    importation
  ) => {
    setViewState({
      mode: "edit",
      selectedImportation:
        importation.rawData,
    });
  };

  const handleCloseForm = () => {
    setViewState({
      mode: "list",
      selectedImportation: null,
    });
  };

  const handleSaveImportation = async (payload) => {
    if (viewState.mode === "edit") {
      const updated = await updateImportation(
        viewState.selectedImportation.id,
        payload
      );
      if (updated) {
        handleCloseForm();
      }
      return;
    }
    const created = await createImportation(payload);
    if (created) {
      handleCloseForm();
    }
  };

  /* consulta el PDF guardado en S3 y abre su URL firmada */
  const handleViewPdf = async (importation) => {
    try {
      const pdfCode = getImportationPdfCode(importation.rawData);
      const key = `MEGADIS/IMPORT/${pdfCode}.pdf`;
      const url = await getFileUrl(key);
      window.open(url, "_blank");
    } catch (error) {
      console.error("Error al abrir el PDF:", error);
      errorToast("No se pudo abrir el PDF de la importación");
    }
  };

  const importActions = useMemo(
    () => [
      {
        key: "pdf",
        title: "Ver reporte PDF",
        icon: FileText,
        onClick: handleViewPdf,
      },
      {
        key: "edit",
        title:
          "Editar importación",
        icon: Pencil,

        hidden: (importation) =>
          importation.status ===
          "verificado",

        onClick: handleOpenEdit,
      },
    ],
    []
  );

  if (
    viewState.mode === "create" ||
    viewState.mode === "edit"
  ) {
    return (
      <PageSurface>
        <PageWrapper>
          <ImportationWizard
            mode={viewState.mode}
            initialData={viewState.selectedImportation}
            onCancel={handleCloseForm}
            onSubmit={handleSaveImportation}
          />
        </PageWrapper>
      </PageSurface>
    );
  }

  return (
    <PageSurface>
      <PageWrapper>
        <HeaderTitle>
          <Title>Importaciones</Title>
          <Subtitle>{fechaHoy()}</Subtitle>
        </HeaderTitle>

        <Toolbar>
          <SearchBox>
            <Search size={18} />
            <SearchInput
              type="text"
              placeholder="Buscar proveedor, referencia, fecha o estado"
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(
                  event.target.value
                )
              }
            />
          </SearchBox>

          <PrimaryActionButton
            type="button"
            onClick={
              handleOpenCreate
            }
          >
            <Plus size={17} />
            Añadir importación
          </PrimaryActionButton>
        </Toolbar>

        <DataTable
          rows={filteredImports}
          columns={importColumns}
          actions={importActions}
          pageSize={7}
          pageSizeOptions={[
            7,
            10,
            20,
          ]}
          noRowsLabel="No hay importaciones registradas"
          loading={isLoading}
        />
      </PageWrapper>
    </PageSurface>
  );
}

export default Costs;
