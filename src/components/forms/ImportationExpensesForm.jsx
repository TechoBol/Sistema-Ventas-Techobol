import React, { useMemo, useState } from "react";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";

import {
  FormCard,
  FormHeader,
  HeaderLeft,
  BackButton,
  Title,
  Form,
  SubtotalBox,
  Actions,
  CancelButton,
  SaveButton,
} from "../ui/ImportationForm.styles";

import {
  ExpensesGrid,
  ExpenseCard,
  ExpenseCardHeader,
  ExpenseTitle,
  ExpenseAddButton,
  ExpenseRows,
  ExpenseRow,
  ExpenseInput,
  ExpenseIconButton,
  ExpenseTotal,
} from "../ui/ImportationExpensesForm.styles";

const emptyExpense = {
  name: "",
  price: "",
};

const roundToTwoDecimals = (value) => {
  return Math.round((Number(value || 0) + Number.EPSILON) * 100) / 100;
};

const formatUsd = (value) =>
  `${Number(value || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} USD`;

function ExpenseList({
  title,
  addLabel,
  namePlaceholder,
  items,
  onAdd,
  onChange,
  onRemove,
}) {
  const total = useMemo(() => {
    const amount = items.reduce(
      (acc, item) => acc + Number(item.price || 0),
      0
    );

    return roundToTwoDecimals(amount);
  }, [items]);

  return (
    <ExpenseCard>
      <ExpenseCardHeader>
        <ExpenseTitle>{title}</ExpenseTitle>

        <ExpenseAddButton type="button" onClick={onAdd}>
          <Plus size={14} />
          {addLabel}
        </ExpenseAddButton>
      </ExpenseCardHeader>

      <ExpenseRows>
        {items.map((item, index) => (
          <ExpenseRow key={index}>
            <ExpenseInput
              type="text"
              placeholder={namePlaceholder}
              value={item.name}
              onChange={(event) => onChange(index, "name", event.target.value)}
            />

            <ExpenseInput
              type="number"
              min="0"
              step="0.01"
              placeholder="0"
              value={item.price}
              onChange={(event) => onChange(index, "price", event.target.value)}
            />

            <ExpenseIconButton
              type="button"
              title="Eliminar gasto"
              disabled={items.length === 1}
              onClick={() => onRemove(index)}
            >
              <Trash2 size={15} />
            </ExpenseIconButton>
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

function ImportationExpensesForm({
  importationData,
  onBackStep,
  onCancel,
  onSubmit,
  loading = false,
}) {
  const [expenses, setExpenses] = useState({
    freights: [{ ...emptyExpense }],
    insurances: [{ ...emptyExpense }],
    portCosts: [{ ...emptyExpense }],
  });

  const addExpense = (section) => {
    setExpenses((current) => ({
      ...current,
      [section]: [...current[section], { ...emptyExpense }],
    }));
  };

  const changeExpense = (section, index, field, value) => {
    setExpenses((current) => ({
      ...current,
      [section]: current[section].map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [field]: value,
            }
          : item
      ),
    }));
  };

  const removeExpense = (section, index) => {
    setExpenses((current) => {
      if (current[section].length === 1) return current;

      return {
        ...current,
        [section]: current[section].filter(
          (_, itemIndex) => itemIndex !== index
        ),
      };
    });
  };

  const calculateSectionTotal = (items) => {
    const total = items.reduce((acc, item) => acc + Number(item.price || 0), 0);

    return roundToTwoDecimals(total);
  };

  const totals = useMemo(
    () => ({
      freights: calculateSectionTotal(expenses.freights),
      insurances: calculateSectionTotal(expenses.insurances),
      portCosts: calculateSectionTotal(expenses.portCosts),
    }),
    [expenses]
  );

  const totalExpenses = useMemo(() => {
    return roundToTwoDecimals(
      totals.freights + totals.insurances + totals.portCosts
    );
  }, [totals]);

  const handleSubmit = (event) => {
    event.preventDefault();

    const payload = {
      ...importationData,
      expenses: {
        freights: expenses.freights.map((item) => ({
          name: item.name.trim(),
          price: Number(item.price || 0),
        })),

        insurances: expenses.insurances.map((item) => ({
          name: item.name.trim(),
          price: Number(item.price || 0),
        })),

        portCosts: expenses.portCosts.map((item) => ({
          name: item.name.trim(),
          price: Number(item.price || 0),
        })),

        totals,
        totalExpenses,
      },
    };

    onSubmit?.(payload);
  };

  return (
    <FormCard>
      <FormHeader>
        <HeaderLeft>
          <BackButton type="button" onClick={onBackStep}>
            <ArrowLeft size={18} />
          </BackButton>

          <Title>Gastos de Importación</Title>
        </HeaderLeft>
      </FormHeader>

      <Form onSubmit={handleSubmit}>
        <ExpensesGrid>
          <ExpenseList
            title="Fletes"
            addLabel="Agregar flete"
            namePlaceholder="Nombre del flete"
            items={expenses.freights}
            onAdd={() => addExpense("freights")}
            onChange={(index, field, value) =>
              changeExpense("freights", index, field, value)
            }
            onRemove={(index) => removeExpense("freights", index)}
          />

          <ExpenseList
            title="Seguro"
            addLabel="Agregar seguro"
            namePlaceholder="Nombre del seguro"
            items={expenses.insurances}
            onAdd={() => addExpense("insurances")}
            onChange={(index, field, value) =>
              changeExpense("insurances", index, field, value)
            }
            onRemove={(index) => removeExpense("insurances", index)}
          />

          <ExpenseList
            title="Gastos portuarios"
            addLabel="Agregar gasto"
            namePlaceholder="Nombre del gasto"
            items={expenses.portCosts}
            onAdd={() => addExpense("portCosts")}
            onChange={(index, field, value) =>
              changeExpense("portCosts", index, field, value)
            }
            onRemove={(index) => removeExpense("portCosts", index)}
          />
        </ExpensesGrid>

        <SubtotalBox>
          <div>
            <span>Total gastos:</span>
            <strong>{formatUsd(totalExpenses)}</strong>
          </div>
        </SubtotalBox>

        <Actions>
          <CancelButton type="button" onClick={onCancel}>
            Cancelar
          </CancelButton>

          <SaveButton type="submit" disabled={loading}>
            {loading ? "Guardando..." : "Guardar Importación"}
          </SaveButton>
        </Actions>
      </Form>
    </FormCard>
  );
}

export default ImportationExpensesForm;
