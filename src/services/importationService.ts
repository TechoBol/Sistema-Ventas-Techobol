import { cerrarSesion } from "./CerrarSesion";

const API = import.meta.env.VITE_API_DOMAIN;

export const getImportationsService = async (token: string) => {
  const res = await fetch(`${API}/importation/get-importations`, {
    method: "GET",
    headers: {
      "x-access-token": token,
    },
  });

  if (res.status === 401 || res.status === 403) {
    cerrarSesion();
  }

  if (!res.ok) throw new Error("Error al cargar las importaciones.");

  return res.json();
};

export const getImportationByIdService = async (id: number, token: string) => {
  const res = await fetch(`${API}/importation/get-importation/${id}`, {
    method: "GET",
    headers: {
      "x-access-token": token,
    },
  });

  if (res.status === 401 || res.status === 403) {
    cerrarSesion();
  }

  if (!res.ok) throw new Error("Error al cargar la importación.");

  return res.json();
};

export const createImportationService = async (data: any, token: string) => {
  const res = await fetch(`${API}/importation/create-importation`, {
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

  if (!res.ok) throw new Error("No se pudo crear la importación.");

  return res.json();
};

export const updateImportationService = async (
  id: number,
  data: any,
  token: string,
) => {
  const res = await fetch(`${API}/importation/update-importation/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
    body: JSON.stringify(data),
  });

  if (res.status === 401 || res.status === 403) {
    cerrarSesion();
  }

  if (!res.ok) throw new Error("No se pudo actualizar la importación.");

  return res.json();
};

export const verifyImportationService = async (id: number, token: string) => {
  const res = await fetch(`${API}/importation/verify-importation/${id}`, {
    method: "PATCH",
    headers: {
      "x-access-token": token,
    },
  });

  if (res.status === 401 || res.status === 403) {
    cerrarSesion();
  }

  if (!res.ok) throw new Error("No se pudo verificar la importación.");

  return res.json();
};
