import { useApiKeysStore } from "@/stores/use-app-settings";
import { getWakatimeCurrrentUser } from "@/utils/api/wakatime";
import { queryOptions, useQuery } from "@tanstack/react-query";

export const wakatimeCurrentUserQueryOptions = (wakatimeApiKey: string | null) =>
  queryOptions({
    queryKey: ["wakatime-current-user", wakatimeApiKey],
    queryFn: async () => {
      if (!wakatimeApiKey) {
        throw new Error("No API key provided");
      }
      return await getWakatimeCurrrentUser({ token: wakatimeApiKey });
    },
    enabled: !!wakatimeApiKey,
    staleTime: 1000 * 60 * 30, // 30 minutes
    gcTime: 1000 * 60 * 60, // 1 hour
  });

export function useCurrentUser() {
  const { wakatimeApiKey } = useApiKeysStore();
  
  return useQuery(wakatimeCurrentUserQueryOptions(wakatimeApiKey));
}

