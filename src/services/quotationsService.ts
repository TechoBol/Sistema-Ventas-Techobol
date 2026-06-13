export const getQuotationsService = async (token: string) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_DOMAIN}/quotations/get-quotations`,
    {
      headers: { "x-access-token": token },
    }
  );
  if (!response.ok) throw new Error("No se pudieron obtener las cotizaciones");
  return response.json();
};

export const updateQuotationStatusService = async (
  id: number,
  status: string,
  token: string
) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_DOMAIN}/quotations/${id}/status`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": token,
      },
      body: JSON.stringify({ status }),
    }
  );
  if (!response.ok) throw new Error("No se pudo actualizar el estado");
  return response.json();
};

export const convertQuotationService = async (
  id: number,
  data: any,
  token: string
) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_DOMAIN}/quotations/${id}/convert`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": token,
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    console.error("Backend error:", response.status, errorBody);
    throw new Error(errorBody?.message || "No se pudo convertir la cotización");
  }

  return response.json();
};