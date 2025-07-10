import { useApiKeysStore } from "@/stores/use-app-settings";
import { queryOptions, useQuery } from "@tanstack/react-query";

// Simple fetch function to avoid circular dependency with WakatimeSDK
async function fetchCurrentUser(apiKey: string) {
  const url = new URL("https://wakatime.com/api/v1/users/current");
  url.searchParams.append("api_key", apiKey);
  
  const response = await fetch(url.toString());
  if (!response.ok) {
    return {
      data: null,
      type: "error",
      error: `Error: ${response.status} ${response.statusText}`,
    };
  }
  
  const dataRes = await response.json();
  return {
    data: dataRes,
    type: "success",
    error: null,
  };
}

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
  });

export function useCurrentUser() {
  const { wakatimeApiKey } = useApiKeysStore();
  
  return useQuery(wakatimeCurrentUserQueryOptions(wakatimeApiKey));
}
