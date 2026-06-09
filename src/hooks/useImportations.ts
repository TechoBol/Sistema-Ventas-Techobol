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

const mapWizardPayloadToApi = (payload: any) => {
  const generalData = payload.generalData ?? {};
  const products = payload.products ?? [];
  const expenses = payload.expenses ?? {};
  const additionalCosts = payload.additionalCosts ?? [];

  return {
    supplierName: generalData.supplier || null,
    referenceNumber: generalData.reference || null,
    importationDate: generalData.date || null,
    officialExchangeRate: Number(generalData.officialExchangeRate || 6.96),
    bankExchangeRate: generalData.bankExchangeRate
      ? Number(generalData.bankExchangeRate)
      : null,
    ivaPercent: 14.94,
    productCount: products.length,
    status: payload.status === "verificado" ? "VERIFIED" : "DRAFT",
    snapshot: {
      products: products.map((product: any) => ({
        productId: product.productId ?? null,
        productCode: product.productCode || "",
        productName: product.productName || "",
        referenceQuantity: Number(product.referenceQuantity || 0),
        baseQuantity: Number(product.baseQuantity || 0),
        priceUsd: Number(product.priceUsd || 0),
        gaPercent: Number(product.gaPercent || 0),
      })),
      baseExpenses: {
        freights: (expenses.freights ?? []).map((item: any) => ({
          name: item.name || "",
          amountUsd: Number(item.amount || 0),
        })),
        insurances: (expenses.insurances ?? []).map((item: any) => ({
          name: item.name || "",
          amountUsd: Number(item.amount || 0),
        })),
        portCosts: (expenses.portCosts ?? []).map((item: any) => ({
          name: item.name || "",
          amountUsd: Number(item.amount || 0),
        })),
        otherCosts: (expenses.otherCosts ?? []).map((item: any) => ({
          name: item.name || "",
          amountUsd: Number(item.amount || 0),
        })),
      },
      additionalCosts: additionalCosts.map((cost: any) => ({
        concept: cost.concept || "",
        amount: Number(cost.amount || 0),
        currency: cost.currency || "BS",
        hasFiscalCredit: Boolean(cost.hasFiscalCredit),
        fiscalCreditPercent: cost.hasFiscalCredit
          ? Number(cost.creditRate || 0)
          : 0,
      })),
      bankPayments: {
        enabled: false,
        payments: [],
        exchangeAdjustments: [],
      },
      notes: "",
    },
  };
};

export const useImportations = () => {
  const { token } = useLoginStore();

  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const getImportations = async () => {
    setIsLoading(true);

    try {
      const res = await getImportationsService(token);
      setData(res);
    } catch (error) {
      errorToast("Error al cargar las importaciones");
    } finally {
      setIsLoading(false);
    }
  };

  const getImportationById = async (id: number) => {
    try {
      return await getImportationByIdService(id, token);
    } catch (error) {
      errorToast("Error al cargar la importación");
      return null;
    }
  };

  const createImportation = async (payload: any) => {
    setIsLoading(true);

    try {
      const dataToSave = mapWizardPayloadToApi(payload);
      const newImportation = await createImportationService(dataToSave, token);

      successToast(
        payload.status === "verificado"
          ? "Importación guardada como verificada"
          : "Importación guardada como borrador"
      );

      await getImportations();

      return newImportation;
    } catch (error) {
      errorToast("No se pudo guardar la importación");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateImportation = async (id: number, payload: any) => {
    setIsLoading(true);

    try {
      const dataToSave = mapWizardPayloadToApi(payload);
      const updatedImportation = await updateImportationService(
        id,
        dataToSave,
        token
      );

      successToast("Importación actualizada");

      await getImportations();

      return updatedImportation;
    } catch (error) {
      errorToast("No se pudo actualizar la importación");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyImportation = async (id: number) => {
    setIsLoading(true);

    try {
      const verified = await verifyImportationService(id, token);

      successToast("Importación verificada");

      await getImportations();

      return verified;
    } catch (error) {
      errorToast("No se pudo verificar la importación");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getImportations();
  }, []);

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
