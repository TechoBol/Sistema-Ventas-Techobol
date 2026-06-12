import { useEffect, useState } from "react";
import { useLoginStore } from "../components/store/loginStore";
import { successToast, errorToast } from "../services/toasts";
import {
  getImportationsService,
  getImportationByIdService,
  createImportationService,
  updateImportationService,
  verifyImportationService,
} from "../services/importationService";
import { generarImportationPDF } from "../components/pdf/generarImportationPDF";
import { useAmazonS3 } from "./useAmazonS3";

/**
 * Convierte los datos del wizard al formato esperado por el backend
 * Se guardan únicamente los datos ingresados
 * Los resultados calculados se obtienen nuevamente desde importationCalculations.js
 */
const mapWizardPayloadToApi = (payload: any) => {
  const generalData = payload.generalData ?? {};

  const products = Array.isArray(payload.products)
    ? payload.products
    : [];

  const expenses = payload.expenses ?? {};

  const bankPayments = Array.isArray(payload.bankPayments)
    ? payload.bankPayments
    : [];

  const additionalCosts = Array.isArray(payload.additionalCosts)
    ? payload.additionalCosts
    : [];

  /* Evita guardar la fila bancaria inicial si continúa vacía */
  const paymentsToSave = bankPayments
    .filter((payment: any) => {
      const amountUsd = Number(payment.amountUsd || 0);
      const commissionUsd = Number(payment.commissionUsd || 0);
      const itfEntryUsd = Number(payment.itfEntryUsd || 0);
      const hasDate = Boolean(payment.date);
      return (
        amountUsd > 0 ||
        commissionUsd > 0 ||
        itfEntryUsd > 0 ||
        hasDate
      );
    })
    .map((payment: any) => ({
      paymentType: payment.paymentType || "PAYMENT",
      date: payment.date || null,
      bankName: payment.bankName?.trim() || "",
      amountUsd: Number(payment.amountUsd || 0),
      bankExchangeRate: Number(payment.bankExchangeRate || 0),
      commissionUsd: Number(payment.commissionUsd || 0),
      itfEntryUsd: Number(payment.itfEntryUsd || 0),
    }));

  /*
   * Los gastos bancarios se reconstruyen desde bankPayments, no desde additionalCosts */
  const manualAdditionalCosts = additionalCosts
    .filter((cost: any) => cost?.source !== "BANK")
    .map((cost: any) => ({
      concept: cost.concept?.trim() || "",
      amount: Number(cost.amount || 0),
      currency: cost.currency || "BS",
      hasFiscalCredit: Boolean(cost.hasFiscalCredit),
      fiscalCreditPercent: cost.hasFiscalCredit
        ? Number(cost.creditRate || 0)
        : 0,
      source: cost.source || "MANUAL",
    }));

  return {
    supplierName: generalData.supplier?.trim() || null,
    referenceNumber: generalData.reference?.trim() || null,
    importationDate: generalData.date || null,
    officialExchangeRate: Number(generalData.officialExchangeRate || 6.96),
    bankExchangeRate: generalData.bankExchangeRate
      ? Number(generalData.bankExchangeRate)
      : null,
    ivaPercent: 14.94,
    productCount: products.length,

    status:
      payload.status === "verificado"
        ? "VERIFIED"
        : "DRAFT",

    snapshot: {
      products: products.map((product: any) => ({
        productId: product.productId ?? null,
        productCode: product.productCode?.trim() || "",
        productName: product.productName?.trim() || "",
        referenceQuantity: Number(product.referenceQuantity || 0),
        baseQuantity: Number(product.baseQuantity || 0),
        priceUsd: Number(product.priceUsd || 0),
        gaPercent: Number(product.gaPercent || 0),
      })),

      baseExpenses: {
        freights: (expenses.freights ?? []).map((item: any) => ({
          name: item.name?.trim() || "",
          amountUsd: Number(item.amount || 0),
        })),

        insurances: (expenses.insurances ?? []).map((item: any) => ({
          name: item.name?.trim() || "",
          amountUsd: Number(item.amount || 0),
        })),

        portCosts: (expenses.portCosts ?? []).map((item: any) => ({
          name: item.name?.trim() || "",
          amountUsd: Number(item.amount || 0),
        })),

        otherCosts: (expenses.otherCosts ?? []).map((item: any) => ({
          name: item.name?.trim() || "",
          amountUsd: Number(item.amount || 0),
        })),
      },

      bankPayments: { payments: paymentsToSave },
      additionalCosts: manualAdditionalCosts,
      notes: payload.notes?.trim() || "",
    },
  };
};

/* guardar el pdf con el nombre: numero de factura sino id */
const getImportationPdfCode = (importation: any) => {
  return `IMPORTACION-${importation?.referenceNumber || importation?.id}`;
};

export const useImportations = () => {
  const { token } = useLoginStore();
  const { uploadPDFImport } = useAmazonS3();

  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const getImportations = async () => {
    if (!token) return;

    setIsLoading(true);

    try {
      const response = await getImportationsService(token);
      setData(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error(
        "Error al cargar las importaciones:",
        error
      );
      errorToast("Error al cargar las importaciones");
    } finally {
      setIsLoading(false);
    }
  };

  const getImportationById = async (id: number) => {
    if (!token || !id) return null;
    try {
      return await getImportationByIdService(id, token);
    } catch (error) {
      console.error(
        "Error al cargar la importación:",
        error
      );
      errorToast("Error al cargar la importación");
      return null;
    }
  };

  /* Genera y sube el PDF usando la factura/id. Si ya existe un PDF con la misma clave, S3 lo reemplaza */
  const generateAndUploadImportationPdf = async (importation: any) => {
    const pdfCode = getImportationPdfCode(importation);
    const pdfBlob = generarImportationPDF(importation);
    const pdfFile = new File(
      [pdfBlob],
      `${pdfCode}.pdf`,
      { type: "application/pdf" }
    );
    return uploadPDFImport(pdfFile, pdfCode);
  };

  const createImportation = async (payload: any) => {
    if (!token) {
      errorToast("No se encontró una sesión activa");
      return null;
    }

    setIsLoading(true);

    try {
      const dataToSave = mapWizardPayloadToApi(payload);

      const createdImportation =
        await createImportationService(
          dataToSave,
          token
        );

      const completeImportation = {
        ...dataToSave,
        ...createdImportation,
        snapshot:
          createdImportation?.snapshot ??
          dataToSave.snapshot,
      };

      try {
        await generateAndUploadImportationPdf(completeImportation);
      } catch (pdfError) {
        console.error(
          "La importación se creó, pero falló la generación o subida del PDF:",
          pdfError
        );
        errorToast(
          "La importación fue guardada, pero no se pudo guardar su PDF"
        );
      }

      successToast(
        payload.status === "verificado"
          ? "Importación guardada como verificada"
          : "Importación guardada como borrador"
      );

      await getImportations();

      return completeImportation;
    } catch (error) {
      console.error(
        "Error al crear la importación:",
        error
      );

      errorToast("No se pudo guardar la importación");

      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateImportation = async (id: number, payload: any) => {
    if (!token || !id) {
      errorToast(
        "No se pudo identificar la importación"
      );
      return null;
    }

    setIsLoading(true);

    try {
      const dataToSave = mapWizardPayloadToApi(payload);
      const updatedImportation =
        await updateImportationService(
          id,
          dataToSave,
          token
        );

      /* El mismo ID genera la misma clave en S3. Al editar, el nuevo PDF reemplaza al anterior */
      const completeImportation = {
        ...dataToSave,
        ...updatedImportation,
        id,
        snapshot:
          updatedImportation?.snapshot ??
          dataToSave.snapshot,
      };

      try {
        await generateAndUploadImportationPdf(completeImportation);
      } catch (pdfError) {
        console.error(
          "La importación se actualizó, pero falló la actualización del PDF:",
          pdfError
        );
        errorToast("La importación fue actualizada, pero no se pudo actualizar su PDF");
      }

      successToast(
        payload.status === "verificado"
          ? "Importación actualizada y verificada"
          : "Borrador actualizado correctamente"
      );

      await getImportations();

      return completeImportation;
    } catch (error) {
      console.error(
        "Error al actualizar la importación:",
        error
      );
      errorToast("No se pudo actualizar la importación");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyImportation = async (id: number) => {
    if (!token || !id) {
      errorToast("No se pudo identificar la importación");
      return null;
    }

    setIsLoading(true);

    try {
      const verifiedImportation =
        await verifyImportationService(id, token);

      if (verifiedImportation?.snapshot) {
        try {
          await generateAndUploadImportationPdf(verifiedImportation);
        } catch (pdfError) {
          console.error(
            "La importación fue verificada, pero no se pudo actualizar el PDF:",
            pdfError
          );
          errorToast(
            "La importación fue verificada, pero no se pudo actualizar su PDF"
          );
        }
      }

      successToast("Importación verificada correctamente");
      await getImportations();
      return verifiedImportation;
    } catch (error) {
      console.error(
        "Error al verificar la importación:",
        error
      );
      errorToast(
        "No se pudo verificar la importación"
      );
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return;
    getImportations();
  }, [token]);

  return {
    data,
    isLoading,
    getImportations,
    getImportationById,
    createImportation,
    updateImportation,
    verifyImportation,
  };
};
