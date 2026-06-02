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
  productName: "",
  baseQuantity: "",
  referenceQuantity: "",
  priceUsd: "",
  gaPercent: "",
};

const roundToFourDecimals = (value) => {
  return Math.round((Number(value || 0) + Number.EPSILON) * 10000) / 10000;
};

const formatUsd = (value) =>
  `$ ${Number(value || 0).toLocaleString("en-US", {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  })}`;

const formatQuantity = (value) =>
  Number(value || 0).toLocaleString("en-US", {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  });

const formatFactor = (value) =>
  Number(value || 0).toLocaleString("en-US", {
    minimumFractionDigits: 7,
    maximumFractionDigits: 7,
  });

function ProductsStep({ products, onChangeProducts }) {
  // Subtotal USD = Cantidad base * Precio USD
  const getProductSubtotal = (product) => {
    const baseQuantity = Number(product.baseQuantity || 0);
    const priceUsd = Number(product.priceUsd || 0);

    return roundToFourDecimals(baseQuantity * priceUsd);
  };

  // Cantidad base total = suma de cantidades que participan en el subtotal
  const totalBaseQuantity = useMemo(() => {
    return products.reduce(
      (total, product) => total + Number(product.baseQuantity || 0),
      0
    );
  }, [products]);

  // Total USD = suma de subtotales USD redondeados a 4 decimales
  const totalUsd = useMemo(() => {
    const total = products.reduce(
      (acc, product) => acc + getProductSubtotal(product),
      0
    );

    return roundToFourDecimals(total);
  }, [products]);

  // Factor = Subtotal USD del producto / Total USD general
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
          <span>Producto</span>
          <span>Cantidad referencial</span>
          <span>Cantidad base</span>
          <span>Precio USD</span>
          <span>Subtotal USD</span>
          <span>Factor</span>
          <span>GA %</span>
          <span></span>
        </TableHeader>

        {products.map((product, index) => {
          const subtotal = getProductSubtotal(product);
          const factor = getProductFactor(product);

          return (
            <TableRow key={index}>
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
                step="0.0001"
                placeholder="Cantidad adicional"
                value={product.referenceQuantity}
                onChange={(event) =>
                  handleProductChange(index, "referenceQuantity", event.target.value)
                }
              />

              <WizardInput
                type="number"
                min="0"
                step="0.0001"
                placeholder="Cantidad para subtotal"
                value={product.baseQuantity}
                onChange={(event) =>
                  handleProductChange(index, "baseQuantity", event.target.value)
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

              <WizardInput
                type="number"
                min="0"
                step="0.01"
                placeholder="Ej: 10"
                value={product.gaPercent}
                onChange={(event) =>
                  handleProductChange(index, "gaPercent", event.target.value)
                }
              />

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
          <span>Cantidad base total:</span>
          <strong>{formatQuantity(totalBaseQuantity)}</strong>
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
