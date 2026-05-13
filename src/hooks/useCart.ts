import { useState } from "react";
import { useLoginStore } from "../components/store/loginStore";
import { createSaleService } from "../services/cartService";

export const useCart = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const { token, location }   = useLoginStore();

  const createSale = async (
    data: any,
    cartItems: any[],
    subtotal: number,
    discount: number,
    total: number
  ) => {
    try {
      setLoading(true);
      setError(null);

      const payload = {
        ...data,
        locationId: location.id,
      };

      const venta = await createSaleService(payload, token);
      return venta.sale;
    } catch (err) {
      setError("Error creando venta");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createSale, loading, error };
};