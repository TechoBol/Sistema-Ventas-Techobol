import { useEffect, useState } from "react";
import { useLoginStore } from "../components/store/loginStore";
import { createCashFlow } from "../services/CashFlow.ts";
import { ICashFlow } from "../components/models/CashFlow.ts";
import { socketTesoreria } from "../services/SocketIOConnection.ts";

export const useCashFlow = () => {
  const { token } = useLoginStore();
  const [cashFlow, setCashFlow] = useState<ICashFlow[]>([]);

  const addCashFlow = async (item: ICashFlow) => {
    const res = await createCashFlow(token, item);

    if (res) {
      setCashFlow((prev) => [...prev, res]);
    }
    return res
  };

  useEffect(() => {
    socketTesoreria.on("cashFlow", (incoming: ICashFlow) => {
      setCashFlow((prev) => {
        const exists = prev.some((p) => p.id === incoming.id);

        if (exists) {
          return prev.map((p) =>
            p.id === incoming.id ? incoming : p
          );
        } else {
          return [...prev, incoming];
        }
      });
    });

    return () => {
      socketTesoreria.off("cashFlow");
    };
  }, []);

  return {
    cashFlow,
    addCashFlow,
  };
};