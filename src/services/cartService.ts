export const createSaleService = async (data: any, token: string) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_DOMAIN}/sale/create-sale`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": token,
      },
      body: JSON.stringify(data),
    },
  );

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    console.error("Backend error:", response.status, errorBody);
    throw new Error(errorBody?.message || "No se pudo realizar la venta");
  }

  return response.json();
};

export const createQuotationService = async (data: any, token: string) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_DOMAIN}/quotations/create-quotation`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": token,
      },
      body: JSON.stringify(data),
    },
  );

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    console.error("Backend error:", response.status, errorBody);
    throw new Error(errorBody?.message || "No se pudo crear la cotización");
  }

  return response.json();
};