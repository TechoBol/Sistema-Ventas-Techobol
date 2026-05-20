import React, { useEffect, useState } from "react";
import { ChevronDown, X } from "lucide-react";

import {
  ModalOverlay,
  ModalCard,
  ModalTitle,
  Form,
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
  abbreviation: "",
  type: "",
  address: "",
};

function LocationModal({
  open,
  mode = "create",
  initialData = null,
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
        abbreviation: initialData.abbreviation || "",
        type: initialData.typeValue || initialData.type || "",
        address: initialData.address === "Sin dirección" ? "" : initialData.address || "",
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
      abbreviation: formData.abbreviation.trim().toUpperCase(),
      type: formData.type,
      address: formData.address.trim() || null,
    };

    onSubmit?.(payload);
  };

  return (
    <ModalOverlay onMouseDown={onClose}>
      <ModalCard onMouseDown={(event) => event.stopPropagation()}>
        <CloseButton type="button" onClick={onClose}>
          <X size={18} />
        </CloseButton>

        <ModalTitle>
          {isEditMode ? "Editar Sucursal" : "Nueva Sucursal"}
        </ModalTitle>

        <Form onSubmit={handleSubmit}>
          <Field>
            <Label>Nombre de la Sucursal</Label>
            <Input
              type="text"
              placeholder="Nombre"
              value={formData.name}
              onChange={(event) => handleChange("name", event.target.value)}
            />
          </Field>

          <Field>
            <Label>Abreviación</Label>
            <Input
              type="text"
              placeholder="Abreviación"
              value={formData.abbreviation}
              onChange={(event) =>
                handleChange("abbreviation", event.target.value.toUpperCase())
              }
            />
          </Field>

          <Field>
            <Label>Tipo de Sucursal</Label>
            <SelectWrapper>
              <Select
                value={formData.type}
                onChange={(event) => handleChange("type", event.target.value)}
              >
                <option value="" disabled>
                  Seleccione el tipo
                </option>
                <option value="BRANCH">Sucursal</option>
                <option value="WAREHOUSE">Almacén</option>
              </Select>

              <SelectIcon>
                <ChevronDown size={22} />
              </SelectIcon>
            </SelectWrapper>
          </Field>

          <Field>
            <Label>Dirección</Label>
            <Input
              type="text"
              placeholder="Dirección"
              value={formData.address}
              onChange={(event) => handleChange("address", event.target.value)}
            />
          </Field>

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

export default LocationModal;
