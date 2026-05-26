import { cerrarSesion } from "./CerrarSesion";
import type { CustomerDetail } from "../components/models/Client";

const API = import.meta.env.VITE_API_DOMAIN;

async function apiFetch<T>(
  path: string,
  token: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
    ...options,
  });

  if (res.status === 401 || res.status === 403) {
    cerrarSesion();
  }

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody?.message ?? `Error ${res.status}: ${res.statusText}`);
  }

  return res.json() as Promise<T>;
}

export const detailCustomerService = {
  getDetalle: (id: string, token: string): Promise<CustomerDetail> =>
    apiFetch<CustomerDetail>(`/customer/${id}`, token),

  crearNota: (id: string, content: string, token: string) =>
    apiFetch(`/customer/${id}/notes`, token, {
      method: "POST",
      body: JSON.stringify({ content }),
    }),

  actualizarNota: async (id: string, noteId: number, content: string, token: string) => {
    await apiFetch(`/customer/${id}/notes/${noteId}`, token, {
      method: "DELETE",
    });
    if (!content.trim()) return; // si está vacío, solo borra y no crea
    return apiFetch(`/customer/${id}/notes`, token, {
      method: "POST",
      body: JSON.stringify({ content }),
    });
  },

  eliminarNota: (id: string, noteId: number, token: string) =>
    apiFetch(`/customer/${id}/notes/${noteId}`, token, {
      method: "DELETE",
    }),
};