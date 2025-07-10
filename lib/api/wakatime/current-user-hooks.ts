import { useApiKeysStore, useSettingsStore } from "@/stores/use-app-settings";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { fetchCurrentUser } from "./wakatime-sdk";



export const wakatimeCurrentUserQueryOptions = (wakatimeApiKey: string | null) =>
  queryOptions({
    queryKey: ["wakatime-current-user", wakatimeApiKey],
    queryFn: async () => {
      if (!wakatimeApiKey) {
        throw new Error("No API key provided");
      }
      return await fetchCurrentUser(wakatimeApiKey);
    },
    enabled: !!wakatimeApiKey,
    staleTime: 1000 * 60 * 30, // 30 minutes
    gcTime: 1000 * 60 * 60, // 1 hour
    // refetchOnWindowFocus: false, // Prevent refetch on focus
    // refetchOnReconnect: false, // Prevent refetch on reconnect
    retry: 1, // Only retry once on failure
    // placeholderData: (previousData) => previousData, // Keep previous data during refetch
  });

export function useCurrentUser(apikey: string | null = null) {
  return useQuery(wakatimeCurrentUserQueryOptions(apikey));
}
