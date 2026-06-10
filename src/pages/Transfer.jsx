import React, { useMemo, useState, useEffect } from "react";
import DataTable from "../components/table/DataTable";
import CreateTransferModal from "../components/modals/CreateTransferModal";
import { useTransfers } from "../hooks/useTransfers";
import { useSucursales } from "../hooks/useSucursales";
import { useLoginStore } from "../components/store/loginStore";
import { useSearchParams } from "react-router-dom";
import { Search, Eye, FileText, Send } from "lucide-react";

import {
  PageSurface,
  PageWrapper,
  HeaderTitle,
  Title,
  Subtitle,
  SearchBox,
  SearchInput,
  Toolbar,
  FilterButtonGroup,
  FilterButton,
  PrimaryActionButton,
  StatusBadge,
} from "../components/ui/Page.styles";
import useInventory from "../hooks/useInventory";
import TransferDetailModal from "../components/modals/TransferDetailModal";
import { useAmazonS3 } from "../hooks/useAmazonS3";

const fechaHoy = () => {
  const fecha = new Date().toLocaleDateString("es-BO", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return fecha.charAt(0).toUpperCase() + fecha.slice(1);
};

const EMPTY_TRANSFER_FORM = {
  destinationId: null,
  items: [],
  glosa: "",
};

function Transfer() {
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") ?? "");
  const [selectedView, setSelectedView] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_TRANSFER_FORM);
  const { location, token } = useLoginStore();
  const { products } = useInventory();


  useEffect(() => {
    const code = searchParams.get("search");
    if (code !== null) {
      setSearchTerm(code);
    }
  }, [searchParams]);

  const {
    data: transfers,
    createTransfer,
    approveTransfer,
    rejectTransfer,
  } = useTransfers();
  const { data: locations } = useSucursales();

  const formattedTransfers = useMemo(() => {
    return (transfers || []).map((transfer) => ({
      id: transfer.id,

      code: transfer.transferCode,

      products:
        transfer.items
          ?.map((item) => `${item.product?.name} x${item.quantity}`)
          .join(", ") || "-",

      origin: transfer.fromLocation?.name || "-",

      destination: transfer.toLocation?.name || "-",

      requestedBy: transfer.requestedBy
        ? `${transfer.requestedBy.name} ${transfer.requestedBy.lastName}`
        : "-",

      date: transfer.createdAt,

      status: transfer.status,

      raw: transfer,
    }));
  }, [transfers]);

  const filteredTransfers = useMemo(() => {
    const value = searchTerm.trim().toLowerCase();

    let result = [];

    if (selectedView === "all") {
      result = formattedTransfers.filter(
        (transfer) =>
          transfer.raw?.toLocationId === location?.id,
      );
    }

    if (selectedView === "requests") {
      result = formattedTransfers.filter(
        (transfer) =>
          transfer.raw?.fromLocationId === location?.id,
      );
    }

    if (!value) return result;

    return result.filter((transfer) =>
      [
        transfer.code,
        transfer.products,
        transfer.origin,
        transfer.destination,
        transfer.status,
        transfer.requestedBy,
      ]
        .join(" ")
        .toLowerCase()
        .includes(value),
    );
  }, [
    searchTerm,
    selectedView,
    formattedTransfers,
    location,
  ]);
  const transferColumns = useMemo(
    () => [
      {
        field: "code",
        headerName: "Código",
        flex: 1,
        minWidth: 150,
      },

      {
        field: "products",
        headerName: "Productos",
        flex: 2,
        minWidth: 250,
      },

      {
        field: "origin",
        headerName: "Origen",
        flex: 1.2,
        minWidth: 170,
      },

      {
        field: "destination",
        headerName: "Destino",
        flex: 1.2,
        minWidth: 170,
      },

      {
        field: "requestedBy",
        headerName: "Solicitado por",
        flex: 1.3,
        minWidth: 200,
      },

      {
        field: "date",
        headerName: "Fecha",
        flex: 1.2,
        minWidth: 180,

        valueFormatter: (value) => {
          if (!value) return "-";

          return new Date(value).toLocaleString("es-BO", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          });
        },
      },

      {
        field: "status",
        headerName: "Estado",
        flex: 1,
        minWidth: 140,

        renderCell: (params) => (
          <StatusBadge $status={params.row.status?.toLowerCase()}>
            {params.row.status}
          </StatusBadge>
        ),
      },
    ],
    [],
  );

  const transferActions = useMemo(
    () => [
      {
        key: "details",
        title: "Ver detalles",
        icon: Eye,

        onClick: (transfer) => {
          handleViewDetail(transfer);
        },
      },

      {
        key: "pdf",
        title: "Ver PDF",
        icon: FileText,

        onClick: (transfer) => {
          handleViewPDF(transfer.code);
        },
      },
    ],
    [],
  );

  const handleCreateTransfer = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);

    setForm(EMPTY_TRANSFER_FORM);
  };

  const handleSubmitTransfer = async (values) => {
    await createTransfer(values);

    handleCloseModal();
  };

  const [selectedTransfer, setSelectedTransfer] = useState(null);

  const [openDetail, setOpenDetail] = useState(false);

  const handleViewDetail = (row) => {
    setSelectedTransfer(row.raw);
    setOpenDetail(true);
  };

  const handleApprove = async (id) => {
    if (!canApproveActions) return;
    await approveTransfer(id, location.id);
  };

  const handleReject = async (id) => {
    if (!canApproveActions) return;
    await rejectTransfer(id);
  };
  const { getFileUrl } = useAmazonS3();

  const handleViewPDF = async (key) => {
    const url = await getFileUrl("MEGADIS/TRANSFERENCIAS/" + key + ".pdf");
    window.open(url, "_blank");
  };
  return (
    <>
      <PageSurface>
        <PageWrapper>
          <HeaderTitle>
            <Title>Transferencias</Title>

            <Subtitle>{fechaHoy()}</Subtitle>
          </HeaderTitle>

          <Toolbar>
            <SearchBox>
              <Search size={18} />

              <SearchInput
                type="text"
                placeholder="Buscar transferencia"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </SearchBox>

            <PrimaryActionButton type="button" onClick={handleCreateTransfer}>
              <Send size={18} />
              Realizar transferencia
            </PrimaryActionButton>
          </Toolbar>

          <FilterButtonGroup>
            <FilterButton
              type="button"
              $active={selectedView === "all"}
              onClick={() => setSelectedView("all")}
            >
              Todas las transferencias
            </FilterButton>

            <FilterButton
              type="button"
              $active={selectedView === "requests"}
              onClick={() => setSelectedView("requests")}
            >
              Mis solicitudes
            </FilterButton>
          </FilterButtonGroup>

          <DataTable
            rows={filteredTransfers}
            columns={transferColumns}
            actions={transferActions}
            pageSize={7}
            pageSizeOptions={[7, 10, 20]}
            noRowsLabel="No hay transferencias registradas"
          />
        </PageWrapper>
      </PageSurface>

      <CreateTransferModal
        open={modalOpen}
        onClose={handleCloseModal}
        form={form}
        setForm={setForm}
        onSubmit={handleSubmitTransfer}
        inventory={products ?? []}
        location={location}
        locations={locations ?? []}
      />
      <TransferDetailModal
        open={openDetail}
        onClose={() => setOpenDetail(false)}
        transfer={selectedTransfer}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </>
  );
}

export default Transfer;
