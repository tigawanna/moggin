import { queryOptions } from "@tanstack/react-query";
import { getLeaderboard } from "./wakatime-sdk";
import { wakatimeQueryQueryKeyPrefixes } from "./query-keys";

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
    return {
      type: "unauthorized",
      message: "Unauthorized access. Please check your API key.",
    } as const;
  }

  const params: { country_code?: string; page?: number } = { };
  if (country) {
    params.country_code = country;
  }
  if (page) {
    params.page = page;
  }
  
  const result = await getLeaderboard({ api_key: wakatimeApiKey, ...params });
  
  if (result.type === "unauthorized") {
    return {
      type: "unauthorized",
      message: "Unauthorized access. Please check your API key.",
    } as const;
  }
  
  if (result.type === "rate_limit_exceeded") {
    return {
      type: "rate_limit_exceeded",
      message: "Rate limit exceeded. Please try again later.",
    } as const;
  }
  
  if (result.type !== "success" || !result.data) {
    return {
      type: "no_data",
      message: "No leaderboard data available.",
    } as const;
  }

  return {
    type: "success",
    data: result.data,
  } as const;
}

export function wakatimeLeaderboardQueryOptions({
  wakatimeApiKey,
  country,
  page = 1,
}: WakatimeLeaderboardQueryOptions) {

  return queryOptions({
    queryKey: [wakatimeQueryQueryKeyPrefixes.leaderboard, wakatimeApiKey, country, page],
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
