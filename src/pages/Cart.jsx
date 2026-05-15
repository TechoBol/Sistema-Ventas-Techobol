import React, { useState, useRef, useEffect } from "react";
import { Trash2, Plus, Minus, Search, X } from "lucide-react";
import {
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
  QuantityControls,
  QtyButton,
  QtyValue,
  DiscountInput,
  DeleteButton,
  EmptyState,
  SummaryPanel,
  SummaryRow,
  SummaryTotal,
  CheckoutButton,
  PaymentPanel,
  PaymentTitle,
  RadioGroup,
  RadioOption
} from "../components/ui/Cart";

import { useInventoryStore } from "../components/store/inventoryStore";
import { useCart } from "../hooks/useCart";
import { useLoginStore } from "../components/store/loginStore";
import Swal from "sweetalert2";
import { socket } from "../services/SocketIOConnection";
import { getProducts } from "../services/inventoryService";
import AppLayout from "../components/layout/AppLayout";
import CheckoutModal from "../components/modals/CheckoutModal";

/* ── utilidad: fecha legible ── */
const fechaHoy = () =>
  new Date().toLocaleDateString("es-BO", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const Cart = () => {
  /* ── productos del store global ── */
  const { products, setProducts } = useInventoryStore();
  const { token } = useLoginStore();

  useEffect(() => {
    if (products?.length) return;
    getProducts(token).then((data) => setProducts(data));
  }, []);

  /* ── estado de búsqueda ── */
  const [query, setQuery] = useState("");
  const [dropOpen, setDropOpen] = useState(false);
  const searchRef = useRef(null);
  const [paymentMethod, setPaymentMethod] = useState("Efectivo");
  const filtered =
    query.trim() === ""
      ? (products ?? []).slice(0, 50) // primeros 50 cuando no hay query
      : (products ?? []).filter(
          (p) =>
            p.name.toLowerCase().includes(query.toLowerCase()) ||
            p.code.toLowerCase().includes(query.toLowerCase()),
        );

  /* cierra el dropdown al hacer click fuera */
  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target))
        setDropOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ── carrito local ── */
  const [cartItems, setCartItems] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const addToCart = (product) => {
    setCartItems((prev) => {
      const exists = prev.find((i) => i.id === product.id);
      if (exists)
        return prev.map((i) =>
          i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i,
        );
      return [
        ...prev,
        {
          id: product.id,
          code: product.code,
          name: product.name,
          unitPrice: product.finalPrice,
          quantity: 1,
          itemDiscount: 0,
        },
      ];
    });
    setQuery("");
    setDropOpen(false);
  };

  const removeItem = (id) => setCartItems((p) => p.filter((i) => i.id !== id));
  const increaseQty = (id) =>
    setCartItems((p) =>
      p.map((i) => (i.id === id ? { ...i, quantity: i.quantity + 1 } : i)),
    );
  const decreaseQty = (id) =>
    setCartItems((p) =>
      p.map((i) =>
        i.id === id
          ? i.quantity > 1
            ? { ...i, quantity: i.quantity - 1 }
            : i
          : i,
      ),
    );
  const setItemDiscount = (id, val) =>
    setCartItems((p) =>
      p.map((i) =>
        i.id === id ? { ...i, itemDiscount: Number(val) || 0 } : i,
      ),
    );

  /* ── cálculos ── */

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

  /* ── checkout ── */
  const { createSale, loading } = useCart();
  const [openCheckoutModal, setOpenCheckoutModal] = useState(false);

  const handleCheckout = async () => {
    if (!cartItems.length) {
      Swal.fire({
        title: "Carrito vacío",
        text: "Agrega productos antes de continuar.",
        icon: "warning",
      });
      return;
    }
    setOpenCheckoutModal(true);
  };

  const finalizarVenta = async ({
    metodoPago,
    codigoTransaccion,
    customerData,
  }) => {
    if (isProcessing) return;

    setIsProcessing(true);

    try {
      const payload = {
        customer: customerData,

        products: cartItems.map((item) => ({
          productId: item.id,

          quantity: item.quantity,

          itemDiscount: Number(item.itemDiscount || 0),
        })),

        subtotal,

        total,

        metodoPago,

        codigoTransaccion,
      };

      console.log("Payload venta:", payload);

      const result = await createSale(
        payload,
        cartItems,
        subtotal,
        totalDiscount,
        total,
      );

      socket.emit("newCartProduct", result);

      // 🔥 LIMPIAR
      setCartItems([]);

      // 🔥 CERRAR MODAL
      setOpenCheckoutModal(false);

      // 🔥 ALERTA
      await Swal.fire({
        title: "Venta realizada",

        text: "La venta fue registrada correctamente",

        icon: "success",

        confirmButtonColor: "#fb0404",
      });
    } catch (err) {
      console.error(err);

      Swal.fire({
        title: "Error",

        text: "No se pudo procesar la venta.",

        icon: "error",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  /* ── render ── */
  return (
    <AppLayout>
      <Wrapper>
        {/* cabecera */}
        <Header>
          <Title>Venta</Title>
          <Subtitle>{fechaHoy()}</Subtitle>
        </Header>

        {/* búsqueda con dropdown */}
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
                    <DropCode>{p.code}</DropCode>

                    <DropName>{p.name}</DropName>

                    <DropCantidad>{p.inventories[0].quantity}</DropCantidad>

                    <DropPrice>Bs {p.finalPrice.toFixed(2)}</DropPrice>
                  </DropItem>
                ))
              )}
            </ProductDropdown>
          )}
        </div>

        {/* cuerpo: tabla + panel */}
        <Body>
          <TableCard>
            <Table>
              <THead>
                <tr>
                  <TH>COD</TH>
                  <TH>Nombre</TH>
                  <TH style={{ textAlign: "center" }}>Cantidad</TH>
                  <TH style={{ textAlign: "right" }}>Precio Unit.</TH>
                  <TH style={{ textAlign: "right" }}>Descuento</TH>
                  <TH style={{ textAlign: "right" }}>Subtotal</TH>
                  <TH />
                </tr>
              </THead>
              <TBody>
                {cartItems.length === 0 ? (
                  <tr>
                    <td colSpan={7}>
                      <EmptyState>
                        <span style={{ fontSize: 40 }}>🛒</span>
                        <span>Busca un producto para comenzar</span>
                      </EmptyState>
                    </td>
                  </tr>
                ) : (
                  cartItems.map((item) => (
                    <TR key={item.id}>
                      <TD style={{ color: "#94a3b8", fontSize: 13 }}>
                        {item.code}
                      </TD>
                      <TD style={{ fontWeight: 500 }}>{item.name}</TD>
                      <TD>
                        <QuantityControls style={{ justifyContent: "center" }}>
                          <QtyButton onClick={() => decreaseQty(item.id)}>
                            <Minus size={13} />
                          </QtyButton>
                          <QtyValue>{item.quantity}</QtyValue>
                          <QtyButton onClick={() => increaseQty(item.id)}>
                            <Plus size={13} />
                          </QtyButton>
                        </QuantityControls>
                      </TD>
                      <TD style={{ textAlign: "right" }}>
                        Bs {item.unitPrice.toFixed(2)}
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
                          <span style={{ fontSize: 13, color: "#94a3b8" }}>
                            Bs
                          </span>
                          <DiscountInput
                            type="number"
                            min="0"
                            value={item.itemDiscount || ""}
                            placeholder="0"
                            onChange={(e) => {
                              const v = Number(e.target.value) || 0;
                              const max = item.unitPrice * item.quantity;
                              setItemDiscount(item.id, Math.min(v, max));
                            }}
                          />
                        </div>
                      </TD>
                      <TD>Bs {itemSubtotal(item).toFixed(2)}</TD>
                      <TD style={{ textAlign: "center" }}>
                        <DeleteButton onClick={() => removeItem(item.id)}>
                          <Trash2 size={16} />
                        </DeleteButton>
                      </TD>
                    </TR>
                  ))
                )}
              </TBody>
            </Table>
          </TableCard>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            {/* panel tipo pago */}
            <PaymentPanel>
              <PaymentTitle>Tipo de pago</PaymentTitle>

              <RadioGroup>
                <RadioOption>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Efectivo"
                    checked={paymentMethod === "Efectivo"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  Efectivo
                </RadioOption>

                <RadioOption>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Deposito bancario"
                    checked={paymentMethod === "Deposito bancario"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  Deposito bancario
                </RadioOption>

                <RadioOption>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="QR"
                    checked={paymentMethod === "QR"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  QR
                </RadioOption>
              </RadioGroup>
            </PaymentPanel>

            {/* panel resumen */}
            <SummaryPanel>
              <SummaryRow>
                <span>Subtotal:</span>
                <span>Bs {subtotal.toFixed(2)}</span>
              </SummaryRow>

              <SummaryRow>
                <span>Descuento:</span>
                <span>Bs {totalDiscount.toFixed(2)}</span>
              </SummaryRow>

              <SummaryTotal>
                <span>Total:</span>
                <span>Bs {total.toFixed(2)}</span>
              </SummaryTotal>

              <CheckoutButton
                onClick={handleCheckout}
                disabled={isProcessing || !cartItems.length}
              >
                {isProcessing ? "Procesando…" : "Siguiente"}
              </CheckoutButton>
            </SummaryPanel>
          </div>
        </Body>
        <CheckoutModal
          open={openCheckoutModal}
          total={total}
          paymentMethod={paymentMethod}
          loading={loading}
          onClose={() => setOpenCheckoutModal(false)}
          onFinish={async (customerData) => {
            await finalizarVenta({
              metodoPago: paymentMethod,
              codigoTransaccion: null,
              customerData,
            });
          }}
        />
      </Wrapper>
    </AppLayout>
  );
};

/* estilos inline del dropdown */
import styled from "styled-components";

const ProductDropdown = styled.div`
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  width: 420px;
  max-height: 320px;
  overflow-y: auto;
  background: #ffffff;
  border-radius: 14px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  z-index: 100;
  padding: 6px 0;

  @media (max-width: 600px) {
    width: 100vw;
    left: -16px;
  }
`;

const DropItem = styled.div`
  display: flex;
  align-items: center;

  padding: 10px 16px;

  cursor: pointer;

  transition: background 0.12s;

  &:hover {
    background: #fff7f0;
  }
`;

const DropCode = styled.span`
  width: 80px;
  flex-shrink: 0;

  font-size: 12px;
  color: #94a3b8;

  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const DropName = styled.span`
  width: 180px;
  flex-shrink: 0;

  font-size: 14px;
  font-weight: 500;
  color: #0f172a;

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const DropCantidad = styled.span`
  width: 60px;
  flex-shrink: 0;

  text-align: left;

  font-size: 14px;
  font-weight: 600;
  color: #0f172a;
`;

const DropPrice = styled.span`
  width: 80px;
  flex-shrink: 0;

  text-align: left;

  font-size: 14px;
  font-weight: 600;
  color: #fb0404;
`;
const DropHeader = styled.div`
  display: flex;
  align-items: center;

  padding: 10px 16px;

  border-bottom: 1px solid #e2e8f0;

  background: #f8fafc;

  position: sticky;
  top: 0;

  z-index: 2;
`;
const DropHeaderCode = styled.span`
  width: 80px;
  flex-shrink: 0;

  font-size: 12px;
  font-weight: 700;

  color: #64748b;
`;
const DropHeaderName = styled.span`
  width: 180px;
  flex-shrink: 0;
  font-size: 12px;
  font-weight: 700;

  color: #64748b;
`;

const DropHeaderQty = styled.span`
  width: 60px;
  flex-shrink: 0;

  text-align: left;

  font-size: 12px;
  font-weight: 700;

  color: #64748b;
`;
const DropHeaderPrice = styled.span`
  width: 80px;
  flex-shrink: 0;

  text-align: left;

  font-size: 12px;
  font-weight: 700;

  color: #64748b;
`;
const CustomerEmpty = styled.div`
    padding: 20px;

    text-align: center;

    font-size: 14px;

    font-weight: 600;

    color: #94a3b8;
`;
export default Cart;
