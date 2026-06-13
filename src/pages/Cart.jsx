import React, { useState, useRef, useEffect } from "react";
import {
  Trash2,
  Plus,
  Minus,
  Search,
  X,
  ShoppingCart,
  FileText,
  Calendar,
  CreditCard,
  Banknote,
  QrCode,
} from "lucide-react";
import useInventory from "../hooks/useInventory";
import {
  ModeShell,
  Wrapper,
  Header,
  Title,
  Subtitle,
  SearchBar,
  SearchInput,
  Body,
  TableCard,
  Table,
  THead,
  TH,
  TBody,
  TR,
  TD,
  DiscountInput,
  DeleteButton,
  EmptyState,
  SummaryPanel,
  SummaryRow,
  SummaryTotal,
  CheckoutButton,
  PaymentPanel,
  PaymentTitle,
  ProductDropdown,
  DropItem,
  DropCode,
  DropName,
  DropCantidad,
  DropPrice,
  DropHeader,
  DropHeaderCode,
  DropHeaderName,
  DropHeaderQty,
  DropHeaderPrice,
  CustomerEmpty,
  ModeTitleGroup,
  SegmentedControl,
  SegBtn,
  PresentationRow,
  AddPresentationRow,
  AddPresentationButton,
} from "../components/ui/Cart";
import { socket } from "../services/SocketIOConnection";

import { useCart } from "../hooks/useCart";
import { useLoginStore } from "../components/store/loginStore";
import Swal from "sweetalert2";
import SaleForm from "../components/forms/SaleForm";
import { errorToast } from "../services/toasts";

const fechaHoy = () => {
  const fecha = new Date().toLocaleDateString("es-BO", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return fecha.charAt(0).toUpperCase() + fecha.slice(1);
};

const Cart = () => {
  const { products } = useInventory();
  const { location } = useLoginStore();

  /* ── Modos de Operación Centralizados ── */
  const [mode, setMode] = useState("venta"); // 'venta' | 'cotizacion' | 'reserva'

  /* ── Estados Dinámicos por Modo ── */
  const [paymentMethod, setPaymentMethod] = useState("Efectivo");
  const [advanceAmount, setAdvanceAmount] = useState(0); // Para Reservas
  const [validityDays, setValidityDays] = useState(15); // Para Cotizaciones
  const [notes, setNotes] = useState(""); // Para Cotizaciones

  /* ── Estado de búsqueda ── */
  const [query, setQuery] = useState("");
  const [dropOpen, setDropOpen] = useState(false);
  const searchRef = useRef(null);

  const filtered =
    query.trim() === ""
      ? (products ?? []).slice(0, 50)
      : (products ?? []).filter((p) => {
        const name = p?.name?.toLowerCase?.() || "";
        const code = p?.code?.toLowerCase?.() || "";
        const q = query.toLowerCase();
        return name.includes(q) || code.includes(q);
      });

  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target))
        setDropOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ── Carrito local ── */
  const [cartItems, setCartItems] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const calcUnitPrice = (
    baseSalePrice,
    quantity,
    quantityDiscount,
    bossDiscount,
  ) => {
    if (quantity > 10) return Math.max(0, baseSalePrice - bossDiscount);
    if (quantity >= 6) return Math.max(0, baseSalePrice - quantityDiscount);
    return baseSalePrice;
  };

  const buildLine = (product, unit) => ({
    id: `${product.id}-${unit.id}`,
    productId: product.id,
    code: product.code,
    name: product.name,
    quantity: 1,
    itemDiscount: 0,
    productUnits: product.productUnits,
    selectedUnitId: unit.id,
    equivalence: Number(unit.equivalence),
    unitName: unit.unit.name,
    baseSalePrice: Number(unit.salePrice),
    unitPrice: Number(unit.salePrice),
    quantityDiscount: product.quantityDiscount || 0,
    bossDiscount: product.bossDiscount || 0,
    purchasePrice: Number(product.purchasePrice || 0),
    stock:
      product?.inventories?.find((inv) => inv.locationId === location.id)
        ?.quantity || 0,
    baseUnitName: product.baseUnit?.name || "unid.",
  });

  const addToCart = (product) => {
    setCartItems((prev) => {
      const existingLine = prev.find((i) => i.productId === product.id);

      if (existingLine) {
        // Ya existe el producto: solo aumentamos cantidad de la primera línea
        return prev.map((i) =>
          i.id === existingLine.id ? { ...i, quantity: i.quantity + 1 } : i,
        );
      }

      const defaultUnit =
        product.productUnits.find((u) => u.isDefault) ||
        product.productUnits[0];

      return [...prev, buildLine(product, defaultUnit)];
    });
    setQuery("");
    setDropOpen(false);
  };

  const addPresentation = (productId) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    setCartItems((prev) => {
      const usedUnitIds = prev
        .filter((i) => i.productId === productId)
        .map((i) => i.selectedUnitId);

      const availableUnit = product.productUnits.find(
        (u) => !usedUnitIds.includes(u.id),
      );

      if (!availableUnit) {
        errorToast("Ya se agregaron todas las presentaciones disponibles para este producto.");
        return prev;
      }

      return [...prev, buildLine(product, availableUnit)];
    });
  };

  const changeUnit = (itemId, productUnitId) => {
    setCartItems((prev) => {
      const current = prev.find((i) => i.id === itemId);
      if (!current) return prev;

      const newUnitId = Number(productUnitId);

      // Evitar que dos líneas del mismo producto usen la misma presentación
      const conflict = prev.find(
        (i) =>
          i.productId === current.productId &&
          i.id !== itemId &&
          i.selectedUnitId === newUnitId,
      );
      if (conflict) {
        errorToast("Esta presentación ya está agregada para este producto.");
        return prev;
      }

      const selectedUnit = current.productUnits.find(
        (u) => u.id === newUnitId,
      );

      return prev.map((item) => {
        if (item.id !== itemId) return item;
        return {
          ...item,
          id: `${item.productId}-${selectedUnit.id}`,
          selectedUnitId: selectedUnit.id,
          equivalence: Number(selectedUnit.equivalence),
          unitName: selectedUnit.unit.name,
          baseSalePrice: Number(selectedUnit.salePrice),
          unitPrice: calcUnitPrice(
            Number(selectedUnit.salePrice),
            item.quantity,
            item.quantityDiscount,
            item.bossDiscount,
          ),
        };
      });
    });
  };

  const removeItem = (itemId) =>
    setCartItems((p) => p.filter((i) => i.id !== itemId));

  //const removeItemFromCart = (productId) =>
  //setCartItems((p) => p.filter((i) => i.productId !== productId));

  const setItemDiscount = (itemId, val) =>
    setCartItems((p) =>
      p.map((i) =>
        i.id === itemId ? { ...i, itemDiscount: Number(val) || 0 } : i,
      ),
    );

  /* ── Cálculos Dinámicos ── */
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.unitPrice * item.quantity,
    0,
  );
  const totalDiscount = cartItems.reduce(
    (acc, item) => acc + (item.itemDiscount || 0),
    0,
  );
  const total = Math.max(0, subtotal - totalDiscount);
  const itemSubtotal = (item) =>
    Math.max(0, item.unitPrice * item.quantity - (item.itemDiscount || 0));
  const pendingBalance = Math.max(0, total - advanceAmount);

  /* ── Checkout ── */
  const { createSale, loading } = useCart();
  const [showSaleForm, setShowSaleForm] = useState(false);

  const handleCheckout = async () => {
    if (!cartItems.length) {
      Swal.fire({
        title: "Carrito vacío",
        text: "Agrega productos antes de continuar.",
        icon: "warning",
      });
      return;
    }
    setShowSaleForm(true);
  };

  const initialCustomerData = {
    name: "",
    ci: "",
    occupation: "",
    phone: "",
    whatsapp: "",
    originChannel: "facebook",
    address: "",
    latitude: null,
    longitude: null,
  };

  const [customerData, setCustomerData] = useState(initialCustomerData);

  const finalizarVenta = async ({
    generateInvoice,
    bankName,
    ...customerData
  }) => {
    if (isProcessing) return;
    setIsProcessing(true);

    console.log("CUSTOMER DATA:", customerData);

    try {
      // 1. Armamos el objeto con la información del cliente + parámetros financieros requeridos por el hook
      const dataPayload = {
        ...customerData, // Trae name, ci (¡reemplazado!), phone, whatsapp, address, etc.
        mode,
        paymentMethod, // Pasamos el método de pago seleccionado en el carrito ("Efectivo", "QR", etc.)
        generateInvoice,
        bankName, // Seleccionado en la columna derecha de SaleForm si es depósito
        codigoTransaccion: null,
        ...(mode === "reserva" && { advanceAmount, pendingBalance }),
        ...(mode === "cotizacion" && { validityDays, notes }),
      };

      console.log(
        `Payload unificado enviado al hook (${mode.toUpperCase()}):`,
        dataPayload,
      );

      // 2. Ejecutamos la función del hook pasando los parámetros limpios y ordenados
      const result = await createSale(
        dataPayload,
        cartItems.map((item) => ({
          productId: item.productId,
          productUnitId: item.selectedUnitId,
          quantity: item.quantity,
          equivalence: item.equivalence,
          itemDiscount: Number(item.itemDiscount || 0),
        })),
        subtotal,
        totalDiscount,
        total,
      );

      // 3. Éxito de la operación y reseteos
      socket.emit("newCartProduct", result);
      setCartItems([]);
      setAdvanceAmount(0);
      setNotes("");
      setShowSaleForm(false);
      setCustomerData(initialCustomerData);

      const alertTitles = {
        venta: "Venta registrada",
        cotizacion: "Cotización creada",
        reserva: "Reserva confirmada",
      };

      await Swal.fire({
        title: alertTitles[mode],
        text: `La operación se procesó exitosamente.`,
        icon: "success",
        confirmButtonColor: "var(--mode-color)",
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: "Error",
        text: err.message || `No se pudo procesar la operación en modo ${mode}.`,
        icon: "error",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Mapeo de datos para tarjetas táctiles de pago
  const paymentMethodsData = [
    { id: "Efectivo", label: "Efectivo", icon: <Banknote size={20} /> },
    { id: "Deposito bancario", label: "Banco", icon: <CreditCard size={20} /> },
    { id: "QR", label: "Código QR", icon: <QrCode size={20} /> },
  ];

  useEffect(() => {
    const handleMarginUpdate = ({
      id,
      porcentajeGanancia,
      quantityDiscount,
      bossDiscount,
    }) => {
      setCartItems((prev) =>
        prev.map((item) => {
          if (item.productId !== id) return item;

          const costIva = Number(item.purchasePrice || 0) * 1.1494;
          const newBaseSalePrice = Math.round(
            costIva * (1 + porcentajeGanancia / 100),
          );

          return {
            ...item,
            quantityDiscount,
            bossDiscount,
            baseSalePrice: newBaseSalePrice,
            unitPrice: calcUnitPrice(
              newBaseSalePrice,
              item.quantity,
              quantityDiscount,
              bossDiscount,
            ),
          };
        }),
      );
    };

    socket.on("updateProductMargin", handleMarginUpdate);
    return () => socket.off("updateProductMargin", handleMarginUpdate);
  }, []);

  return (
    <ModeShell className={`mode-${mode}`}>
      <Wrapper>
        {!showSaleForm ? (
          <>
            <Header>
              <ModeTitleGroup>
                <SegmentedControl>
                  {[
                    { id: "venta", label: "Venta" },
                    { id: "cotizacion", label: "Cotización" },
                    { id: "reserva", label: "Reserva" },
                  ].map(({ id, label }) => (
                    <SegBtn
                      key={id}
                      className={mode === id ? "active" : ""}
                      onClick={() => setMode(id)}
                    >
                      {label}
                    </SegBtn>
                  ))}
                </SegmentedControl>
              </ModeTitleGroup>
              <Subtitle style={{ marginLeft: "2px" }}>{fechaHoy()}</Subtitle>
            </Header>

            <div
              ref={searchRef}
              style={{ position: "relative", width: "fit-content" }}
            >
              <SearchBar>
                <Search size={16} color="#94a3b8" />
                <SearchInput
                  placeholder="Buscar por nombre o código…"
                  value={query}
                  onFocus={() => setDropOpen(true)}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setDropOpen(true);
                  }}
                />
                {query && (
                  <X
                    size={15}
                    color="#94a3b8"
                    style={{ cursor: "pointer", flexShrink: 0 }}
                    onClick={() => {
                      setQuery("");
                      setDropOpen(false);
                    }}
                  />
                )}
              </SearchBar>
              {dropOpen && (
                <ProductDropdown>
                  <DropHeader>
                    <DropHeaderCode>Código</DropHeaderCode>
                    <DropHeaderName>Producto</DropHeaderName>
                    <DropHeaderQty>Cant.</DropHeaderQty>
                    <DropHeaderPrice>Precio</DropHeaderPrice>
                  </DropHeader>

                  {filtered.length === 0 ? (
                    <CustomerEmpty>Sin resultados</CustomerEmpty>
                  ) : (
                    filtered.map((p) => (
                      <DropItem key={p.id} onClick={() => addToCart(p)}>
                        <DropCode>{p?.code || "-"}</DropCode>
                        <DropName>{p?.name || "-"}</DropName>
                        <DropCantidad>
                          {Number(
                            p?.inventories?.find(
                              (inv) => inv.locationId === location.id,
                            )?.quantity || 0,
                          ).toLocaleString("es-US", {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 1,
                          })}
                        </DropCantidad>

                        <DropPrice>
                          {Number(p?.salePrice || 0).toLocaleString("es-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}{" "}
                          Bs
                        </DropPrice>
                      </DropItem>
                    ))
                  )}
                </ProductDropdown>
              )}
            </div>

            <Body>
              <TableCard>
                <Table>
                  <THead>
                    <tr>
                      <TH>COD</TH>
                      <TH>Nombre</TH>
                      <TH>Unidad</TH>
                      <TH style={{ textAlign: "center" }}>Cantidad</TH>
                      <TH style={{ textAlign: "left" }}>Precio Unit.</TH>
                      <TH style={{ textAlign: "left" }}>Descuento</TH>
                      <TH style={{ textAlign: "left" }}>Subtotal</TH>
                      <TH></TH>
                    </tr>
                  </THead>
                  <TBody>
                    {cartItems.length === 0 ? (
                      <tr>
                        <td colSpan={8}>
                          <EmptyState>
                            <span style={{ fontSize: 40 }}>🛒</span>
                            <span>
                              Busca un producto para comenzar la {mode}
                            </span>
                          </EmptyState>
                        </td>
                      </tr>
                    ) : (
                      Object.values(
                        cartItems.reduce((groups, item) => {
                          if (!groups[item.productId]) {
                            groups[item.productId] = [];
                          }
                          groups[item.productId].push(item);
                          return groups;
                        }, {}),
                      ).map((group) => {
                        const usedUnitIds = group.map((i) => i.selectedUnitId);
                        const hasMorePresentations =
                          group[0].productUnits.length > usedUnitIds.length;

                        return group.map((item, idx) => {
                          const RowComponent = idx === 0 ? TR : PresentationRow;

                          const usedByOthers = group
                            .filter((g) => g.id !== item.id)
                            .reduce((acc, g) => acc + (Number(g.quantity) || 0) * g.equivalence, 0);

                          const remainingStock = item.stock - usedByOthers;
                          const maxInThisUnit = (remainingStock / item.equivalence).toFixed(2);

                          return (
                            <React.Fragment key={item.id}>
                              <RowComponent>
                                <TD style={{ color: "#94a3b8", fontSize: 13 }}>
                                  {idx === 0 ? item.code : ""}
                                </TD>
                                <TD style={{ fontWeight: idx === 0 ? 500 : 400 }}>
                                  {idx === 0 ? (
                                    item.name
                                  ) : (
                                    <span
                                      style={{
                                        color: "#94a3b8",
                                        fontSize: 12,
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 4,
                                        paddingLeft: 12,
                                      }}
                                    >
                                      ↳ presentación
                                    </span>
                                  )}
                                </TD>
                                <TD>
                                  <select
                                    value={item.selectedUnitId}
                                    onChange={(e) =>
                                      changeUnit(item.id, e.target.value)
                                    }
                                    style={{
                                      padding: "6px 10px",
                                      borderRadius: 8,
                                      border: "1px solid #E2E8F0",
                                      background: "#fff",
                                      fontSize: 13,
                                    }}
                                  >
                                    {item.productUnits
                                      .filter(
                                        (unit) =>
                                          unit.id === item.selectedUnitId ||
                                          !usedUnitIds.includes(unit.id),
                                      )
                                      .map((unit) => (
                                        <option key={unit.id} value={unit.id}>
                                          {unit.unit.name}
                                        </option>
                                      ))}
                                  </select>
                                  <div
                                    style={{
                                      fontSize: 11,
                                      marginTop: 4,
                                      color: Number(maxInThisUnit) < item.quantity ? "#dc2626" : "#94a3b8",
                                    }}
                                  >
                                    Stock: {remainingStock.toFixed(2)} {item.baseUnitName}
                                    {item.equivalence !== 1 && (
                                      <> · máx {maxInThisUnit} {item.unitName}</>
                                    )}
                                  </div>
                                </TD>
                                <TD style={{ textAlign: "center" }}>
                                  <input
                                    type="number"
                                    min="1"
                                    max={item.stock}
                                    value={item.quantity}
                                    onChange={(e) => {
                                      const valorIngresado = Number(e.target.value);

                                      if (e.target.value === "") {
                                        setCartItems((p) =>
                                          p.map((i) =>
                                            i.id === item.id
                                              ? { ...i, quantity: "" }
                                              : i,
                                          ),
                                        );
                                        return;
                                      }

                                      if (valorIngresado > item.stock) {
                                        errorToast(
                                          `Stock insuficiente. Máximo disponible: ${item.stock} unids.`,
                                        );
                                        setCartItems((p) =>
                                          p.map((i) =>
                                            i.id === item.id
                                              ? {
                                                ...i,
                                                quantity: item.stock,
                                                unitPrice: calcUnitPrice(
                                                  i.baseSalePrice,
                                                  item.stock,
                                                  i.quantityDiscount,
                                                  i.bossDiscount,
                                                ),
                                              }
                                              : i,
                                          ),
                                        );
                                        return;
                                      }

                                      if (valorIngresado >= 1) {
                                        const qty = Math.floor(valorIngresado);
                                        setCartItems((p) =>
                                          p.map((i) =>
                                            i.id === item.id
                                              ? {
                                                ...i,
                                                quantity: qty,
                                                unitPrice: calcUnitPrice(
                                                  i.baseSalePrice,
                                                  qty,
                                                  i.quantityDiscount,
                                                  i.bossDiscount,
                                                ),
                                              }
                                              : i,
                                          ),
                                        );
                                      }
                                    }}
                                    onBlur={(e) => {
                                      if (
                                        e.target.value === "" ||
                                        Number(e.target.value) < 1
                                      ) {
                                        setCartItems((p) =>
                                          p.map((i) =>
                                            i.id === item.id
                                              ? {
                                                ...i,
                                                quantity: 1,
                                                unitPrice: calcUnitPrice(
                                                  i.baseSalePrice,
                                                  1,
                                                  i.quantityDiscount,
                                                  i.bossDiscount,
                                                ),
                                              }
                                              : i,
                                          ),
                                        );
                                      }
                                    }}
                                    style={{
                                      width: "70px",
                                      padding: "6px 8px",
                                      borderRadius: "8px",
                                      border: "1px solid #E2E8F0",
                                      textAlign: "center",
                                      fontSize: "14px",
                                      fontWeight: "600",
                                      outline: "none",
                                      boxSizing: "border-box",
                                    }}
                                  />
                                </TD>
                                <TD style={{ textAlign: "right" }}>
                                  {item.unitPrice.toFixed(2)} Bs
                                </TD>
                                <TD style={{ textAlign: "right" }}>
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "flex-end",
                                      gap: 4,
                                    }}
                                  >
                                    <DiscountInput
                                      type="number"
                                      min="0"
                                      value={item.itemDiscount || ""}
                                      placeholder="0"
                                      onChange={(e) => {
                                        const v = Number(e.target.value) || 0;
                                        const max = item.unitPrice * item.quantity;
                                        setItemDiscount(
                                          item.id,
                                          Math.min(v, max),
                                        );
                                      }}
                                    />
                                    <span style={{ fontSize: 13, color: "#94a3b8" }}>
                                      Bs
                                    </span>
                                  </div>
                                </TD>
                                <TD>{itemSubtotal(item).toFixed(2)} Bs</TD>
                                <TD style={{ textAlign: "center" }}>
                                  <DeleteButton
                                    onClick={() => removeItem(item.id)}
                                  >
                                    <Trash2 size={16} />
                                  </DeleteButton>
                                </TD>
                              </RowComponent>

                              {idx === group.length - 1 && hasMorePresentations && (
                                <AddPresentationRow>
                                  <TD colSpan={8} style={{ fontWeight: 400 }}>
                                    <AddPresentationButton
                                      type="button"
                                      onClick={() => addPresentation(item.productId)}
                                    >
                                      <Plus size={14} /> Añadir presentación
                                    </AddPresentationButton>
                                  </TD>
                                </AddPresentationRow>
                              )}
                            </React.Fragment>
                          );
                        });
                      })
                    )}
                  </TBody>
                </Table>
              </TableCard>

              <div
                style={{ display: "flex", flexDirection: "column", gap: 16 }}
              >
                {mode !== "cotizacion" && (
                  <PaymentPanel>
                    <PaymentTitle>
                      {mode === "reserva"
                        ? "Medio recibo adelanto"
                        : "Método de Pago"}
                    </PaymentTitle>
                    <div className="payment-grid-cards">
                      {paymentMethodsData.map((method) => (
                        <div
                          key={method.id}
                          className={`payment-tile-card ${paymentMethod === method.id ? "active" : ""
                            }`}
                          onClick={() => setPaymentMethod(method.id)}
                        >
                          <div className="tile-icon">{method.icon}</div>
                          <span>{method.label}</span>
                        </div>
                      ))}
                    </div>
                  </PaymentPanel>
                )}

                {mode === "reserva" && (
                  <div
                    style={{
                      background: "#fff",
                      border: "1px solid #e2e8f0",
                      padding: 16,
                      borderRadius: 12,
                    }}
                  >
                    <p
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: "var(--mode-color)",
                        marginBottom: 6,
                        textTransform: "uppercase",
                      }}
                    >
                      Registrar Adelanto (Bs)
                    </p>
                    <input
                      type="number"
                      min="0"
                      max={total}
                      value={advanceAmount || ""}
                      placeholder="0.00"
                      onChange={(e) =>
                        setAdvanceAmount(
                          Math.min(Number(e.target.value) || 0, total),
                        )
                      }
                      style={{
                        width: "100%",
                        padding: 12,
                        border: "2px solid var(--mode-color)",
                        borderRadius: 8,
                        fontSize: 18,
                        fontWeight: 700,
                        textAlign: "right",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>
                )}

                {mode === "cotizacion" && (
                  <div
                    style={{
                      background: "#fff",
                      border: "1px solid #e2e8f0",
                      padding: 16,
                      borderRadius: 12,
                      display: "flex",
                      flexDirection: "column",
                      gap: 12,
                    }}
                  >
                    <div>
                      <p
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: "#64748b",
                          textTransform: "uppercase",
                          marginBottom: 4,
                        }}
                      >
                        Días de Validez
                      </p>
                      <input
                        type="number"
                        min="1"
                        value={validityDays}
                        onChange={(e) => {
                          const val = e.target.value;
                          setValidityDays(val === "" ? "" : Number(val));
                        }}
                        style={{
                          width: "100%",
                          padding: 8,
                          border: "1px solid #e2e8f0",
                          borderRadius: 6,
                          boxSizing: "border-box",
                        }}
                      />
                    </div>
                    <div>
                      <p
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: "#64748b",
                          textTransform: "uppercase",
                          marginBottom: 4,
                        }}
                      >
                        Notas u Observaciones
                      </p>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Ej: Precios sujetos a variación de stock..."
                        style={{
                          width: "100%",
                          padding: 8,
                          border: "1px solid #e2e8f0",
                          borderRadius: 6,
                          height: 60,
                          fontSize: 12,
                          resize: "none",
                          boxSizing: "border-box",
                        }}
                      />
                    </div>
                  </div>
                )}

                <SummaryPanel>
                  <SummaryRow>
                    <span>Subtotal:</span>
                    <span>{subtotal.toFixed(2)} Bs</span>
                  </SummaryRow>

                  <SummaryRow>
                    <span>Descuento:</span>
                    <span>{totalDiscount.toFixed(2)} Bs</span>
                  </SummaryRow>

                  {mode === "reserva" && (
                    <>
                      <SummaryRow
                        style={{ color: "var(--mode-color)", fontWeight: 600 }}
                      >
                        <span>Adelanto Abonado:</span>
                        <span>-{advanceAmount.toFixed(2)} Bs</span>
                      </SummaryRow>
                      <SummaryTotal style={{ borderColor: "#fee2e2" }}>
                        <span style={{ color: "#b91c1c" }}>
                          Saldo Pendiente:
                        </span>
                        <span style={{ color: "#b91c1c" }}>
                          {pendingBalance.toFixed(2)} Bs
                        </span>
                      </SummaryTotal>
                    </>
                  )}

                  {mode !== "reserva" && (
                    <SummaryTotal>
                      <span>Total:</span>
                      <span>{total.toFixed(2)} Bs</span>
                    </SummaryTotal>
                  )}
                  <CheckoutButton
                    onClick={handleCheckout}
                    disabled={isProcessing || !cartItems.length}
                  >
                    {isProcessing ? "Procesando…" : "Siguiente"}
                  </CheckoutButton>
                </SummaryPanel>
              </div>
            </Body>
          </>
        ) : (
          <SaleForm
            customerData={customerData}
            setCustomerData={setCustomerData}
            total={mode === "reserva" ? advanceAmount : total}
            mode={mode}
            paymentMethod={paymentMethod}
            loading={loading}
            onBack={() => setShowSaleForm(false)}
            totalCartAmount={total}
            validityDays={validityDays}
            onFinish={async ({
              generateInvoice,
              bankName,
              ...customerData
            }) => {
              await finalizarVenta({
                generateInvoice,
                bankName,
                ...customerData,
              });
            }}
          />
        )}
      </Wrapper>
    </ModeShell >
  );
};

export default Cart;
