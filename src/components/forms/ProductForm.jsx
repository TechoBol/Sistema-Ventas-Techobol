// components/forms/ProductForm.tsx

import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useForm } from "@mantine/form";

import { ArrowLeft } from "lucide-react";

import { useProduct } from "../../hooks/useProduct";
import { useLines } from "../../hooks/useLine";

import useInventory from "../../hooks/useInventory";

import {
  successToast,
  errorToast,
} from "../../services/toasts";

import socket from "../../services/SocketIOConnection";

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
} from "../../components/ui/Products";

function ProductForm({
  onBack,
  product = null,
}) {
  const { refresh } = useInventory();

  const isEdit = !!product;

  const {
    createProduct,
    updateProduct,
    loading,
    setLoading,
  } = useProduct();

  const { lines } = useLines();

  const [brands, setBrands] = useState([]);

  const form = useForm({
    initialValues: {
      name: product?.name ?? "",
      description:
        product?.description ?? "",
      code: product?.code ?? "",
      price: product?.price ?? "",
      finalPrice:
        product?.finalPrice ?? "",
      stock: product?.stockTotal ?? "",
      lineId: product?.lineId ?? "",
      brandName:
        product?.brandName ?? "",
    },

    validateInputOnChange: true,

    validate: {
      name: (v) =>
        !v.trim()
          ? "Ingresa el nombre"
          : null,

      code: (v) =>
        !v.trim()
          ? "Ingresa el código"
          : null,

      price: (v) =>
        !v || Number(v) <= 0
          ? "Precio inválido"
          : null,

      finalPrice: (v, values) =>
        !v || Number(v) <= 0
          ? "Precio inválido"
          : Number(v) <
            Number(values.price)
          ? "No puede ser menor"
          : null,

      stock: (v) =>
        v === "" || Number(v) < 0
          ? "Stock inválido"
          : null,
    },
  });

  const hasChanges = useMemo(() => {
    if (!isEdit) return true;

    return (
      form.values.name !==
        product?.name ||
      form.values.description !==
        product?.description ||
      form.values.code !==
        product?.code ||
      Number(form.values.price) !==
        Number(product?.price) ||
      Number(
        form.values.finalPrice,
      ) !==
        Number(product?.finalPrice) ||
      Number(form.values.stock) !==
        Number(product?.stockTotal) ||
      Number(form.values.lineId) !==
        Number(product?.lineId) ||
      form.values.brandName !==
        product?.brandName
    );
  }, [form.values, product, isEdit]);

  useEffect(() => {
    const selectedLine = lines?.find(
      (l) =>
        l.id ===
        Number(form.values.lineId),
    );

    if (selectedLine) {
      setBrands(
        selectedLine.brands || [],
      );
    } else {
      setBrands([]);
    }
  }, [form.values.lineId, lines]);

  const handleSubmit = form.onSubmit(
    async (values) => {
      try {
        setLoading(true);

        const payload = {
          ...values,
          lineId: Number(values.lineId),
          price: Number(values.price),
          finalPrice: Number(
            values.finalPrice,
          ),
          stock: Number(values.stock),
        };

        let result;

        if (isEdit) {
          result = await updateProduct(
            product.id,
            payload,
          );

          successToast(
            "Producto actualizado",
          );
        } else {
          result = await createProduct(
            payload,
          );

          successToast(
            "Producto creado",
          );
        }

        socket.emit(
          "createProduct",
          result,
        );

        refresh();

        onBack();
      } catch (err) {
        errorToast(
          err.message ||
            "Error inesperado",
        );
      } finally {
        setLoading(false);
      }
    },
  );

  return (
    <FormWrapper>
      <HeaderLeft>
        <BackButton
          type="button"
          onClick={onBack}
        >
          <ArrowLeft size={20} />
        </BackButton>

        <HeaderContent>
          <Title>
            {isEdit
              ? "Editar Producto"
              : "Nuevo Producto"}
          </Title>

          <Subtitle>
            Administra la información del
            producto
          </Subtitle>
        </HeaderContent>
      </HeaderLeft>

      <Form onSubmit={handleSubmit}>
        <FormContent>
          <LeftColumn>
            <Section>
              <SectionTitle>
                Información General
              </SectionTitle>

              <Grid2>
                <ContainerInput>
                  <FieldLabel>Nombre</FieldLabel>
                  <Input
                    placeholder="Nombre"
                    {...form.getInputProps(
                      "name",
                    )}
                  />

                  {form.errors.name && (
                    <ErrorText>
                      {form.errors.name}
                    </ErrorText>
                  )}
                </ContainerInput>

                <ContainerInput>
                  <FieldLabel>Descripción</FieldLabel>
                  <Input
                    placeholder="Descripción"
                    {...form.getInputProps(
                      "description",
                    )}
                  />
                </ContainerInput>
              </Grid2>

              <ContainerInput>
                <FieldLabel>Código</FieldLabel>
                <Input
                  placeholder="Código"
                  {...form.getInputProps(
                    "code",
                  )}
                />

                {form.errors.code && (
                  <ErrorText>
                    {form.errors.code}
                  </ErrorText>
                )}
              </ContainerInput>
            </Section>

            <Section>
              <SectionTitle>
                Inventario y Costos
              </SectionTitle>

              <Grid3>
                <ContainerInput>
                  <FieldLabel>Precio compra</FieldLabel>
                  <Input
                    type="number"
                    placeholder="Precio compra"
                    {...form.getInputProps(
                      "price",
                    )}
                  />

                  {form.errors.price && (
                    <ErrorText>
                      {form.errors.price}
                    </ErrorText>
                  )}
                </ContainerInput>

                <ContainerInput>
                  <FieldLabel>Precio venta</FieldLabel>
                  <Input
                    type="number"
                    placeholder="Precio venta"
                    {...form.getInputProps(
                      "finalPrice",
                    )}
                  />

                  {form.errors
                    .finalPrice && (
                    <ErrorText>
                      {
                        form.errors
                          .finalPrice
                      }
                    </ErrorText>
                  )}
                </ContainerInput>

                <ContainerInput>
                  <FieldLabel>Stock</FieldLabel>
                  <Input
                    type="number"
                    placeholder="Stock"
                    {...form.getInputProps(
                      "stock",
                    )}
                  />

                  {form.errors.stock && (
                    <ErrorText>
                      {form.errors.stock}
                    </ErrorText>
                  )}
                </ContainerInput>
              </Grid3>
            </Section>
          </LeftColumn>

          <RightColumn>
            <Section>
              <SectionTitle>
                Clasificación
              </SectionTitle>

              <Grid2>
                <ContainerInput>
                  <FieldLabel>Marca</FieldLabel>
                  <Select
                    {...form.getInputProps(
                      "lineId",
                    )}
                  >
                    <option value="">
                      Selecciona marca
                    </option>

                    {lines?.map((line) => (
                      <option
                        key={line.id}
                        value={line.id}
                      >
                        {line.name}
                      </option>
                    ))}
                  </Select>
                </ContainerInput>

                <ContainerInput>
                  <FieldLabel>Linea</FieldLabel>
                  <Select
                    {...form.getInputProps(
                      "brandName",
                    )}
                  >
                    <option value="">
                      Selecciona linea
                    </option>

                    {brands.map((brand) => (
                      <option
                        key={brand}
                        value={brand}
                      >
                        {brand}
                      </option>
                    ))}
                  </Select>
                </ContainerInput>
              </Grid2>
            </Section>
          </RightColumn>
        </FormContent>

        <ButtonRow>
          <Button
            type="submit"
            disabled={
              loading ||
              !form.isValid() ||
              (isEdit && !hasChanges)
            }
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