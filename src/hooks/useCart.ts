import { useState } from "react";
import { useLoginStore } from "../components/store/loginStore";
import { createSaleService } from "../services/cartService";
import { useAmazonS3 } from "./useAmazonS3";
import { generarPDF } from "../components/pdf/generarPDF.jsx";
import { socketTesoreria } from "../services/SocketIOConnection.ts";
import { successToast } from "../services/toasts";
import { useCashFlow } from "./useCashFlow";

export const useCart = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { token, location, fullName } = useLoginStore();

  const { uploadPDF } = useAmazonS3();
  const { addCashFlow } = useCashFlow();

  const createSale = async (
    data: any,
    cartItems: any[],
    subtotal: number,
    discount: number,
    total: number,
  ) => {
    try {
      setLoading(true);
      setError(null);

      const payload = {
        ...data,
        locationId: location.id,
      };

      // 1. Crear venta
      const venta = await createSaleService(payload, token);

      const sale = venta.sale;

      // 2. Generar PDF
      const pdfBlob = generarPDF(sale, fullName);

      // 3. Convertir Blob a File
      const file = new File([pdfBlob], `venta_${sale.code}.pdf`, {
        type: "application/pdf",
      });

      // 4. Subir PDF
      await uploadPDF(file, sale.code);
      if (data.metodoPago === "Deposito bancario" || data.metodoPago === "QR") {
        const payloadCashFlow = {
          date: sale.date,
          account: `Caja Central`,
          type: "income",
          amount: sale.total,
          items: [
            {
              amount: sale.total,
              payer: `${sale.employee.name} ${sale.employee.lastName}`,
              description: sale.code,
              source: "Deposito",
            },
          ],
          isUSD: false,
        };
        const cashFlow = await addCashFlow(payloadCashFlow as any);
        // 6. Socket
        socketTesoreria.emit("createCashFlow", cashFlow);
      }
      return sale;
    } catch (err) {
      console.error(err);
      setError("Error creando venta");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createSale,
    loading,
    error,
  };
};
