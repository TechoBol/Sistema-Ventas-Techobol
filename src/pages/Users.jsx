import React, { useMemo, useState } from "react";
import DataTable from "../components/table/DataTable";
import UserModal from "../components/modals/UserModal";
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
import { useEmployees } from "../hooks/useEmployees";
import { useRoles } from "../hooks/useRoles";
import { useSucursales } from "../hooks/useSucursales";

const fechaHoy = () => {
  const fecha = new Date().toLocaleDateString("es-BO", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return fecha.charAt(0).toUpperCase() + fecha.slice(1);
};

function Users() {
  const [searchTerm, setSearchTerm] = useState("");
  const [modalState, setModalState] = useState({
    open: false,
    mode: "create",
    selectedUser: null,
  });
  const {
    data,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    isLoading,
  } = useEmployees();
  const { roles } = useRoles();
  const { data: sucursales } = useSucursales();

  const users = useMemo(() => {
    return data.map((employee) => ({
      id: employee.id,
      name: employee.name,
      lastName: employee.lastName,
      email: employee.email ?? "",
      celular: employee.celular ?? "",
      numeral: employee.numeral ?? "",
      roleId: employee.role?.id ?? "",
      locationId: employee.location?.id ?? "",
      role: employee.role?.name ?? "Sin cargo",
      branch: employee.location?.name ?? "Sin sucursal",
    }));
  }, [data]);

  const filteredUsers = useMemo(() => {
    const value = searchTerm.trim().toLowerCase();
    if (!value) return users;
    return users.filter((user) =>
      [
        user.name,
        user.lastName,
        user.email,
        user.role,
        user.numeral,
        user.branch,
      ]
        .join(" ")
        .toLowerCase()
        .includes(value)
    );
  }, [searchTerm, users]);

  const userColumns = useMemo(
    () => [
      {
        field: "name",
        headerName: "Nombre",
        flex: 1,
        minWidth: 140,
      },
      {
        field: "lastName",
        headerName: "Apellido",
        flex: 1,
        minWidth: 140,
      },
      {
        field: "email",
        headerName: "Correo",
        flex: 1.4,
        minWidth: 190,
      },
      {
        field: "role",
        headerName: "Cargo",
        flex: 1.2,
        minWidth: 170,
      },
      {
        field: "numeral",
        headerName: "Numeral",
        flex: 0.9,
        minWidth: 120,
      },
      {
        field: "branch",
        headerName: "Sucursal",
        flex: 1.2,
        minWidth: 160,
      },
    ],
    []
  );

  // Modal
  const openCreateModal = () => {
    setModalState({
      open: true,
      mode: "create",
      selectedUser: null,
    });
  };

  const openEditModal = (user) => {
    setModalState({
      open: true,
      mode: "edit",
      selectedUser: user,
    });
  };

  const closeModal = () => {
    setModalState({
      open: false,
      mode: "create",
      selectedUser: null,
    });
  };

  const handleSubmitUser = async (formData) => {
    if (modalState.mode === "edit") {
      const updated = await updateEmployee(modalState.selectedUser.id, formData);
      if (updated) {
        closeModal();
      }
      return;
    }
    const created = await createEmployee(formData);
    if (created) {
      closeModal();
    }
  };

  const userActions = useMemo(
    () => [
      {
        key: "edit",
        title: "Editar usuario",
        icon: Pencil,
        onClick: (user) => {
          openEditModal(user);
        },
      },
      {
        key: "delete",
        title: "Eliminar usuario",
        icon: Trash2,
        onClick: (user) => {
          deleteEmployee(user.id);
        },
      },
    ],
    [deleteEmployee]
  );

  return (
    <>
      <PageSurface>
        <PageWrapper>
          <HeaderTitle>
            <Title>Usuarios</Title>
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
              Agregar usuario
            </PrimaryActionButton>
          </Toolbar>

          <DataTable
            rows={filteredUsers}
            columns={userColumns}
            actions={userActions}
            pageSize={7}
            pageSizeOptions={[7, 10, 20]}
            noRowsLabel="No hay usuarios registrados"
            loading={isLoading}
          />
        </PageWrapper>
      </PageSurface>
      {/* Modal */}
      <UserModal
        open={modalState.open}
        mode={modalState.mode}
        initialData={modalState.selectedUser}
        roles={roles}
        sucursales={sucursales}
        loading={isLoading}
        onClose={closeModal}
        onSubmit={handleSubmitUser}
      />
    </>
  );
}

export default Users;
