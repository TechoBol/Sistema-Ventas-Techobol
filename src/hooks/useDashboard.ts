import { useEffect, useState } from "react";
import { useLoginStore } from "../components/store/loginStore";
import { getDashboardSummaryService } from "../services/dashboardService";
import { socket } from "../services/SocketIOConnection";

export const useDashboard = () => {
  const { token } = useLoginStore();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const getDashboard = async () => {
    setIsLoading(true);
    const res = await getDashboardSummaryService(token);
    setData(res);
    setIsLoading(false);
  };

  useEffect(() => {
    getDashboard();
  }, []);

  useEffect(() => {
    socket.on("cartProduct", getDashboard);
    return () => {
      socket.off("cartProduct", getDashboard);
    };
  }, []);

  return {
    data,
    isLoading,
    refresh: getDashboard,
  };
};