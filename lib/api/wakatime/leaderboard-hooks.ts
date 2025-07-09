import { wakatimeSDK$ } from "@/lib/api/wakatime/wakatime-sdk";
import { queryOptions } from "@tanstack/react-query";

interface WakatimeLeaderboardQueryOptions {
  wakatimeApiKey: string | null;
  country?: string;
  page?: number;
}

export function wakatimeLeaderboardQueryOptions({
  wakatimeApiKey,
  country,
  page = 1,
}: WakatimeLeaderboardQueryOptions) {
  const sdk = wakatimeSDK$.get();
  return queryOptions({
    queryKey: ["wakatime-leaderboard", wakatimeApiKey, country, page],
    queryFn: async () => {
      if (!sdk) return null;
      
      const params: { country?: string; page?: number } = { page };
      if (country) {
        params.country = country;
      }
      
      const result = await sdk?.getLeaderboard?.(params);
      return result?.data || null;
    },
    enabled: !!sdk && !!wakatimeApiKey,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
  });
}

export function useWakatimeLeaderboard({
  wakatimeApiKey,
  country,
  page = 1,
}: WakatimeLeaderboardQueryOptions) {
  const queryOpts = wakatimeLeaderboardQueryOptions({
    wakatimeApiKey,
    country,
    page,
  });
  
  return queryOpts;
}
