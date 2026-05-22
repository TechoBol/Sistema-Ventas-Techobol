import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLoginStore } from "../components/store/loginStore";
import { getDashboardSummaryService } from "../services/dashboardService";
import { socket } from "../services/SocketIOConnection";

export const useDashboard = () => {
  const { token } = useLoginStore();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => getDashboardSummaryService(token),
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    const handleVenta = () => {
      void queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    };

    socket.on("cartProduct", handleVenta);
    return () => socket.off("cartProduct", handleVenta);
  }, [queryClient]);

  return {
    data,
    isLoading,
    refresh: () => queryClient.invalidateQueries({ queryKey: ["dashboard"] }),
  };
};