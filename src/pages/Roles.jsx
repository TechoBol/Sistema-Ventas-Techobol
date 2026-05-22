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
import { useRoles } from "../hooks/useRoles";

const fechaHoy = () => {
  const fecha = new Date().toLocaleDateString("es-BO", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return fecha.charAt(0).toUpperCase() + fecha.slice(1);
};

function Roles() {
  const [searchTerm, setSearchTerm] = useState("");

  const {
    roles,
    createRole,
    updateRole,
    deleteRole,
    isLoading,
  } = useRoles();

  const [modalState, setModalState] = useState({
    open: false,
    mode: "create",
    selectedRole: null,
  });

  const mappedRoles = useMemo(() => {
    return roles.map((role) => ({
      id: role.id,
      name: role.name,
      description: role.description ?? "",
      level: role.level ?? 1,
    }));
  }, [roles]);

  const filteredRoles = useMemo(() => {
    const value = searchTerm.trim().toLowerCase();

    if (!value) return mappedRoles;

    return mappedRoles.filter((role) =>
      [role.name, role.description, role.level]
        .join(" ")
        .toLowerCase()
        .includes(value)
    );
  }, [searchTerm, mappedRoles]);

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

  const handleSubmitRole = async (formData) => {
    if (modalState.mode === "edit" && modalState.selectedRole) {
      await updateRole(modalState.selectedRole.id, formData);
    } else {
      await createRole(formData);
    }
    closeModal();
  };

  const handleDeleteRole = async (roleToDelete) => {
    await deleteRole(roleToDelete.id);
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
    [deleteRole]
  );

  return (
    <>
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
        loading={isLoading}
      />
    </>
  );
}

export default Roles;