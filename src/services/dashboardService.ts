import { cerrarSesion } from "./CerrarSesion";

const API = import.meta.env.VITE_API_DOMAIN;

export const getDashboardSummaryService = async (token: string) => {
  const res = await fetch(`${API}/dashboard/summary`, {
    headers: {
      "x-access-token": token,
    },
  });
  if (res.status === 401 || res.status === 403) {
    cerrarSesion();
  }
  return res.json();
};