import React, { useEffect, useState } from "react";
import { Plus, Trash2, X } from "lucide-react";

import {
  ModalOverlay,
  ModalCard,
  ModalTitle,
  Form,
  Field,
  Label,
  Input,
  Actions,
  SaveButton,
  CloseButton,
  DynamicFieldHeader,
  DynamicList,
  DynamicRow,
  IconAddButton,
  RemoveLineButton,
} from "../ui/Modal.styles";

const emptyForm = {
  name: "",
  lines: [""],
};

function BrandModal({
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
      const currentLines =
        Array.isArray(initialData.brands) && initialData.brands.length > 0
          ? initialData.brands
          : Array.isArray(initialData.lines) && initialData.lines.length > 0
          ? initialData.lines
          : [""];
      setFormData({name: initialData.name || "", lines: currentLines});
    } else {
      setFormData(emptyForm);
    }
  }, [open, initialData]);

  if (!open) return null;

  const handleNameChange = (value) => {
    setFormData((current) => ({
      ...current,
      name: value,
    }));
  };

  const handleLineChange = (index, value) => {
    setFormData((current) => ({
      ...current,
      lines: current.lines.map((line, lineIndex) =>
        lineIndex === index ? value : line
      ),
    }));
  };

  const handleAddLine = () => {
    setFormData((current) => ({
      ...current,
      lines: [...current.lines, ""],
    }));
  };

  const handleRemoveLine = (index) => {
    setFormData((current) => {
      if (current.lines.length === 1) return current;

      return {
        ...current,
        lines: current.lines.filter((_, lineIndex) => lineIndex !== index),
      };
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const cleanLines = formData.lines
      .map((line) => line.trim())
      .filter(Boolean);

    const payload = {
      name: formData.name.trim(),
      brands: cleanLines,
    };

    onSubmit?.(payload);
  };

  return (
    <ModalOverlay onMouseDown={onClose}>
      <ModalCard onMouseDown={(event) => event.stopPropagation()}>
        <CloseButton type="button" onClick={onClose}>
          <X size={18} />
        </CloseButton>

        <ModalTitle>{isEditMode ? "Editar Marca" : "Nueva Marca"}</ModalTitle>

        <Form onSubmit={handleSubmit}>
          <Field>
            <Label>Nombre de la Marca</Label>
            <Input
              type="text"
              placeholder="Nombre"
              value={formData.name}
              onChange={(event) => handleNameChange(event.target.value)}
            />
          </Field>

          <Field>
            <DynamicFieldHeader>
              <Label>Líneas</Label>
              <IconAddButton
                type="button"
                title="Añadir línea"
                onClick={handleAddLine}
              >
                <Plus size={18} />
              </IconAddButton>
            </DynamicFieldHeader>

            <DynamicList>
              {formData.lines.map((line, index) => (
                <DynamicRow key={index}>
                  <Input
                    type="text"
                    placeholder={`Línea ${index + 1}`}
                    value={line}
                    onChange={(event) =>
                      handleLineChange(index, event.target.value)
                    }
                  />
                  <RemoveLineButton
                    type="button"
                    disabled={formData.lines.length === 1}
                    title="Eliminar línea"
                    onClick={() => handleRemoveLine(index)}
                  >
                    <Trash2 size={16} />
                  </RemoveLineButton>
                </DynamicRow>
              ))}
            </DynamicList>
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

export default BrandModal;
