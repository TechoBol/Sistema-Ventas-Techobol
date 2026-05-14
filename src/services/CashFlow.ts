import { ICashFlow } from "../components/models/CashFlow";

export const getAllCashFlow = async (token: string) => {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_DOMAIN}/cash-flow/cash-flow`,
      {
        headers: {
          "x-access-token": token,
        },
      },
    );

    if (!res.ok) return [];

    return res.json();
  } catch {
    return [];
  }
};

export const createCashFlow = async (token: string, body: ICashFlow) => {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_DOMAIN_TESORERIA}/cash-flow/create-cash-flow`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token,
        },
        body: JSON.stringify(body),
      },
    );

    if (!res.ok) return null;

    return res.json();
  } catch {
    return null;
  }
};

export const updateCashFlow = async (token: string, id: number, body: any) => {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_DOMAIN}/cash-flow/cash-flow/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token,
        },
        body: JSON.stringify(body),
      },
    );

    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
};

export const getFondosAvance = async (token: string) => {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_DOMAIN}/fondos-avance/fondos-avance`,
      {
        headers: { "x-access-token": token },
      },
    );

    return res.json();
  } catch {
    return [];
  }
};

export const createFondoAvance = async (
  token: string,
  body: {
    name: string;
    amount: number;
    currency: string;
  },
) => {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_DOMAIN}/fondos-avance/fondos-avance`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token,
        },
        body: JSON.stringify(body),
      },
    );

    if (!res.ok) return null;

    return res.json();
  } catch {
    return null;
  }
};

export const deleteFondoAvance = async (token: string, id: number) => {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_DOMAIN}/fondos-avance/fondos-avance/${id}`,
      {
        method: "DELETE",
        headers: { "x-access-token": token },
      },
    );

    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
};
