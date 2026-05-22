import { useState } from "react";
import { useLoginStore } from "../components/store/loginStore";
import { createSaleService } from "../services/cartService";
import { useAmazonS3 } from "./useAmazonS3";
import { generarDocumentoVenta } from "../components/pdf/generarPDF.jsx";
import { generarFacturaVenta } from "../components/pdf/generarPDFFactura.jsx";
import { socketTesoreria } from "../services/SocketIOConnection.ts";
import { useCashFlow } from "./useCashFlow";

export const useCart = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { token, location, fullName } = useLoginStore();

  const { uploadPDF, uploadPDFFactura } = useAmazonS3();
  const { addCashFlow } = useCashFlow();

  const createSale = async (
    data: any,
    cartItems: any[],
    subtotal: number,
    discount: number,
    total: number,
    generateInvoice: boolean,
    bankName: string
  ) => {
    try {
      setLoading(true);
      setError(null);

      const payload = {
        ...data,
        locationId: location.id,
      };
      const venta = await createSaleService(payload, token);
      const sale = venta.sale;
      const pdfBlob = generarDocumentoVenta(sale);
      const file = new File([pdfBlob], `venta_${sale.code}.pdf`, {
        type: "application/pdf",
      });
      await uploadPDF(file, sale.code);
      console.log(generateInvoice)
      if (generateInvoice) {
        const pdfBlobFactura = generarFacturaVenta(sale);
        const fileFactura = new File(
          [pdfBlobFactura],
          `factura_${sale.code}.pdf`,
          {
            type: "application/pdf",
          },
        );
        await uploadPDFFactura(fileFactura, sale.code);
      }

      if (data.metodoPago === "Deposito bancario" || data.metodoPago === "QR") {
        const payloadCashFlow = {
          date: sale.date,
          account: data.metodoPago === "QR"? "Banco BCP" : bankName,
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
