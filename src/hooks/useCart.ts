import { useState } from "react";
import { useLoginStore } from "../components/store/loginStore";
import { createSaleService, createQuotationService } from "../services/cartService";
import { useAmazonS3 } from "./useAmazonS3";
import { generarDocumentoVenta } from "../components/pdf/generarPDF.jsx";
import { generarFacturaVenta } from "../components/pdf/generarPDFFactura.jsx";
import { generarDocumentoCotizacion_ } from "../components/pdf/generarPDFCotizacion.jsx";
import { socketTesoreria } from "../services/SocketIOConnection.ts";
import { useCashFlow } from "./useCashFlow";

export const useCart = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { token, location } = useLoginStore();
  const { uploadPDF, uploadPDFCotizacion, uploadPDFFactura } = useAmazonS3();
  const { addCashFlow } = useCashFlow();

  const createSale = async (
    data: {
      name: string;
      nitCi: string;
      phone: string;
      whatsapp: string;
      originChannel: string;
      address: string;
      latitude: number | null;
      longitude: number | null;
      customerId: number | null;
      generateInvoice: boolean;
      bankName: string;
      paymentMethod: string;
      mode: string;
      validityDays?: number;
      notes?: string;
    },
    cartItems: any[],
    subtotal: number,
    discount: number,
    total: number
  ) => {
    try {
      setLoading(true);
      setError(null);

      // =====================================================
      // 🔥 COTIZACIÓN — flujo separado
      // =====================================================
      if (data.mode === "cotizacion") {
        const expiresAt = data.validityDays
          ? new Date(Date.now() + data.validityDays * 24 * 60 * 60 * 1000).toISOString()
          : null;

        const payload = {
          locationId: location.id,
          products: cartItems,
          subtotal,
          total,
          name: data.name,
          ci: data.customerId ? undefined : data.nitCi,
          phone: data.phone,
          whatsapp: data.whatsapp,
          originChannel: data.originChannel,
          address: data.address,
          latitude: data.latitude,
          longitude: data.longitude,
          businessName: data.name,
          notes: data.notes || null,
          expiresAt,
          customerId: data.customerId || undefined,
        };

        const result = await createQuotationService(payload, token);
        const quotation = result.quotation;

        // PDF cotización
        const pdfBlob = generarDocumentoCotizacion_(quotation);
        const file = new File([pdfBlob], `${quotation.code}.pdf`, {
          type: "application/pdf",
        });
        await uploadPDFCotizacion(file, quotation.code);

        return quotation;
      }

      // =====================================================
      // 🔥 VENTA — flujo normal
      // =====================================================
      const payload = {
        ...data,
        products: cartItems,
        subtotal,
        discount,
        total,
        locationId: location.id,
        metodoPago: data.paymentMethod,
        ci: data.nitCi,
      };

      const venta = await createSaleService(payload, token);
      const sale = venta.sale;

      // 1. PDF nota de venta
      const pdfBlob = generarDocumentoVenta(sale);
      const file = new File([pdfBlob], `venta_${sale.code}.pdf`, {
        type: "application/pdf",
      });
      await uploadPDF(file, sale.code);

      // 2. Factura electrónica
      if (data.generateInvoice) {
        const pdfBlobFactura = generarFacturaVenta(sale);
        const fileFactura = new File(
          [pdfBlobFactura],
          `factura_${sale.code}.pdf`,
          { type: "application/pdf" }
        );
        await uploadPDFFactura(fileFactura, sale.code);
      }

      // 3. Flujo de caja para pagos digitales
      if (data.paymentMethod === "Deposito bancario" || data.paymentMethod === "QR") {
        const payloadCashFlow = {
          date: sale.date,
          account: data.paymentMethod === "QR" ? "Banco BCP" : data.bankName,
          type: "income",
          amount: sale.total,
          source: data.paymentMethod,
          items: [
            {
              amount: sale.total,
              payer: `${sale.employee.name} ${sale.employee.lastName}`,
              description: `VENTA: ${sale.code} - PAGO MEDIANTE: ${data.paymentMethod}`,
              source: data.paymentMethod,
            },
          ],
          isUSD: false,
        };

        const cashFlow = await addCashFlow(payloadCashFlow as any);
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

function uploadPDFCotizacion(file: File, code: any) {
  throw new Error("Function not implemented.");
}
