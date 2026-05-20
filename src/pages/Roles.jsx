import React, { useMemo, useState } from "react";
import AppLayout from "../components/layout/AppLayout";
import DataTable from "../components/table/DataTable";
import RoleModal from "../components/modals/RoleModal";

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
} from "../components/ui/Page.styles";

const fechaHoy = () =>
  new Date().toLocaleDateString("es-BO", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const rolesMock = [
  {
    id: 1,
    name: "Administrador",
    description: "Acceso completo al sistema",
    level: 1,
  },
  {
    id: 2,
    name: "Encargado sistemas",
    description: "Gestión de usuarios, sucursales y configuración",
    level: 2,
  },
  {
    id: 3,
    name: "Vendedor",
    description: "Registro de ventas y consulta de productos",
    level: 3,
  },
];

function Roles() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roles, setRoles] = useState(rolesMock);

  const [modalState, setModalState] = useState({
    open: false,
    mode: "create",
    selectedRole: null,
  });

  const filteredRoles = useMemo(() => {
    const value = searchTerm.trim().toLowerCase();

    if (!value) return roles;

    return roles.filter((role) =>
      [role.name, role.description, role.level]
        .join(" ")
        .toLowerCase()
        .includes(value)
    );
  }, [searchTerm, roles]);

  const roleColumns = useMemo(
    () => [
      {
        field: "name",
        headerName: "Nombre",
        flex: 1.2,
        minWidth: 180,
      },
      {
        field: "description",
        headerName: "Descripción",
        flex: 2,
        minWidth: 260,
      },
      {
        field: "level",
        headerName: "Nivel",
        flex: 0.7,
        minWidth: 110,
      },
    ],
    []
  );

  const openCreateModal = () => {
    setModalState({
      open: true,
      mode: "create",
      selectedRole: null,
    });
  };

  const openEditModal = (role) => {
    setModalState({
      open: true,
      mode: "edit",
      selectedRole: role,
    });
  };

  const closeModal = () => {
    setModalState({
      open: false,
      mode: "create",
      selectedRole: null,
    });
  };

  const handleSubmitRole = (formData) => {
    if (modalState.mode === "edit") {
      setRoles((currentRoles) =>
        currentRoles.map((role) =>
          role.id === modalState.selectedRole.id
            ? {
                ...role,
                ...formData,
              }
            : role
        )
      );
    } else {
      setRoles((currentRoles) => [
        ...currentRoles,
        {
          id: Date.now(),
          ...formData,
        },
      ]);
    }

    closeModal();
  };

  const handleDeleteRole = (roleToDelete) => {
    setRoles((currentRoles) =>
      currentRoles.filter((role) => role.id !== roleToDelete.id)
    );
  };

  const roleActions = useMemo(
    () => [
      {
        key: "edit",
        title: "Editar rol",
        icon: Pencil,
        onClick: openEditModal,
      },
      {
        key: "delete",
        title: "Eliminar rol",
        icon: Trash2,
        onClick: handleDeleteRole,
      },
    ],
    []
  );

  return (
    <AppLayout>
      <PageSurface>
        <PageWrapper>
          <HeaderTitle>
            <Title>Roles</Title>
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
              Agregar rol
            </PrimaryActionButton>
          </Toolbar>

          <DataTable
            rows={filteredRoles}
            columns={roleColumns}
            actions={roleActions}
            pageSize={7}
            pageSizeOptions={[7, 10, 20]}
            noRowsLabel="No hay roles registrados"
          />
        </PageWrapper>
      </PageSurface>

      <RoleModal
        open={modalState.open}
        mode={modalState.mode}
        initialData={modalState.selectedRole}
        onClose={closeModal}
        onSubmit={handleSubmitRole}
      />
    </AppLayout>
  );
}

export default Roles;