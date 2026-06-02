import React, { useEffect, useRef, useState } from "react";
import { ChevronDown, Check, Plus } from "lucide-react";
import {
  NitTrigger,
  NitTriggerText,
  NitTriggerSub,
  NitDropdown,
  NitSectionLabel,
  NitOption,
  NitOptionNumber,
  NitOptionCompany,
  NitCheckMark,
  NitDivider,
  NitAddRow,
  NitAddForm,
  NitAddFormTitle,
  NitAddFormRow,
  NitMiniLabel,
  NitMiniInput,
  NitAddFormActions,
  NitBtnCancel,
  NitBtnSave,
} from "../ui/SaleForm.styles";

/**
 * NitSelector
 *
 * Props:
 *  - nits: [{ id, number, companyName }]   — lista de NITs del cliente
 *  - selectedNit: { id, number, companyName } | null
 *  - onChange(nit): llamado al seleccionar un NIT existente
 *  - onAddNit({ number, companyName }): llamado al guardar un NIT nuevo
 *  - loading: bool — deshabilita el botón guardar mientras se llama al backend
 */
function NitSelector({ nits = [], selectedNit, onChange, onAddNit, loading = false }) {
  const [open, setOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [newNumber, setNewNumber] = useState("");
  const [newCompany, setNewCompany] = useState("");
  const [numberError, setNumberError] = useState(false);

  const ref = useRef(null);

  // Cierra el dropdown al hacer click fuera
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
        setShowForm(false);
        resetForm();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const resetForm = () => {
    setNewNumber("");
    setNewCompany("");
    setNumberError(false);
    setShowForm(false);
  };

  const handleSelect = (nit) => {
    onChange(nit);
    setOpen(false);
    resetForm();
  };

  const handleNumberChange = (e) => {
    // Solo acepta dígitos
    const value = e.target.value.replace(/\D/g, "");
    setNewNumber(value);
    if (numberError && value) setNumberError(false);
  };

  const handleSave = async () => {
    if (!newNumber.trim()) {
      setNumberError(true);
      return;
    }
    await onAddNit({ number: newNumber.trim(), companyName: newCompany.trim() });
    resetForm();
    setOpen(false);
  };

  return (
    <div ref={ref} style={{ position: "relative" }}>
      {/* Trigger */}
      <NitTrigger
        className={open ? "open" : ""}
        onClick={() => { setOpen((v) => !v); setShowForm(false); }}
      >
        <div style={{ display: "flex", flexDirection: "column", overflow: "hidden", flex: 1 }}>
          {selectedNit ? (
            <>
              <NitTriggerText $hasValue>{selectedNit.number}</NitTriggerText>
              {selectedNit.companyName && (
                <NitTriggerSub>{selectedNit.companyName}</NitTriggerSub>
              )}
            </>
          ) : (
            <NitTriggerText $hasValue={false}>Seleccionar NIT/CI...</NitTriggerText>
          )}
        </div>
        <ChevronDown
          size={16}
          color="#94a3b8"
          style={{
            flexShrink: 0,
            marginLeft: 8,
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease",
          }}
        />
      </NitTrigger>

      {/* Dropdown */}
      {open && (
        <NitDropdown>
          {/* Lista de NITs existentes */}
          {nits.length > 0 && (
            <>
              <NitSectionLabel>NITs registrados</NitSectionLabel>
              {nits.map((nit) => {
                const isSelected = selectedNit?.id === nit.id;
                return (
                  <NitOption key={nit.id} onClick={() => handleSelect(nit)}>
                    <div style={{ flex: 1, overflow: "hidden" }}>
                      <NitOptionNumber>{nit.number}</NitOptionNumber>
                      {nit.companyName && (
                        <NitOptionCompany>{nit.companyName}</NitOptionCompany>
                      )}
                    </div>
                    {isSelected && (
                      <NitCheckMark>
                        <Check size={15} strokeWidth={2.5} />
                      </NitCheckMark>
                    )}
                  </NitOption>
                );
              })}
              <NitDivider />
            </>
          )}

          {/* Botón agregar nuevo NIT */}
          {!showForm && (
            <NitAddRow onClick={() => setShowForm(true)}>
              <Plus size={16} strokeWidth={2.5} />
              Agregar nuevo NIT
            </NitAddRow>
          )}

          {/* Formulario inline para nuevo NIT */}
          {showForm && (
            <NitAddForm>
              <NitAddFormTitle>Nuevo NIT</NitAddFormTitle>
              <NitAddFormRow>
                <div>
                  <NitMiniLabel>Número de NIT *</NitMiniLabel>
                  <NitMiniInput
                    type="text"
                    inputMode="numeric"
                    placeholder="Ej: 3098765"
                    value={newNumber}
                    onChange={handleNumberChange}
                    className={numberError ? "error" : ""}
                    autoFocus
                  />
                </div>
                <div>
                  <NitMiniLabel>Nombre empresa</NitMiniLabel>
                  <NitMiniInput
                    type="text"
                    placeholder="Razón social (opcional)"
                    value={newCompany}
                    onChange={(e) => setNewCompany(e.target.value)}
                  />
                </div>
              </NitAddFormRow>
              <NitAddFormActions>
                <NitBtnCancel type="button" onClick={resetForm}>
                  Cancelar
                </NitBtnCancel>
                <NitBtnSave type="button" disabled={loading} onClick={handleSave}>
                  {loading ? "Guardando..." : "Guardar y seleccionar"}
                </NitBtnSave>
              </NitAddFormActions>
            </NitAddForm>
          )}
        </NitDropdown>
      )}
    </div>
  );
}

export default NitSelector;