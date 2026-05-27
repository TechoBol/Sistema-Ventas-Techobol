import { useState } from "react";
import {
  createProductService,
  updateProductService,updateMargenService
} from "../services/productService";
import { useLoginStore } from "../components/store/loginStore";

export const useProduct = () => {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { token, location } = useLoginStore();


  const createProduct = async (data: any) => {
    try {
      setError(null);
      const payload = {
        ...data,
        locationId: data.locationId ?? location.id,
      };

      const result = await createProductService(payload, token);
      return result;
    } catch (err) {
      setError("Error creando producto");
      throw err;
    } finally {
      setLoading(false);
    }
  };
  const updateProduct = async (id: number, data: any) => {
    try {
      setError(null);

      const payload = {
        ...data,
        locationId: data.locationId ?? location.id,
      };

      const result = await updateProductService(id, payload, token);
      return result;
    } catch (err) {
      setError("Error actualizando producto");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateMargen = async (id: number, data: any) => {
    try {
      setError(null);

      const payload = {
        ...data,
      };

      const result = await updateMargenService(id, payload, token);
      return result;
    } catch (err) {
      setError("Error actualizando producto");
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  return {
    createProduct,
    loading,
    setLoading,
    error,
    updateProduct,
    updateMargen
  };
};
