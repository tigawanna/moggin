import { queryOptions } from "@tanstack/react-query";
import { getLeaderboard } from "./wakatime-sdk";

interface WakatimeLeaderboardQueryOptions {
  wakatimeApiKey: string | null;
  country?: string;
  page?: number;
}

export async function fetchLeaderboard({
  wakatimeApiKey,
  country,
  page = 1,
}: WakatimeLeaderboardQueryOptions) {
  if (!wakatimeApiKey) {
    console.warn("No Wakatime API key provided");
    return null;
  }

  const params: { country_code?: string; page?: number } = { };
  if (country) {
    params.country_code = country;
  }
  if (page) {
    params.page = page;
  }
  const result = await getLeaderboard({ api_key: wakatimeApiKey, ...params });
  return result?.data || null;
}

export function wakatimeLeaderboardQueryOptions({
  wakatimeApiKey,
  country,
  page = 1,
}: WakatimeLeaderboardQueryOptions) {

  return queryOptions({
    queryKey: ["wakatime-leaderboard", wakatimeApiKey, country, page],
    queryFn: async () => {
      return await fetchLeaderboard({ wakatimeApiKey, country, page });
    },
    enabled: !!wakatimeApiKey,
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
