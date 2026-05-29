import { useEffect, useState } from "react";
import { useLoginStore } from "../components/store/loginStore";
import {
    getQuotationsService,
    updateQuotationStatusService,
    convertQuotationService,
} from "../services/quotationsService";

// =====================================================
// TYPES
// =====================================================

export type QuotationStatus = "PENDING" | "APPROVED" | "REJECTED" | "EXPIRED";

export interface Quotation {
    id: number;
    code: string;
    total: number;
    status: QuotationStatus;
    expiresAt: string | null;
    createdAt: string;
    customer: { name: string } | null;
    employee: { name: string; lastName: string } | null;
    location: { name: string } | null;
}

export interface ConvertPaymentData {
    metodoPago: string;
    bankName?: string;
    codigoTransaccion?: string;
    generateInvoice: boolean;
}

// =====================================================
// HOOK
// =====================================================

export const useQuotations = () => {
    const { token } = useLoginStore();
    const [data, setData]       = useState<Quotation[]>([]);
    const [loading, setLoading] = useState(false);

    const getQuotations = async (): Promise<void> => {
        try {
            setLoading(true);
            const res: Quotation[] = await getQuotationsService(token);
            setData(res);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id: number, status: QuotationStatus): Promise<Quotation> => {
        const updated: Quotation = await updateQuotationStatusService(id, status, token);
        setData((prev) => prev.map((q) => (q.id === updated.id ? updated : q)));
        return updated;
    };

    const convertToSale = async (id: number, paymentData: ConvertPaymentData): Promise<unknown> => {
        const result = await convertQuotationService(id, paymentData, token);
        setData((prev) =>
            prev.map((q) => (q.id === id ? { ...q, status: "APPROVED" as QuotationStatus } : q))
        );
        return result;
    };

    useEffect(() => {
        getQuotations();
    }, []);

    return {
        data,
        loading,
        refresh: getQuotations,
        updateStatus,
        convertToSale,
    };
};