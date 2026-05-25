// src/services/cliente.service.ts

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
  // GET /customer/:id
  getDetalle: (id: string, token: string): Promise<CustomerDetail> =>
    apiFetch<CustomerDetail>(`/customer/${id}`, token),

  // POST /customer/:id/notes
  crearNota: (id: string, content: string, token: string) =>
    apiFetch(`/customer/${id}/notes`, token, {
      method: "POST",
      body: JSON.stringify({ content }),
    }),

  // DELETE /customer/:id/notes/:noteId
  eliminarNota: (id: string, noteId: number, token: string) =>
    apiFetch(`/customer/${id}/notes/${noteId}`, token, {
      method: "DELETE",
    }),
};