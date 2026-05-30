import React, { useEffect, useState } from "react";
import { ArrowLeft, ChevronDown } from "lucide-react";

import {
  FormPageCard, FormHeader, BackButton, FormTitle,
  Form, FormSection, SectionTitle, FieldsGrid,
  Field, Label, FieldHint, Input,
  SelectWrapper, Select, SelectIcon,
  PhoneWrapper, PhoneFlagPrefix, PhoneInput,
  Actions, SaveButton,
} from "../ui/UserForm.styles";

const emptyForm = {
  name: "",
  lastName: "",
  email: "",
  celular: "",
  numeral: "",
  roleId: "",
  locationId: "",
};

function UserForm({
  mode = "create",
  initialData = null,
  roles = [],
  sucursales = [],
  loading = false,
  onBack,
  onSubmit,
}) {
  const [formData, setFormData] = useState(emptyForm);

  const isEditMode = mode === "edit";

  useEffect(() => {
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
  }, [initialData]);

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
      numeral: formData.numeral.trim() ? Number(formData.numeral) : null,
      roleId: Number(formData.roleId),
      locationId: formData.locationId ? Number(formData.locationId) : null,
    };

    onSubmit?.(payload);
  };

  return (
    <FormPageCard>
      <FormHeader>
        <BackButton type="button" onClick={onBack} title="Volver">
          <ArrowLeft size={20} />
        </BackButton>

        <FormTitle>{isEditMode ? "Editar Usuario" : "Nuevo Usuario"}</FormTitle>
      </FormHeader>

      <Form onSubmit={handleSubmit}>
        <FormSection>
          <SectionTitle>Información General</SectionTitle>

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
        </FormSection>

        <FormSection>
          <SectionTitle>Contacto</SectionTitle>

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
              <PhoneWrapper>
                <PhoneFlagPrefix>🇧🇴</PhoneFlagPrefix>
                <PhoneInput
                  type="tel"
                  placeholder="7000 0000"
                  maxLength={8}
                  value={formData.celular}
                  onChange={(e) => handleChange("celular", e.target.value.replace(/\D/g, ""))}
                />
              </PhoneWrapper>
            </Field>

            <Field>
              <Label>Numeral</Label>
              <Input
                type="text"
                placeholder="Ej: 001"
                value={formData.numeral}
                onChange={(e) => handleChange("numeral", e.target.value)}
              />
              <FieldHint>Código corto de identificación interna</FieldHint>
            </Field>

          </FieldsGrid>
        </FormSection>

        <FormSection>
          <SectionTitle>Empresa</SectionTitle>

          <FieldsGrid $columns={2}>
            <Field>
              <Label>Cargo</Label>
              <SelectWrapper>
                <Select
                  value={formData.roleId}
                  onChange={(event) =>
                    handleChange("roleId", event.target.value)
                  }
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
        </FormSection>

        <Actions>
          <SaveButton type="submit" disabled={loading}>
            {loading ? "Guardando..." : "Guardar"}
          </SaveButton>
        </Actions>
      </Form>
    </FormPageCard>
  );
}

export default UserForm;
