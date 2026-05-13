import React, { useState, useRef, useEffect } from "react";
import { Trash2, Plus, Minus, Search, X } from "lucide-react";
import {
    Wrapper, Header, Title, Subtitle,
    SearchBar, SearchInput, Body,
    TableCard, Table, THead, TH, TBody, TR, TD,
    QuantityControls, QtyButton, QtyValue,
    DiscountInput, DeleteButton, EmptyState,
    SummaryPanel, SummaryRow, SummaryTotal,
    CheckoutButton,
} from "../components/ui/Cart";

import { useInventoryStore } from "../components/store/inventoryStore";
import { useCart } from "../hooks/useCart";
import { useLoginStore } from "../components/store/loginStore";
import Swal from "sweetalert2";
import socket from "../services/SocketIOConnection";
import { getProducts } from "../services/inventoryService";
import AppLayout from "../components/layout/AppLayout";

/* ── utilidad: fecha legible ── */
const fechaHoy = () =>
    new Date().toLocaleDateString("es-BO", {
        weekday: "long", year: "numeric", month: "long", day: "numeric",
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

    const filtered = query.trim() === ""
        ? (products ?? []).slice(0, 50)           // primeros 50 cuando no hay query
        : (products ?? []).filter((p) =>
            p.name.toLowerCase().includes(query.toLowerCase()) ||
            p.code.toLowerCase().includes(query.toLowerCase())
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
    const [descuento, setDescuento] = useState("0");
    const [isProcessing, setIsProcessing] = useState(false);

    const addToCart = (product) => {
        setCartItems((prev) => {
            const exists = prev.find((i) => i.id === product.id);
            if (exists)
                return prev.map((i) =>
                    i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
                );
            return [...prev, {
                id: product.id,
                code: product.code,
                name: product.name,
                unitPrice: product.finalPrice,
                quantity: 1,
                itemDiscount: 0,
            }];
        });
        setQuery("");
        setDropOpen(false);
    };

    const removeItem = (id) => setCartItems((p) => p.filter((i) => i.id !== id));
    const increaseQty = (id) => setCartItems((p) =>
        p.map((i) => i.id === id ? { ...i, quantity: i.quantity + 1 } : i));
    const decreaseQty = (id) => setCartItems((p) =>
        p.map((i) => i.id === id
            ? i.quantity > 1 ? { ...i, quantity: i.quantity - 1 } : i
            : i));
    const setItemDiscount = (id, val) => setCartItems((p) =>
        p.map((i) => i.id === id ? { ...i, itemDiscount: Number(val) || 0 } : i));

    /* ── cálculos ── */
    const subtotal = cartItems.reduce(
        (acc, i) => acc + (i.unitPrice * i.quantity - i.itemDiscount), 0
    );
    const globalDiscount = Math.min(Number(descuento) || 0, subtotal);
    const total = Math.max(0, subtotal - globalDiscount);

    const itemSubtotal = (item) =>
        Math.max(0, item.unitPrice * item.quantity - item.itemDiscount);

    /* ── checkout ── */
    const { createSale } = useCart();

    const handleCheckout = async () => {
        if (!cartItems.length) {
            Swal.fire({ title: "Carrito vacío", text: "Agrega productos antes de continuar.", icon: "warning" });
            return;
        }

        const confirm = await Swal.fire({
            title: "¿Confirmar venta?",
            text: "Selecciona el método de pago",
            icon: "question",
            showDenyButton: true,
            confirmButtonText: "💵 Efectivo",
            denyButtonText: "📱 QR",
            confirmButtonColor: "#fb0404",
            denyButtonColor: "#ffffff",
        });

        if (confirm.isDismissed) return;

        const metodoPago = confirm.isConfirmed ? "Efectivo" : "Qr";
        await finalizarVenta({ metodoPago, codigoTransaccion: null });

        Swal.fire({
            title: "¡Venta realizada!",
            text: `Pago ${metodoPago === "Efectivo" ? "en efectivo" : "QR"} registrado correctamente.`,
            icon: "success",
            confirmButtonColor: "#fb0404",
        });
    };

    const finalizarVenta = async ({ metodoPago, codigoTransaccion }) => {
        if (isProcessing) return;
        setIsProcessing(true);
        try {
            const payload = {
                products: cartItems.map((i) => ({
                    productId: i.id,
                    quantity: i.quantity,
                    itemDiscount: i.itemDiscount,
                })),
                discount: globalDiscount,
                metodoPago,
                codigoTransaccion,
            };
            console.log("Payload venta:", payload);
            const result = await createSale(payload, cartItems, subtotal, globalDiscount, total);
            socket.emit("newCartProduct", result);
            setCartItems([]);
            setDescuento("0");
        } catch (err) {
            console.error(err);
            Swal.fire({ title: "Error", text: "No se pudo procesar la venta.", icon: "error" });
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
                <div ref={searchRef} style={{ position: "relative", width: "fit-content" }}>
                    <SearchBar>
                        <Search size={16} color="#94a3b8" />
                        <SearchInput
                            placeholder="Buscar por nombre o código…"
                            value={query}
                            onFocus={() => setDropOpen(true)}
                            onChange={(e) => { setQuery(e.target.value); setDropOpen(true); }}
                        />
                        {query && (
                            <X size={15} color="#94a3b8" style={{ cursor: "pointer", flexShrink: 0 }}
                                onClick={() => { setQuery(""); setDropOpen(false); }} />
                        )}
                    </SearchBar>

                    {dropOpen && (
                        <ProductDropdown>
                            {filtered.length === 0 ? (
                                <DropEmpty>Sin resultados</DropEmpty>
                            ) : filtered.map((p) => (
                                <DropItem key={p.id} onClick={() => addToCart(p)}>
                                    <DropCode>{p.code}</DropCode>
                                    <DropName>{p.name}</DropName>
                                    <DropPrice>Bs {p.finalPrice.toFixed(2)}</DropPrice>
                                </DropItem>
                            ))}
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
                                ) : cartItems.map((item) => (
                                    <TR key={item.id}>
                                        <TD style={{ color: "#94a3b8", fontSize: 13 }}>{item.code}</TD>
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
                                        <TD style={{ textAlign: "right" }}>Bs {item.unitPrice.toFixed(2)}</TD>
                                        <TD style={{ textAlign: "right" }}>
                                            <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 4 }}>
                                                <span style={{ fontSize: 13, color: "#94a3b8" }}>Bs</span>
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
                                ))}
                            </TBody>
                        </Table>
                    </TableCard>

                    {/* panel resumen */}
                    <SummaryPanel>
                        <SummaryRow>
                            <span>Subtotal:</span>
                            <span>Bs {subtotal.toFixed(2)}</span>
                        </SummaryRow>

                        <SummaryRow>
                            <span>Descuento:</span>
                            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                                <span style={{ fontSize: 13, color: "#94a3b8" }}>Bs</span>
                                <DiscountInput
                                    type="number"
                                    min="0"
                                    value={descuento}
                                    onFocus={() => descuento === "0" && setDescuento("")}
                                    onBlur={() => descuento === "" && setDescuento("0")}
                                    onChange={(e) => {
                                        const v = e.target.value;
                                        if (v === "") { setDescuento(""); return; }
                                        const n = Number(v);
                                        if (n < 0) return;
                                        setDescuento(n > subtotal ? String(subtotal) : v);
                                    }}
                                />
                            </div>
                        </SummaryRow>

                        <SummaryTotal>
                            <span>Total:</span>
                            <span>Bs {total.toFixed(2)}</span>
                        </SummaryTotal>

                        <CheckoutButton onClick={handleCheckout} disabled={isProcessing || !cartItems.length}>
                            {isProcessing ? "Procesando…" : "Siguiente"}
                        </CheckoutButton>
                    </SummaryPanel>
                </Body>
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
  box-shadow: 0 8px 32px rgba(0,0,0,0.12);
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
  gap: 12px;
  padding: 10px 16px;
  cursor: pointer;
  transition: background 0.12s;

  &:hover { background: #fff7f0; }
`;

const DropCode = styled.span`
  font-size: 12px;
  color: #94a3b8;
  width: 70px;
  flex-shrink: 0;
`;

const DropName = styled.span`
  flex: 1;
  font-size: 14px;
  font-weight: 500;
  color: #0f172a;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const DropPrice = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #fb0404;
  flex-shrink: 0;
`;

export default Cart;