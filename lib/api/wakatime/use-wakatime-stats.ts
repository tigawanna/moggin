import { useApiKeysStore } from "@/stores/app-settings-store";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { getUserStats } from "./wakatime-sdk";

export type WakatimeDetailStats = {
  todayStats: {
    total_seconds: number;
    human_readable_total: string;
    projects: { name: string; total_seconds: number; percent: number }[];
    languages: { name: string; total_seconds: number; percent: number }[];
    editors: { name: string; total_seconds: number; percent: number }[];
    operating_systems: { name: string; total_seconds: number; percent: number }[];
  } | null;
  weekStats: {
    human_readable_total: string;
    daily_average: string;
  } | null;
};

export const wakatimeStatsQueryOptions = (wakatimeApiKey: string | null) =>
  queryOptions({
    queryKey: ["wakatime-stats", wakatimeApiKey],
    queryFn: async () => {
      if (!wakatimeApiKey) {
        throw new Error("No API key provided");
      }

      const today = new Date().toISOString().split('T')[0];
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      const [todayResponse, weekResponse] = await Promise.all([
        getUserStats({ start: today, end: today, api_key: wakatimeApiKey }),
        getUserStats({ start: weekAgo, end: today, api_key: wakatimeApiKey })
      ]);

      return {
        todayStats: todayResponse.data,
        weekStats: weekResponse.data
      } as WakatimeDetailStats;
    },
    enabled: !!wakatimeApiKey,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    retry: 2,
    placeholderData: (previousData) => previousData,
  });

export function useWakatimeStats() {
  const { wakatimeApiKey } = useApiKeysStore();
  
  return useQuery(wakatimeStatsQueryOptions(wakatimeApiKey));
}

// Utility function for formatting duration
export const formatDuration = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
};
