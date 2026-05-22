import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

import {
  ModalOverlay,
  ModalCard,
  ModalTitle,
  Form,
  Field,
  Label,
  Input,
  Textarea,
  Actions,
  SaveButton,
  CloseButton,
} from "../ui/Modal.styles";

const emptyForm = {
  name: "",
  description: "",
  level: "",
};

function RoleModal({
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
        description: initialData.description || "",
        level: initialData.level ?? "",
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
      description: formData.description.trim(),
      level: Number(formData.level),
    };

    onSubmit?.(payload);
  };

  return (
    <ModalOverlay onMouseDown={onClose}>
      <ModalCard onMouseDown={(event) => event.stopPropagation()}>
        <CloseButton type="button" onClick={onClose}>
          <X size={18} />
        </CloseButton>

        <ModalTitle>{isEditMode ? "Editar Rol" : "Nuevo Rol"}</ModalTitle>

        <Form onSubmit={handleSubmit}>
          <Field>
            <Label>Nombre del Rol</Label>
            <Input
              type="text"
              placeholder="Nombre"
              value={formData.name}
              onChange={(event) => handleChange("name", event.target.value)}
            />
          </Field>

          <Field>
            <Label>Descripción</Label>
            <Textarea
              placeholder="Descripción del rol"
              value={formData.description}
              onChange={(event) =>
                handleChange("description", event.target.value)
              }
            />
          </Field>

          <Field>
            <Label>Nivel</Label>
            <Input
              type="number"
              placeholder="Nivel"
              min="1"
              value={formData.level}
              onChange={(event) => handleChange("level", event.target.value)}
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

export default RoleModal;
