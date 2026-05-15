import { useState } from "react";
import { useLoginStore } from "../components/store/loginStore";
import { createSaleService } from "../services/cartService";
import { useAmazonS3 } from "./useAmazonS3";
import { generarDocumentoVenta } from "../components/pdf/generarPDF.jsx";
import { socketTesoreria } from "../services/SocketIOConnection.ts";
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

      // =====================================================
      // 1. CREAR VENTA
      // =====================================================

      const venta = await createSaleService(payload, token);

      const sale = venta.sale;

      // =====================================================
      // 2. GENERAR PDF
      // (2 notas entrega + factura)
      // =====================================================

      const pdfBlob = generarDocumentoVenta(sale);

      // =====================================================
      // 3. CONVERTIR A FILE
      // =====================================================

      const file = new File([pdfBlob], `venta_${sale.code}.pdf`, {
        type: "application/pdf",
      });

      // =====================================================
      // 4. SUBIR PDF
      // =====================================================

      await uploadPDF(file, sale.code);

      // =====================================================
      // 5. MOVIMIENTO TESORERIA
      // =====================================================

      if (data.metodoPago === "Deposito bancario" || data.metodoPago === "QR") {
        const payloadCashFlow = {
          date: sale.date,
          account: "Caja Central",
          type: "income",
          amount: sale.total,
          source: data.metodoPago,
          items: [
            {
              amount: sale.total,

              payer: `${sale.employee.name} ${sale.employee.lastName}`,

              description: `VENTA: ${sale.code} - PAGO MEDIANTE: ${data.metodoPago}`,

              source: data.metodoPago,
            },
          ],

          isUSD: false,
        };

        const cashFlow = await addCashFlow(payloadCashFlow as any);

        // socket
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
