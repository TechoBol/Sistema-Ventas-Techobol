import React, { useMemo, useState } from "react";
import DataTable from "../components/table/DataTable";
import UserForm from "../components/forms/UserForm";
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
  const [viewState, setViewState] = useState({
    mode: "list",
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

  // UserForm
  const openCreateForm = () => {
    setViewState({
      mode: "create",
      selectedUser: null,
    });
  };

  const openEditForm = (user) => {
    setViewState({
      mode: "edit",
      selectedUser: user,
    });
  };

  const backToList = () => {
    setViewState({
      mode: "list",
      selectedUser: null,
    });
  };

  const handleSubmitUser = async (formData) => {
    if (viewState.mode === "edit") {
      const updated = await updateEmployee(viewState.selectedUser.id, formData);
      if (updated) {
        backToList();
      }
      return;
    }
    const created = await createEmployee(formData);
    if (created) {
      backToList();
    }
  };

  const userActions = useMemo(
    () => [
      {
        key: "edit",
        title: "Editar usuario",
        icon: Pencil,
        onClick: openEditForm,
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

  const isFormView = viewState.mode === "create" || viewState.mode === "edit";

  return (
    <PageSurface>
      <PageWrapper>
        {!isFormView ? (
          <>
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

              <PrimaryActionButton type="button" onClick={openCreateForm}>
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
          </>
        ) : (
          <UserForm
            mode={viewState.mode}
            initialData={viewState.selectedUser}
            roles={roles}
            sucursales={sucursales}
            loading={isLoading}
            onBack={backToList}
            onSubmit={handleSubmitUser}
          />
        )}
      </PageWrapper>
    </PageSurface>
  );
}

export default Users;
