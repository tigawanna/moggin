import { useApiKeysStore } from "@/stores/use-app-settings";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { WakatimeSDK } from "./wakatime-sdk";

export const wakatimeCurrentUserQueryOptions = (wakatimeApiKey: string | null) =>
  queryOptions({
    queryKey: ["wakatime-current-user", wakatimeApiKey],
    queryFn: async () => {
      if (!wakatimeApiKey) {
        throw new Error("No API key provided");
      }
      return await new WakatimeSDK(wakatimeApiKey).getCurrentUser();
    },
    enabled: !!wakatimeApiKey,
    staleTime: 1000 * 60 * 30, // 30 minutes
    gcTime: 1000 * 60 * 60, // 1 hour
  });


