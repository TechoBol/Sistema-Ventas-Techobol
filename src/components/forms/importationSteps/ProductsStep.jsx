import React, { useMemo } from "react";
import { Plus, Trash2 } from "lucide-react";
import {
  StepPanel,
  StepPanelTitle,
  SectionHeader,
  AddButton,
  TableWrapper,
  TableHeader,
  TableRow,
  WizardInput,
  IconButton,
  TotalsBar,
} from "../../ui/ImportationWizard.styles";

const emptyProduct = {
  code: "",
  productName: "",
  quantity: "",
  priceUsd: "",
};

const roundToTwoDecimals = (value) => {
  return Math.round((Number(value || 0) + Number.EPSILON) * 100) / 100;
};

const formatUsd = (value) =>
  `$ ${Number(value || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const formatQuantity = (value) =>
  Number(value || 0).toLocaleString("en-US", {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  });

const formatFactor = (value) =>
  Number(value || 0).toLocaleString("en-US", {
    minimumFractionDigits: 7,
    maximumFractionDigits: 7,
  });

function ProductsStep({ products, onChangeProducts }) {
  // calculo del Subtotal USD = cantidad * precio USD
  const getProductSubtotal = (product) => {
    const quantity = Number(product.quantity || 0);
    const priceUsd = Number(product.priceUsd || 0);
    return roundToTwoDecimals(quantity * priceUsd);
  };
  // calculo de la Cantidad total = suma de todas las cantidades
  const totalQuantity = useMemo(() => {
    return products.reduce(
      (total, product) => total + Number(product.quantity || 0),
      0
    );
  }, [products]);
  // calculo del Total USD = suma de todos los subtotales USD
  const totalUsd = useMemo(() => {
    return products.reduce(
      (total, product) => total + getProductSubtotal(product),
      0
    );
  }, [products]);
  // calculo del Factor = Subtotal USD del producto / Total USD general
  const getProductFactor = (product) => {
    const subtotal = getProductSubtotal(product);
    if (totalUsd <= 0 || subtotal <= 0) return 0;
    return subtotal / totalUsd;
  };

  const handleProductChange = (index, field, value) => {
    const updatedProducts = products.map((product, productIndex) =>
      productIndex === index
        ? {
            ...product,
            [field]: value,
          }
        : product
    );

    onChangeProducts(updatedProducts);
  };

  const handleAddProduct = () => {
    onChangeProducts([...products, { ...emptyProduct }]);
  };

  const handleRemoveProduct = (index) => {
    if (products.length === 1) return;

    const updatedProducts = products.filter(
      (_, productIndex) => productIndex !== index
    );

    onChangeProducts(updatedProducts);
  };

  return (
    <StepPanel>
      <SectionHeader>
        <StepPanelTitle>Productos importados</StepPanelTitle>
        <AddButton type="button" onClick={handleAddProduct}>
          <Plus size={15} />
          Agregar producto
        </AddButton>
      </SectionHeader>

      <TableWrapper>
        <TableHeader>
          <span>Código</span>
          <span>Producto</span>
          <span>Cantidad</span>
          <span>Precio USD</span>
          <span>Subtotal</span>
          <span>Factor</span>
          <span></span>
        </TableHeader>

        {products.map((product, index) => {
          const subtotal = getProductSubtotal(product);
          const factor = getProductFactor(product);

          return (
            <TableRow key={index}>
              <WizardInput
                type="text"
                placeholder="Código..."
                value={product.code}
                onChange={(event) =>
                  handleProductChange(index, "code", event.target.value)
                }
              />

              <WizardInput
                type="text"
                placeholder="Producto..."
                value={product.productName}
                onChange={(event) =>
                  handleProductChange(index, "productName", event.target.value)
                }
              />

              <WizardInput
                type="number"
                min="0"
                step="0.001"
                placeholder="0"
                value={product.quantity}
                onChange={(event) =>
                  handleProductChange(index, "quantity", event.target.value)
                }
              />

              <WizardInput
                type="number"
                min="0"
                step="0.0001"
                placeholder="0"
                value={product.priceUsd}
                onChange={(event) =>
                  handleProductChange(index, "priceUsd", event.target.value)
                }
              />

              <strong>{subtotal > 0 ? formatUsd(subtotal) : "-"}</strong>

              <strong>{factor > 0 ? formatFactor(factor) : "-"}</strong>

              <IconButton
                type="button"
                title="Eliminar producto"
                disabled={products.length === 1}
                onClick={() => handleRemoveProduct(index)}
              >
                <Trash2 size={16} />
              </IconButton>
            </TableRow>
          );
        })}
      </TableWrapper>

      <TotalsBar>
        <div>
          <span>Cantidad total:</span>
          <strong>{formatQuantity(totalQuantity)}</strong>
        </div>
        <div>
          <span>Total USD:</span>
          <strong>{formatUsd(totalUsd)}</strong>
        </div>
      </TotalsBar>
    </StepPanel>
  );
}

export default ProductsStep;
