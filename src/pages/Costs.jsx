import React, { useMemo, useState } from "react";
import { Search, Plus, Eye, Pencil } from "lucide-react";
import DataTable from "../components/table/DataTable";
import ImportationWizard from "../components/forms/importationSteps/ImportationWizard";
import { useImportations } from "../hooks/useImportations";
//import { socket } from "../services/SocketIOConnection";

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

  const [datePart] = value.split("T");
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
  if (status === "VERIFIED" || status === "verificado") return "Verificado";
  return "Borrador";
};

const getStatusValue = (status) => {
  if (status === "VERIFIED") return "verificado";
  return "borrador";
};

function Costs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const { data, createImportation, isLoading } = useImportations();

  const importations = useMemo(() => {
    return data.map((item) => ({
      id: item.id,
      supplier: item.supplierName || "Sin proveedor",
      reference: item.referenceNumber || "Sin referencia",
      date: item.importationDate || "",
      exchangeRate: item.officialExchangeRate || 0,
      productCount: item.productCount || 0,
      status: getStatusValue(item.status),
      rawData: item,
    }));
  }, [data]);

  const filteredImports = useMemo(() => {
    const value = searchTerm.trim().toLowerCase();

    if (!value) return importations;

    return importations.filter((item) =>
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
        headerName: "Referencia / Factura",
        flex: 1.1,
        minWidth: 180,
      },
      {
        field: "date",
        headerName: "Fecha",
        flex: 0.9,
        minWidth: 130,
        valueFormatter: (value) => formatDate(value),
      },
      {
        field: "exchangeRate",
        headerName: "Tipo de cambio",
        flex: 0.9,
        minWidth: 150,
        valueFormatter: (value) => formatExchangeRate(value),
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
          <StatusBadge $status={params.value}>
            {getStatusLabel(params.value)}
          </StatusBadge>
        ),
      },
    ],
    []
  );

  const importActions = useMemo(
    () => [
      {
        key: "detail",
        title: "Ver detalle",
        icon: Eye,
        onClick: (importation) => {
          console.log("Ver detalle de importación:", importation.rawData);
        },
      },
      {
        key: "edit",
        title: "Editar importación",
        icon: Pencil,
        onClick: (importation) => {
          console.log("Editar importación:", importation.rawData);
        },
      },
    ],
    []
  );

  const handleOpenCreate = () => {
    setIsCreating(true);
  };

  const handleCloseCreate = () => {
    setIsCreating(false);
  };

  const handleSaveImportation = async (payload) => {
    const created = await createImportation(payload);

    if (created) {
      setIsCreating(false);
    }
  };

  if (isCreating) {
    return (
      <PageSurface>
        <PageWrapper>
          <ImportationWizard
            onCancel={handleCloseCreate}
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
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </SearchBox>

          <PrimaryActionButton type="button" onClick={handleOpenCreate}>
            <Plus size={17} />
            Añadir importación
          </PrimaryActionButton>
        </Toolbar>

        <DataTable
          rows={filteredImports}
          columns={importColumns}
          actions={importActions}
          pageSize={7}
          pageSizeOptions={[7, 10, 20]}
          noRowsLabel="No hay importaciones registradas"
          loading={isLoading}
        />
      </PageWrapper>
    </PageSurface>
  );
}

export default Costs;
