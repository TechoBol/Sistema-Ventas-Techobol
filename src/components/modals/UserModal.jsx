import React, { useEffect, useState } from "react";
import { ChevronDown, X } from "lucide-react";

import {
  ModalOverlay,
  ModalCard,
  ModalTitle,
  Form,
  FormSectionTitle,
  FieldsGrid,
  Field,
  Label,
  Input,
  SelectWrapper,
  Select,
  SelectIcon,
  Actions,
  SaveButton,
  CloseButton,
} from "../ui/Modal.styles";

const emptyForm = {
  name: "",
  lastName: "",
  email: "",
  celular: "",
  numeral: "",
  roleId: "",
  locationId: "",
};

function UserModal({
  open,
  mode = "create",
  initialData = null,
  roles = [],
  sucursales = [],
  onClose,
  onSubmit,
  loading = false,
}) {
  const [formData, setFormData] = useState(emptyForm);

  const isEditMode = mode === "edit";

  useEffect(() => {
    if (!open) return;

    if (initialData) {
      setFormData({
        name: initialData.name || "",
        lastName: initialData.lastName || "",
        email: initialData.email || "",
        celular: initialData.celular || "",
        numeral: initialData.numeral?.toString() || "",
        roleId: initialData.roleId?.toString() || "",
        locationId: initialData.locationId?.toString() || "",
      });
    } else {
      setFormData(emptyForm);
    }
  }, [open, initialData]);

  if (!open) return null;

  const handleChange = (field, value) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const payload = {
      name: formData.name.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim() || null,
      celular: formData.celular.trim() || null,
      numeral: formData.numeral.trim()
        ? Number(formData.numeral)
        : null,
      roleId: Number(formData.roleId),
      locationId: formData.locationId
        ? Number(formData.locationId)
        : null,
    };
    onSubmit?.(payload);
  };

  return (
    <ModalOverlay onMouseDown={onClose}>
      <ModalCard $size="large" onMouseDown={(event) => event.stopPropagation()}>
        <CloseButton type="button" onClick={onClose}>
          <X size={18} />
        </CloseButton>

        <ModalTitle>
          {isEditMode ? "Editar Usuario" : "Nuevo Usuario"}
        </ModalTitle>

        <Form onSubmit={handleSubmit}>
          <FieldsGrid $columns={2}>
            <Field>
              <Label>Nombre</Label>
              <Input
                type="text"
                placeholder="Nombre del empleado"
                value={formData.name}
                onChange={(event) => handleChange("name", event.target.value)}
              />
            </Field>

            <Field>
              <Label>Apellido</Label>
              <Input
                type="text"
                placeholder="Apellido del empleado"
                value={formData.lastName}
                onChange={(event) =>
                  handleChange("lastName", event.target.value)
                }
              />
            </Field>
          </FieldsGrid>

          <FormSectionTitle>Contacto</FormSectionTitle>

          <FieldsGrid $columns={3}>
            <Field>
              <Label>Correo Electrónico</Label>
              <Input
                type="email"
                placeholder="correo@gmail.com"
                value={formData.email}
                onChange={(event) => handleChange("email", event.target.value)}
              />
            </Field>

            <Field>
              <Label>Número de Celular</Label>
              <Input
                type="text"
                placeholder="591 00000000"
                value={formData.celular}
                onChange={(event) => handleChange("celular", event.target.value)}
              />
            </Field>

            <Field>
              <Label>Numeral</Label>
              <Input
                type="text"
                placeholder="##000"
                value={formData.numeral}
                onChange={(event) =>
                  handleChange("numeral", event.target.value)
                }
              />
            </Field>
          </FieldsGrid>

          <FormSectionTitle>Empresa</FormSectionTitle>

          <FieldsGrid $columns={2}>
            <Field>
              <Label>Cargo</Label>
              <SelectWrapper>
                <Select
                  value={formData.roleId}
                  onChange={(event) => handleChange("roleId", event.target.value)}
                >
                  <option value="" disabled>
                    Cargo o puesto
                  </option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </Select>

                <SelectIcon>
                  <ChevronDown size={22} />
                </SelectIcon>
              </SelectWrapper>
            </Field>

            <Field>
              <Label>Sucursal</Label>
              <SelectWrapper>
                <Select
                  value={formData.locationId}
                  onChange={(event) =>
                    handleChange("locationId", event.target.value)
                  }
                >
                  <option value="" disabled>
                    Seleccione sucursal
                  </option>
                  {sucursales.map((sucursal) => (
                    <option key={sucursal.id} value={sucursal.id}>
                      {sucursal.name}
                    </option>
                  ))}
                </Select>

                <SelectIcon>
                  <ChevronDown size={22} />
                </SelectIcon>
              </SelectWrapper>
            </Field>
          </FieldsGrid>

          <Actions>
            <SaveButton type="submit" disabled={loading}>
              {loading ? "Guardando..." : "Guardar"}
            </SaveButton>
          </Actions>
        </Form>
      </ModalCard>
    </ModalOverlay>
  );
}

export default UserModal;
