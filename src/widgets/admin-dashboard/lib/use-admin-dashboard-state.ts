import { useQuery } from "@tanstack/react-query";
import { gameQueries } from "@/entities/game";

export function useAdminDashboardState() {
  const { data: overview, isLoading, error, refetch } = useQuery(gameQueries.overview());

  return {
    overview,
    isLoading,
    error,
    refetch,
  };
}
