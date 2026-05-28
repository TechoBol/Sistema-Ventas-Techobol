import React, { useMemo, useState } from "react";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import ImportationExpensesForm from "./ImportationExpensesForm";
import {
  FormCard,
  FormHeader,
  HeaderLeft,
  BackButton,
  Title,
  Form,
  FieldsGrid,
  Field,
  Label,
  Input,
  SectionHeader,
  SectionTitle,
  AddProductButton,
  ProductsTable,
  TableHeader,
  ProductRow,
  IconButton,
  SubtotalBox,
  Actions,
  CancelButton,
  SaveButton,
} from "../ui/ImportationForm.styles";

const emptyProduct = {
  code: "",
  productName: "",
  quantity: "",
  priceUsd: "",
};

// helper para redondear a 2 decimales
const roundToTwoDecimals = (value) => {
  return Math.round((Number(value || 0) + Number.EPSILON) * 100) / 100;
};

const formatUsd = (value) =>
  `${Number(value || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} USD`;

// helper para mostrar el factor
const formatFactor = (value) =>
  Number(value || 0).toLocaleString("en-US", {
    minimumFractionDigits: 7,
    maximumFractionDigits: 7,
  });

// helper para cantidad
const formatQuantity = (value) =>
  Number(value || 0).toLocaleString("en-US", {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  });

function ImportationForm({
  mode = "create",
  initialData = null,
  loading = false,
  onBack,
  onSubmit,
}) {
  const [step, setStep] = useState("products");
  const [importationData, setImportationData] = useState(null);

  const [formData, setFormData] = useState({
    supplier: "",
    reference: "",
    date: "",
    products: [{ ...emptyProduct }],
  });

  const handleChange = (field, value) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleProductChange = (index, field, value) => {
    setFormData((current) => {
      const updatedProducts = current.products.map((product, productIndex) =>
        productIndex === index
          ? {
              ...product,
              [field]: value,
            }
          : product
      );

      return {
        ...current,
        products: updatedProducts,
      };
    });
  };

  const handleAddProduct = () => {
    setFormData((current) => ({
      ...current,
      products: [...current.products, { ...emptyProduct }],
    }));
  };

  const handleRemoveProduct = (index) => {
    setFormData((current) => {
      if (current.products.length === 1) return current;

      return {
        ...current,
        products: current.products.filter((_, productIndex) => productIndex !== index),
      };
    });
  };

  const getProductSubtotal = (product) => {
    const quantity = Number(product.quantity || 0);
    const priceUsd = Number(product.priceUsd || 0);
    return roundToTwoDecimals(quantity * priceUsd);
  };

  const estimatedSubtotal = useMemo(() => {
    return formData.products.reduce(
      (total, product) => total + getProductSubtotal(product),
      0
    );
  }, [formData.products]);

  const totalQuantity = useMemo(() => {
    return formData.products.reduce(
      (total, product) => total + Number(product.quantity || 0),
      0
    );
  }, [formData.products]);

  const getProductFactor = (product) => {
    if (estimatedSubtotal <= 0) return 0;
    return getProductSubtotal(product) / estimatedSubtotal;
  };

  const handleCancel = () => {
    onBack?.();
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const payload = {
      supplier: formData.supplier.trim(),
      reference: formData.reference.trim(),
      date: formData.date,
      quantity: totalQuantity,
      totalUsd: estimatedSubtotal,
      products: formData.products.map((product) => ({
        code: product.code.trim(),
        productName: product.productName.trim(),
        quantity: Number(product.quantity || 0),
        priceUsd: Number(product.priceUsd || 0),
        subtotal: getProductSubtotal(product),
        factor: getProductFactor(product),
      })),
    };

    setImportationData(payload);
    setStep("expenses");
    //onSubmit?.(payload);
  };

  if (step === "expenses") {
    return (
      <ImportationExpensesForm
        importationData={importationData}
        loading={loading}
        onBackStep={() => setStep("products")}
        onCancel={onBack}
        onSubmit={onSubmit}
      />
    );
  }

  return (
    <FormCard>
      <FormHeader>
        <HeaderLeft>
          <BackButton type="button" onClick={handleCancel}>
            <ArrowLeft size={18} />
          </BackButton>
          <Title>Nueva Importación</Title>
        </HeaderLeft>
      </FormHeader>

      <Form onSubmit={handleSubmit}>
        <FieldsGrid>
          <Field>
            <Label>Proveedor</Label>
            <Input
              type="text"
              placeholder="Proveedor..."
              value={formData.supplier}
              onChange={(event) => handleChange("supplier", event.target.value)}
            />
          </Field>

          <Field>
            <Label>Referencia</Label>
            <Input
              type="text"
              placeholder="Referencia..."
              value={formData.reference}
              onChange={(event) => handleChange("reference", event.target.value)}
            />
          </Field>

          <Field>
            <Label>Fecha</Label>
            <Input
              type="date"
              value={formData.date}
              onChange={(event) => handleChange("date", event.target.value)}
            />
          </Field>
        </FieldsGrid>

        <SectionHeader>
          <SectionTitle>Productos</SectionTitle>

          <AddProductButton type="button" onClick={handleAddProduct}>
            <Plus size={15} />
            Agregar producto
          </AddProductButton>
        </SectionHeader>

        <ProductsTable>
          <TableHeader>
            <span>Código</span>
            <span>Producto</span>
            <span>Cantidad</span>
            <span>Precio USD</span>
            <span>Subtotal</span>
            <span>Factor</span>
            <span></span>
          </TableHeader>

          {formData.products.map((product, index) => {
            const subtotal = getProductSubtotal(product);

            return (
              <ProductRow key={index}>
                {/* codigo */}
                <Input
                  type="text"
                  placeholder="Código..."
                  value={product.code}
                  onChange={(event) =>
                    handleProductChange(index, "code", event.target.value)
                  }
                />
                {/* nombre del producto */}
                <Input
                  type="text"
                  placeholder="Producto..."
                  value={product.productName}
                  onChange={(event) =>
                    handleProductChange(index, "productName", event.target.value)
                  }
                />

                <Input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={product.quantity}
                  onChange={(event) =>
                    handleProductChange(index, "quantity", event.target.value)
                  }
                />

                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0"
                  value={product.priceUsd}
                  onChange={(event) =>
                    handleProductChange(index, "priceUsd", event.target.value)
                  }
                />

                <span>{subtotal > 0 ? formatUsd(subtotal) : "-"}</span>

                <span>{subtotal > 0 ? formatFactor(getProductFactor(product)) : "-"}</span>

                <IconButton
                  type="button"
                  title="Eliminar producto"
                  disabled={formData.products.length === 1}
                  onClick={() => handleRemoveProduct(index)}
                >
                  <Trash2 size={16} />
                </IconButton>
              </ProductRow>
            );
          })}
        </ProductsTable>

        <SubtotalBox>
          <div>
            <span>Cantidad total:</span>
            <strong>{formatQuantity(totalQuantity)}</strong>
          </div>
          <div>
            <span>Subtotal estimado:</span>
            <strong>{formatUsd(estimatedSubtotal)}</strong>
          </div>
        </SubtotalBox>

        <Actions>
          <CancelButton type="button" onClick={handleCancel}>
            Cancelar
          </CancelButton>

          <SaveButton type="submit">
            Siguiente
          </SaveButton>
        </Actions>
      </Form>
    </FormCard>
  );
}

export default ImportationForm;
