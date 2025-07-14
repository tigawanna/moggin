
import { queryOptions, useQuery } from "@tanstack/react-query";
import { fetchCurrentUser } from "./wakatime-sdk";
import { wakatimeQueryQueryKeyPrefixes } from "./query-keys";



export const wakatimeCurrentUserQueryOptions = (wakatimeApiKey: string | null) =>
  queryOptions({
    queryKey: [wakatimeQueryQueryKeyPrefixes.currentUser, wakatimeApiKey],
    queryFn: async () => {
      if (!wakatimeApiKey) {
        throw new Error("No API key provided");
      }
      return await fetchCurrentUser(wakatimeApiKey);
    },
    enabled: !!wakatimeApiKey,
    staleTime: 1000 * 60 * 30, // 30 minutes
    gcTime: 1000 * 60 * 60, // 1 hour
    retry: 1, // Only retry once on failure
    // placeholderData: (previousData) => previousData, // Keep previous data during refetch
  });

export function useCurrentUser(apikey: string | null = null) {
  return useQuery(wakatimeCurrentUserQueryOptions(apikey));
}
