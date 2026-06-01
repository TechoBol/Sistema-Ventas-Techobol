import React, { useEffect, useMemo, useState } from "react";

import { useForm } from "@mantine/form";

import { ArrowLeft, Plus, Trash2 } from "lucide-react";

import { useProduct } from "../../hooks/useProduct";

import { useLines } from "../../hooks/useLine";

import useInventory from "../../hooks/useInventory";

import { successToast, errorToast } from "../../services/toasts";

import { socket } from "../../services/SocketIOConnection";

import {
  FormWrapper,
  HeaderLeft,
  HeaderContent,
  Title,
  Subtitle,
  Form,
  FormContent,
  Input,
  Button,
  ContainerInput,
  ErrorText,
  BackButton,
  Select,
  Section,
  SectionTitle,
  Grid2,
  Grid3,
  LeftColumn,
  RightColumn,
  ButtonRow,
  FieldLabel,
  SwitchWrapper,
  SwitchLabel,
  Switch,
} from "../../components/ui/Products";

const UNITS = [
  {
    code: "PIECE",
    label: "Pieza",
  },
  {
    code: "BOX",
    label: "Caja",
  },
  {
    code: "DOZEN",
    label: "Docena",
  },
  {
    code: "KG",
    label: "Kilogramo",
  },
  {
    code: "METER",
    label: "Metro",
  },
  {
    code: "ROLL",
    label: "Rollo",
  },
];

function ProductForm({ onBack, product = null }) {
  const { refresh } = useInventory();

  const isEdit = !!product;

  const { createProduct, updateProduct, loading, setLoading } = useProduct();

  const { lines } = useLines();

  const [brands, setBrands] = useState([]);

  const [productUnits, setProductUnits] = useState(
    product?.productUnits?.length
      ? product.productUnits.map((u) => ({
          unitCode: u.unit?.code || "PIECE",
          equivalence: u.equivalence,
          salePrice: u.salePrice,
          isDefault: u.isDefault,
        }))
      : [
          {
            unitCode: "PIECE",
            equivalence: 1,
            salePrice: "",
            isDefault: true,
          },
        ],
  );

  const form = useForm({
    initialValues: {
      name: product?.name ?? "",

      description: product?.description ?? "",

      code: product?.code ?? "",

      cost: product?.inventories?.[0]?.averageCost ?? "",

      stock: product?.inventories?.[0]?.quantity ?? "",

      lineId: product?.lineId ?? "",

      brandName: product?.brandName ?? "",

      baseUnitCode: product?.baseUnit?.code ?? "PIECE",
    },

    validateInputOnChange: true,

    validate: {
      name: (v) => (!v.trim() ? "Ingresa el nombre" : null),

      code: (v) => (!v.trim() ? "Ingresa el código" : null),

      cost: (v) => (Number(v) <= 0 ? "Costo inválido" : null),

      stock: (v) => (Number(v) < 0 ? "Stock inválido" : null),

      lineId: (v) => (!v ? "Selecciona línea" : null),

      brandName: (v) => (!v ? "Selecciona marca" : null),
    },
  });

  const hasChanges = useMemo(() => {
    return true;
  }, [form.values, productUnits]);

  useEffect(() => {
    const selectedLine = lines?.find(
      (l) => l.id === Number(form.values.lineId),
    );

    if (selectedLine) {
      setBrands(selectedLine.brands || []);
    } else {
      setBrands([]);
    }
  }, [form.values.lineId, lines]);

  const addFormat = () => {
    setProductUnits((prev) => [
      ...prev,
      {
        unitCode: "BOX",
        equivalence: 1,
        salePrice: "",
        isDefault: false,
      },
    ]);
  };

  const removeFormat = (index) => {
    setProductUnits((prev) => prev.filter((_, i) => i !== index));
  };

  const updateFormat = (index, field, value) => {
    setProductUnits((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              [field]: value,
            }
          : item,
      ),
    );
  };

  const handleDefault = (index) => {
    setProductUnits((prev) =>
      prev.map((item, i) => ({
        ...item,
        isDefault: i === index,
      })),
    );
  };

  const handleSubmit = form.onSubmit(async (values) => {
    try {
      setLoading(true);
      const defaultUnit =
        productUnits.find((item) => item.isDefault) || productUnits[0];

      const cost = Number(values.cost);

      const salePrice = Number(defaultUnit?.salePrice || 0);

      const IVA = 0.1494;

      const costWithIVA = cost * (1 + IVA);

      const porcentajeGanancia =
        costWithIVA > 0 ? ((salePrice - costWithIVA) / costWithIVA) * 100 : 0;
      const payload = {
        name: values.name,

        description: values.description,

        code: values.code,

        lineId: Number(values.lineId),

        brandName: values.brandName,

        baseUnitCode: values.baseUnitCode,

        purchasePrice: cost,

        salePrice,

        porcentajeGanancia: Number(porcentajeGanancia.toFixed(2)),

        productUnits: productUnits.map((item) => ({
          unitCode: item.unitCode,
          equivalence: Number(item.equivalence),
          salePrice: Number(item.salePrice),
          isDefault: item.isDefault,
        })),

        applyStockUpdate: applyInventory,

        ...(applyInventory && {
          stock: Number(values.stock),
          averageCost: cost,
          locationId: 1,
        }),
      };

      let result;

      if (isEdit) {
        result = await updateProduct(product.id, payload);

        successToast("Producto actualizado");
      } else {
        result = await createProduct(payload);

        successToast("Producto creado");
      }

      socket.emit("createProduct", result);

      refresh();

      onBack();
    } catch (err) {
      errorToast(err.message || "Error inesperado");
    } finally {
      setLoading(false);
    }
  });

  useEffect(() => {
    setProductUnits((prev) =>
      prev.map((item, index) =>
        index === 0
          ? {
              ...item,
              unitCode: form.values.baseUnitCode,
            }
          : item,
      ),
    );
  }, [form.values.baseUnitCode]);

  const [applyInventory, setApplyInventory] = useState(false);

  return (
    <FormWrapper>
      <HeaderLeft>
        <BackButton type="button" onClick={onBack}>
          <ArrowLeft size={20} />
        </BackButton>

        <HeaderContent>
          <Title>{isEdit ? "Editar Producto" : "Nuevo Producto"}</Title>

          <Subtitle>Administra la información del producto</Subtitle>
        </HeaderContent>
      </HeaderLeft>

      <Form onSubmit={handleSubmit}>
        <FormContent>
          <LeftColumn>
            <Section>
              <SectionTitle>Información General</SectionTitle>

              <Grid2>
                <ContainerInput>
                  <FieldLabel>Nombre</FieldLabel>

                  <Input placeholder="Nombre" {...form.getInputProps("name")} />

                  {form.errors.name && (
                    <ErrorText>{form.errors.name}</ErrorText>
                  )}
                </ContainerInput>

                <ContainerInput>
                  <FieldLabel>Descripción</FieldLabel>

                  <Input
                    placeholder="Descripción"
                    {...form.getInputProps("description")}
                  />
                </ContainerInput>
              </Grid2>

              <ContainerInput>
                <FieldLabel>Código</FieldLabel>

                <Input placeholder="Código" {...form.getInputProps("code")} />

                {form.errors.code && <ErrorText>{form.errors.code}</ErrorText>}
              </ContainerInput>
            </Section>

            <Section>
              <SectionTitle>Inventario</SectionTitle>
              <SwitchWrapper>
                <SwitchLabel>¿Aplicar nueva importación de stock?</SwitchLabel>

                <Switch
                  type="checkbox"
                  checked={applyInventory}
                  onChange={(e) => setApplyInventory(e.target.checked)}
                />
              </SwitchWrapper>
              <Grid3>
                <ContainerInput>
                  <FieldLabel>Unidad Base</FieldLabel>

                  <Select
                    disabled={!applyInventory}
                    {...form.getInputProps("baseUnitCode")}
                  >
                    {UNITS.map((unit) => (
                      <option key={unit.code} value={unit.code}>
                        {unit.label}
                      </option>
                    ))}
                  </Select>
                </ContainerInput>

                <ContainerInput>
                  <FieldLabel>Costo Unitario</FieldLabel>

                  <Input
                    type="number"
                    placeholder="0"
                    disabled={!applyInventory}
                    {...form.getInputProps("cost")}
                  />

                  {form.errors.cost && (
                    <ErrorText>{form.errors.cost}</ErrorText>
                  )}
                </ContainerInput>

                <ContainerInput>
                  <FieldLabel>Stock Inicial</FieldLabel>

                  <Input
                    type="number"
                    placeholder="0"
                    disabled={!applyInventory}
                    onWheel={(e) => e.currentTarget.blur()}
                    {...form.getInputProps("stock")}
                  />

                  {form.errors.stock && (
                    <ErrorText>{form.errors.stock}</ErrorText>
                  )}
                </ContainerInput>
              </Grid3>
            </Section>

            <Section>
              <SectionTitle>Presentaciones</SectionTitle>

              {productUnits.map((item, index) => (
                <div
                  key={index}
                  style={{
                    border: "1px solid #E5E7EB",
                    borderRadius: 12,
                    padding: 16,
                    marginBottom: 14,
                  }}
                >
                  <Grid3>
                    <ContainerInput>
                      <FieldLabel>Unidad</FieldLabel>

                      <Select
                        value={item.unitCode}
                        onChange={(e) =>
                          updateFormat(index, "unitCode", e.target.value)
                        }
                      >
                        {UNITS.map((unit) => (
                          <option key={unit.code} value={unit.code}>
                            {unit.label}
                          </option>
                        ))}
                      </Select>
                    </ContainerInput>

                    <ContainerInput>
                      <FieldLabel>Equivalencia</FieldLabel>

                      <Input
                        type="number"
                        placeholder="1"
                        value={item.equivalence}
                        onChange={(e) =>
                          updateFormat(index, "equivalence", e.target.value)
                        }
                      />
                    </ContainerInput>

                    <ContainerInput>
                      <FieldLabel>Precio Venta</FieldLabel>

                      <Input
                        type="number"
                        placeholder="0"
                        value={item.salePrice}
                        onChange={(e) =>
                          updateFormat(index, "salePrice", e.target.value)
                        }
                      />
                    </ContainerInput>
                  </Grid3>

                  <div
                    style={{
                      display: "flex",
                      gap: 10,
                      marginTop: 14,
                      alignItems: "center",
                    }}
                  >
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        fontSize: 14,
                      }}
                    >
                      <input
                        type="radio"
                        checked={item.isDefault}
                        onChange={() => handleDefault(index)}
                      />
                      Presentación por defecto
                    </label>

                    {productUnits.length > 1 && (
                      <Button type="button" onClick={() => removeFormat(index)}>
                        <Trash2 size={16} />
                      </Button>
                    )}
                  </div>
                </div>
              ))}

              <Button type="button" onClick={addFormat}>
                <Plus size={18} />
                Agregar Presentación
              </Button>
            </Section>
          </LeftColumn>

          <RightColumn>
            <Section>
              <SectionTitle>Clasificación</SectionTitle>

              <Grid2>
                <ContainerInput>
                  <FieldLabel>Marca</FieldLabel>

                  <Select {...form.getInputProps("lineId")}>
                    <option value="">Selecciona marca</option>

                    {lines?.map((line) => (
                      <option key={line.id} value={line.id}>
                        {line.name}
                      </option>
                    ))}
                  </Select>

                  {form.errors.lineId && (
                    <ErrorText>{form.errors.lineId}</ErrorText>
                  )}
                </ContainerInput>

                <ContainerInput>
                  <FieldLabel>Línea</FieldLabel>

                  <Select {...form.getInputProps("brandName")}>
                    <option value="">Selecciona línea</option>

                    {brands.map((brand) => (
                      <option key={brand} value={brand}>
                        {brand}
                      </option>
                    ))}
                  </Select>

                  {form.errors.brandName && (
                    <ErrorText>{form.errors.brandName}</ErrorText>
                  )}
                </ContainerInput>
              </Grid2>
            </Section>
          </RightColumn>
        </FormContent>

        <ButtonRow>
          <Button
            type="submit"
            //disabled={loading || !form.isValid() || (isEdit && !hasChanges)}
          >
            {loading
              ? "Guardando..."
              : isEdit
              ? "Actualizar Producto"
              : "Crear Producto"}
          </Button>
        </ButtonRow>
      </Form>
    </FormWrapper>
  );
}

export default ProductForm;
