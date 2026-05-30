import React, { useMemo } from "react";
import { Plus, Trash2 } from "lucide-react";

import {
  StepPanel,
  SectionHeader,
  StepPanelTitle,
  StepPanelText,
  ExpensesGrid,
  ExpenseCard,
  ExpenseCardHeader,
  ExpenseTitle,
  AddButton,
  ExpenseRows,
  ExpenseRow,
  WizardInput,
  IconButton,
  ExpenseTotal,
  ExpensesSummary,
} from "../../ui/ImportationWizard.styles";

const emptyExpense = {
  name: "",
  amount: "",
};

const roundToTwoDecimals = (value) => {
  return Math.round((Number(value || 0) + Number.EPSILON) * 100) / 100;
};

const formatUsd = (value) =>
  `${Number(value || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} USD`;

function ExpenseGroup({
  title,
  description,
  addLabel,
  namePlaceholder,
  items,
  onAdd,
  onChange,
  onRemove,
}) {
  const total = useMemo(() => {
    const amount = items.reduce(
      (acc, item) => acc + Number(item.amount || 0),
      0
    );

    return roundToTwoDecimals(amount);
  }, [items]);

  return (
    <ExpenseCard>
      <ExpenseCardHeader>
        <div>
          <ExpenseTitle>{title}</ExpenseTitle>
          <p>{description}</p>
        </div>

        <AddButton type="button" onClick={onAdd}>
          <Plus size={14} />
          {addLabel}
        </AddButton>
      </ExpenseCardHeader>

      <ExpenseRows>
        {items.map((item, index) => (
          <ExpenseRow key={index}>
            <WizardInput
              type="text"
              placeholder={namePlaceholder}
              value={item.name}
              onChange={(event) => onChange(index, "name", event.target.value)}
            />

            <WizardInput
              type="number"
              min="0"
              step="0.01"
              placeholder="0"
              value={item.amount}
              onChange={(event) =>
                onChange(index, "amount", event.target.value)
              }
            />

            <IconButton
              type="button"
              title="Eliminar gasto"
              disabled={items.length === 1}
              onClick={() => onRemove(index)}
            >
              <Trash2 size={16} />
            </IconButton>
          </ExpenseRow>
        ))}
      </ExpenseRows>

      <ExpenseTotal>
        <span>Total</span>
        <strong>{formatUsd(total)}</strong>
      </ExpenseTotal>
    </ExpenseCard>
  );
}

function ExpensesStep({ expenses, onChangeExpenses }) {
  const addExpense = (section) => {
    onChangeExpenses({
      ...expenses,
      [section]: [...expenses[section], { ...emptyExpense }],
    });
  };

  const changeExpense = (section, index, field, value) => {
    const updatedItems = expenses[section].map((item, itemIndex) =>
      itemIndex === index
        ? {
            ...item,
            [field]: value,
          }
        : item
    );

    onChangeExpenses({
      ...expenses,
      [section]: updatedItems,
    });
  };

  const removeExpense = (section, index) => {
    if (expenses[section].length === 1) return;

    onChangeExpenses({
      ...expenses,
      [section]: expenses[section].filter(
        (_, itemIndex) => itemIndex !== index
      ),
    });
  };

  const getSectionTotal = (section) => {
    const total = expenses[section].reduce(
      (acc, item) => acc + Number(item.amount || 0),
      0
    );

    return roundToTwoDecimals(total);
  };

  const totals = useMemo(
    () => ({
      freights: getSectionTotal("freights"),
      insurances: getSectionTotal("insurances"),
      portCosts: getSectionTotal("portCosts"),
      otherCosts: getSectionTotal("otherCosts"),
    }),
    [expenses]
  );

  const totalImportationExpenses = useMemo(() => {
    return roundToTwoDecimals(
      totals.freights +
        totals.insurances +
        totals.portCosts +
        totals.otherCosts
    );
  }, [totals]);

  return (
    <StepPanel>
      <SectionHeader>
        <StepPanelTitle>Gastos de importación</StepPanelTitle>
      </SectionHeader>

      <ExpensesGrid>
        <ExpenseGroup
          title="Fletes"
          description="Transporte marítimo, terrestre u otros traslados."
          addLabel="Agregar flete"
          namePlaceholder="Nombre del flete"
          items={expenses.freights}
          onAdd={() => addExpense("freights")}
          onChange={(index, field, value) =>
            changeExpense("freights", index, field, value)
          }
          onRemove={(index) => removeExpense("freights", index)}
        />

        <ExpenseGroup
          title="Seguros"
          description="Seguros asociados a la mercancía importada."
          addLabel="Agregar seguro"
          namePlaceholder="Nombre del seguro"
          items={expenses.insurances}
          onAdd={() => addExpense("insurances")}
          onChange={(index, field, value) =>
            changeExpense("insurances", index, field, value)
          }
          onRemove={(index) => removeExpense("insurances", index)}
        />

        <ExpenseGroup
          title="Gastos portuarios"
          description="Costos de puerto, almacenaje, manipulación o aduana."
          addLabel="Agregar gasto"
          namePlaceholder="Nombre del gasto"
          items={expenses.portCosts}
          onAdd={() => addExpense("portCosts")}
          onChange={(index, field, value) =>
            changeExpense("portCosts", index, field, value)
          }
          onRemove={(index) => removeExpense("portCosts", index)}
        />

        <ExpenseGroup
          title="Otros gastos"
          description="Comisiones, certificados, trámites u otros cargos."
          addLabel="Agregar gasto"
          namePlaceholder="Nombre del gasto"
          items={expenses.otherCosts}
          onAdd={() => addExpense("otherCosts")}
          onChange={(index, field, value) =>
            changeExpense("otherCosts", index, field, value)
          }
          onRemove={(index) => removeExpense("otherCosts", index)}
        />
      </ExpensesGrid>

      <ExpensesSummary>
        <div>
          <span>Total fletes</span>
          <strong>{formatUsd(totals.freights)}</strong>
        </div>

        <div>
          <span>Total seguros</span>
          <strong>{formatUsd(totals.insurances)}</strong>
        </div>

        <div>
          <span>Total gastos portuarios</span>
          <strong>{formatUsd(totals.portCosts)}</strong>
        </div>

        <div>
          <span>Total otros gastos</span>
          <strong>{formatUsd(totals.otherCosts)}</strong>
        </div>

        <div className="highlight">
          <span>Total gastos importación</span>
          <strong>{formatUsd(totalImportationExpenses)}</strong>
        </div>
      </ExpensesSummary>
    </StepPanel>
  );
}

export default ExpensesStep;
