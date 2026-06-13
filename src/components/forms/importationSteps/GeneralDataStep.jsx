import React from "react";
import {
  StepPanel,
  SectionHeader,
  StepPanelTitle,
  WizardFormGrid,
  WizardField,
  WizardLabel,
  WizardInput,
  WizardHelperText,
} from "../../ui/ImportationWizard.styles";

function GeneralDataStep({ formData, onChange }) {
  return (
    <StepPanel>
      <SectionHeader>
        <StepPanelTitle>Datos generales</StepPanelTitle>
      </SectionHeader>

      <WizardFormGrid>
        <WizardField>
          <WizardLabel>Proveedor</WizardLabel>
          <WizardInput
            type="text"
            placeholder="Proveedor..."
            value={formData.supplier}
            onChange={(event) => onChange("supplier", event.target.value)}
          />
        </WizardField>

        <WizardField>
          <WizardLabel>Referencia / Factura</WizardLabel>
          <WizardInput
            type="text"
            placeholder="Num. Factura o Contrato..."
            value={formData.reference}
            onChange={(event) => onChange("reference", event.target.value)}
          />
        </WizardField>

        <WizardField>
          <WizardLabel>Fecha</WizardLabel>
          <WizardInput
            type="date"
            value={formData.date}
            onChange={(event) => onChange("date", event.target.value)}
          />
        </WizardField>

        <WizardField>
          <WizardLabel>Tipo de cambio oficial</WizardLabel>
          <WizardInput
            type="number"
            min="0"
            step="0.0001"
            placeholder="Ej: 6.96"
            value={formData.officialExchangeRate}
            onChange={(event) =>
              onChange("officialExchangeRate", event.target.value)
            }
          />
          <WizardHelperText>
            Se usará para convertir los valores de USD a bolivianos.
          </WizardHelperText>
        </WizardField>
      </WizardFormGrid>
    </StepPanel>
  );
}

export default GeneralDataStep;
