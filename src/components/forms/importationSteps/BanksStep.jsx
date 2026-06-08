import React, { useCallback } from "react";
import {
  StepPanel,
  SectionHeader,
  StepPanelTitle,
  AddButton,
  WizardFormGrid,
  WizardField,
  WizardLabel,
  WizardInput,
  WizardHelperText,
  IconButton,
  SummaryCard,
  SummaryCardsGrid,
} from "../../ui/ImportationWizard.styles";
import { Trash2, Plus } from "lucide-react";

const fmt = (n) => {
  const truncated = Math.trunc(Number(n) * 100) / 100;
  return truncated.toLocaleString("es-BO", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};
function calcBlock({ monto, tc, comisionUsd, itfSalidaUsd, itfIngresoUsd }) {
  const m = parseFloat(monto) || 0;
  const t = parseFloat(tc) || 1;
  const com = parseFloat(comisionUsd) || 0;
  const its = parseFloat(itfSalidaUsd) || 0;
  const iti = parseFloat(itfIngresoUsd) || 0;

  const montoBs = m * t;
  const comisionBs = com * 6.97;
  const itfSalidaBs = its * t;
  const itfIngresoBs = iti * t;
  const total1Usd = m + com;
  const total1Bs = montoBs + comisionBs;
  const totalUsd = total1Usd + its + iti;
  const totalBs = total1Bs + itfSalidaBs + itfIngresoBs;

  return {
    montoBs,
    comisionBs,
    itfSalidaBs,
    itfIngresoBs,
    total1Usd,
    total1Bs,
    totalUsd,
    totalBs,
  };
}

export default function BanksStep({
  blocks,
  onChangeBlocks,
  totalAnticipo,
  totalComision,
  totalItf,
  totalAnticipoBs,
  totalComisionBs,
  totalItfBs,
  diferenciaTC,
}) {
  const updateBlock = useCallback(
    (id, field, value) => {
      onChangeBlocks((prev) =>
        prev.map((b) => (b.id === id ? { ...b, [field]: value } : b)),
      );
    },
    [onChangeBlocks],
  );

  const addSaldo = () => {
    onChangeBlocks((prev) => [
      ...prev,
      {
        id: Date.now(),
        type: "saldo",
        banco: "",
        monto: "",
        tc: "",
        comisionUsd: "",
        itfSalidaUsd: "",
        itfIngresoUsd: "",
      },
    ]);
  };

  const removeBlock = (id) =>
    onChangeBlocks((prev) => prev.filter((b) => b.id !== id));

  const BlocksGrid = ({ children }) => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
        gap: 16,
      }}
    >
      {children}
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <SectionHeader>
        <StepPanelTitle>Pagos bancarios</StepPanelTitle>
        <AddButton onClick={addSaldo}>
          <Plus size={14} /> Agregar saldo
        </AddButton>
      </SectionHeader>
      <BlocksGrid>
        {blocks.map((b) => {
          const c = calcBlock(b);
          return (
            <StepPanel
              key={b.id}
              style={{
                padding: "16px",
                borderRadius: "16px",
              }}
            >
              {/* Cabecera */}
              <SectionHeader>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      padding: "3px 10px",
                      borderRadius: 6,
                      background: b.type === "anticipo" ? "#e8f0fb" : "#e8f7ef",
                      color: b.type === "anticipo" ? "#1a56c4" : "#16714a",
                    }}
                  >
                    {b.type === "anticipo" ? "Anticipo" : "Saldo"}
                  </span>
                  <span style={{ fontSize: 14, fontWeight: 700 }}>
                    {b.banco || "Banco"}
                  </span>
                </div>
                {b.type !== "anticipo" && (
                  <IconButton onClick={() => removeBlock(b.id)}>
                    <Trash2 size={15} />
                  </IconButton>
                )}
              </SectionHeader>

              {/* Inputs — todos manuales */}
              <WizardFormGrid
                style={{
                  marginBottom: 12,
                  display: "grid",
                  gridTemplateColumns: "repeat(2, minmax(0,1fr))",
                  gap: 12,
                }}
              >
                <WizardField>
                  <WizardLabel>Banco</WizardLabel>
                  <WizardInput
                    value={b.banco}
                    onChange={(e) => updateBlock(b.id, "banco", e.target.value)}
                    placeholder="Ej. BCP, Mercantil..."
                  />
                </WizardField>

                <WizardField>
                  <WizardLabel>Monto ($)</WizardLabel>
                  <WizardInput
                    type="number"
                    value={b.monto}
                    onChange={(e) => updateBlock(b.id, "monto", e.target.value)}
                    placeholder="0.00"
                  />
                </WizardField>

                <WizardField>
                  <WizardLabel>Tipo de cambio</WizardLabel>
                  <WizardInput
                    type="number"
                    value={b.tc}
                    onChange={(e) => updateBlock(b.id, "tc", e.target.value)}
                    step="0.01"
                    placeholder="Ej. 12.00"
                  />
                </WizardField>

                <WizardField>
                  <WizardLabel>Comisión ($)</WizardLabel>
                  <WizardInput
                    type="number"
                    value={b.comisionUsd}
                    onChange={(e) =>
                      updateBlock(b.id, "comisionUsd", e.target.value)
                    }
                    step="0.01"
                    placeholder="0.00"
                  />
                </WizardField>

                <WizardField>
                  <WizardLabel>ITF Ingreso ($)</WizardLabel>
                  <WizardInput
                    type="number"
                    value={b.itfSalidaUsd}
                    onChange={(e) =>
                      updateBlock(b.id, "itfSalidaUsd", e.target.value)
                    }
                    step="0.01"
                    placeholder="0.00"
                  />
                </WizardField>

                <WizardField>
                  <WizardLabel>ITF Salida ($)</WizardLabel>
                  <WizardInput
                    type="number"
                    value={b.itfIngresoUsd}
                    onChange={(e) =>
                      updateBlock(b.id, "itfIngresoUsd", e.target.value)
                    }
                    step="0.01"
                    placeholder="0.00"
                  />
                </WizardField>
              </WizardFormGrid>

              {/* Detalle calculado (solo los Bs se derivan del TC) */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 10,
                }}
              >
                {[
                  [
                    "Monto $",
                    `$${fmt(parseFloat(b.monto) || 0)}`,
                    "Monto Bs",
                    `Bs ${fmt(c.montoBs)}`,
                  ],
                  [
                    "Comisión $",
                    `$${fmt(parseFloat(b.comisionUsd) || 0)}`,
                    "Comisión Bs",
                    `Bs ${fmt(c.comisionBs)}`,
                  ],
                  [
                    "Total 1 $",
                    `$${fmt(c.total1Usd)}`,
                    "Total 1 Bs",
                    `Bs ${fmt(c.total1Bs)}`,
                  ],
                  [
                    "ITF Ingreso $",
                    `$${fmt(parseFloat(b.itfIngresoUsd) || 0)}`,
                    "ITF Ingreso Bs",
                    `Bs ${fmt(c.itfIngresoBs)}`,
                  ],
                  [
                    "ITF Salida $",
                    `$${fmt(parseFloat(b.itfSalidaUsd) || 0)}`,
                    "ITF Salida Bs",
                    `Bs ${fmt(c.itfSalidaBs)}`,
                  ],
                ].map(([l1, v1, l2, v2]) => (
                  <React.Fragment key={l1}>
                    <ResultItem label={l1} value={v1} />
                    <ResultItem label={l2} value={v2} />
                  </React.Fragment>
                ))}
                <ResultItem
                  label="Total $"
                  value={`$${fmt(c.totalUsd)}`}
                  accent
                />
                <ResultItem
                  label="Total Bs"
                  value={`Bs ${fmt(c.totalBs)}`}
                  accent
                />
              </div>
            </StepPanel>
          );
        })}
      </BlocksGrid>
      {/* Resumen global */}
      <SummaryCardsGrid>
        <SummaryCard>
          <span>Total pago $</span>
          <strong>${fmt(totalAnticipo || 0)}</strong>
        </SummaryCard>
        <SummaryCard>
          <span>Total pago Bs</span>
          <strong>Bs {fmt(totalAnticipoBs || 0)}</strong>
        </SummaryCard>
        <SummaryCard>
          <span>Total comisión $</span>
          <strong>${fmt(totalComision || 0)}</strong>
        </SummaryCard>
        <SummaryCard>
          <span>Total comisión Bs</span>
          <strong>Bs {fmt(totalComisionBs || 0)}</strong>
        </SummaryCard>
        <SummaryCard $highlight>
          <span>Total ITF $</span>
          <strong>${fmt(totalItf || 0)}</strong>
        </SummaryCard>
        <SummaryCard $highlight>
          <span>Total ITF Bs</span>
          <strong>${fmt(totalItfBs || 0)}</strong>
        </SummaryCard>
      </SummaryCardsGrid>
      <StepPanel>
        <SectionHeader>
          <StepPanelTitle>Diferencia tipo de cambio</StepPanelTitle>
        </SectionHeader>
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}
        >
          <ResultItem
            label="Diferencia de tipo de cambio"
            value={`Bs ${fmt(diferenciaTC || 0)}`}
            accent
          />
        </div>
      </StepPanel>
    </div>
  );
}

function ResultItem({ label, value, accent }) {
  return (
    <div
      style={{
        background: accent ? "rgba(242,12,31,0.06)" : "#f8fafc",
        border: `1px solid ${accent ? "rgba(242,12,31,0.16)" : "#eef0f3"}`,
        borderRadius: 10,
        padding: "10px 14px",
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      <span
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: accent ? "#c0001a" : "#64748b",
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: 14,
          fontWeight: 700,
          color: accent ? "#c0001a" : "#0f172a",
        }}
      >
        {value}
      </span>
    </div>
  );
}
