
import { wakatimeQueryQueryKeyPrefixes } from "@/lib/tanstack/client";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { fetchCurrentUser, getUserDetails } from "./wakatime-sdk";




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
    staleTime: Infinity,
    gcTime: Infinity,
    retry: 1,
    placeholderData: (previousData) => previousData,
  });

export function useCurrentUser(apikey: string | null = null) {
  return useQuery(wakatimeCurrentUserQueryOptions(apikey));
}


export function wakatimeRandomUserQueryOptions({
  wakatimeApiKey,
  username,
}: {
  wakatimeApiKey: string | null;
  username: string;
}) {
  return queryOptions({
    queryKey: [wakatimeQueryQueryKeyPrefixes.randomUser, wakatimeApiKey, username],
    queryFn: async () => {
      if (!wakatimeApiKey) {
        throw new Error("No API key provided");
      }
      return await getUserDetails({ api_key: wakatimeApiKey, username });
    },
    enabled: !!wakatimeApiKey && !!username,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
  });
}

export function useRandomUser({
  wakatimeApiKey,
  username,
}: {
  wakatimeApiKey: string | null;
  username: string;
}) {
  return useQuery(wakatimeRandomUserQueryOptions({ wakatimeApiKey, username }));
}
