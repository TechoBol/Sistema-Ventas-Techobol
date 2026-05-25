// src/hooks/useDetailCustomer.ts

import { useState, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLoginStore } from "../components/store/loginStore";
import { detailCustomerService } from "../services/detailCustomerService";
import type {
  CustomerDetail,
  CustomerNote,
  CustomerSale,
} from "../components/models/Client";

interface UseDetailCustomerReturn {
  customer: CustomerDetail | null;
  loading: boolean;
  error: string | null;
  // datos derivados listos para usar en el page
  totalGastado: number;
  comprasRealizadas: number;
  ticketPromedio: number;
  ultimaCompra: string | null;
  ventasPorMes: { mes: string; total: number }[];
  // notas
  crearNota: (content: string) => Promise<void>;
  eliminarNota: (noteId: number) => Promise<void>;
  guardandoNota: boolean;
  errorNota: string | null;
}

// ── helpers ──────────────────────────────────────────────────

function calcularVentasPorMes(sales: CustomerSale[]) {
  const meses: Record<string, number> = {};

  for (const sale of sales) {
    const fecha = new Date(sale.date);
    const key = fecha.toLocaleDateString("es-BO", {
      month: "short",
      year: "2-digit",
    });
    meses[key] = (meses[key] ?? 0) + sale.total;
  }

  return Object.entries(meses).map(([mes, total]) => ({ mes, total }));
}

// ── hook ─────────────────────────────────────────────────────

export function useDetailCustomer(id: string): UseDetailCustomerReturn {
  const { token } = useLoginStore();
  const queryClient = useQueryClient();

  const [guardandoNota, setGuardandoNota] = useState(false);
  const [errorNota, setErrorNota] = useState<string | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["customer", id],
    queryFn: () => detailCustomerService.getDetalle(id, token),
    enabled: !!id && !!token,
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  // ── datos derivados ──────────────────────────────────────

  const sales = data?.sales ?? [];
  const totalGastado = sales.reduce((acc, s) => acc + s.total, 0);
  const comprasRealizadas = sales.length;
  const ticketPromedio = comprasRealizadas > 0 ? totalGastado / comprasRealizadas : 0;
  const ultimaCompra = sales.length > 0
    ? new Date(sales[sales.length - 1].date).toLocaleDateString("es-BO")
    : null;
  const ventasPorMes = calcularVentasPorMes(sales);

  // ── acciones ─────────────────────────────────────────────

  const crearNota = useCallback(async (content: string) => {
    if (!id) return;
    setGuardandoNota(true);
    setErrorNota(null);
    try {
      await detailCustomerService.crearNota(id, content, token);
      await queryClient.invalidateQueries({ queryKey: ["customer", id] });
    } catch (err) {
      setErrorNota(err instanceof Error ? err.message : "Error al guardar nota");
    } finally {
      setGuardandoNota(false);
    }
  }, [id, token, queryClient]);

  const eliminarNota = useCallback(async (noteId: number) => {
    if (!id) return;
    try {
      await detailCustomerService.eliminarNota(id, noteId, token);
      await queryClient.invalidateQueries({ queryKey: ["customer", id] });
    } catch (err) {
      console.error("Error eliminando nota:", err);
    }
  }, [id, token, queryClient]);

  return {
    customer: data ?? null,
    loading: isLoading,
    error: error instanceof Error ? error.message : null,
    totalGastado,
    comprasRealizadas,
    ticketPromedio,
    ultimaCompra,
    ventasPorMes,
    crearNota,
    eliminarNota,
    guardandoNota,
    errorNota,
  };
}