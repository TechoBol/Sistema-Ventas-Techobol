import { cerrarSesion } from "./CerrarSesion";

const API = import.meta.env.VITE_API_DOMAIN;

export const getCustomersService = async (token: string) => {
  const res = await fetch(`${API}/customer`, {
    method: "GET",
    headers: {
      "x-access-token": token,
    },
  });
  if (res.status === 401 || res.status === 403) {
    cerrarSesion();
  }
  if (!res.ok) throw new Error("Error al cargar los clientes.");
  return res.json();
};

export const getCustomerByIdService = async (id: number, token: string) => {
  const res = await fetch(`${API}/customer/${id}`, {
    method: "GET",
    headers: {
      "x-access-token": token,
    },
  });

  if (!res.ok) throw new Error("Error al obtener el cliente.");
  return res.json();
};

export const createCustomerService = async (data: any, token: string) => {
  const res = await fetch(`${API}/customer`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("No se pudo crear el cliente.");
  return res.json();
};

export const updateCustomerService = async (
  id: number,
  data: any,
  token: string,
) => {
  const res = await fetch(`${API}/customer/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("No se pudo actualizar el cliente.");
  return res.json();
};

export const deleteCustomerService = async (id: number, token: string) => {
  const res = await fetch(`${API}/customer/${id}`, {
    method: "DELETE",
    headers: {
      "x-access-token": token,
    },
  });

  if (!res.ok) throw new Error("Error al eliminar el cliente.");
  return res.json();
};

export const addCustomerNitService = async (
  customerId: number,
  data: { number: string; companyName?: string },
  token: string,
) => {
  const res = await fetch(`${API}/customer/${customerId}/nits`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
    body: JSON.stringify(data),
  });

  if (res.status === 401 || res.status === 403) {
    cerrarSesion();
  }

  if (res.status === 409) {
    throw new Error("Este NIT ya está registrado para este cliente.");
  }

  if (!res.ok) throw new Error("No se pudo agregar el NIT.");
  return res.json();
};