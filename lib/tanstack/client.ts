import { MutationCache, QueryClient } from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";

export const wakatimeQueryQueryKeyPrefixes = {
  currentUser: "wakatime-current-user",
  duration: "wakatime-duration",
  leaderboard: "wakatime-leaderboard",
  stats: "wakatime-stats",
  randomUser: "wakatime-random-user",
  networkStatus: "network-status",
} as const;

export const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
});


type QueryKey = [typeof wakatimeQueryQueryKeyPrefixes[keyof typeof wakatimeQueryQueryKeyPrefixes], ...(readonly unknown[])];

interface MyMeta extends Record<string, unknown> {
  invalidates?: [QueryKey[0], ...(readonly unknown[])][];
  [key: string]: unknown;
}

declare module "@tanstack/react-query" {
  interface Register {
    queryKey: QueryKey;
    mutationKey: QueryKey;
    queryMeta: MyMeta;
    mutationMeta: MyMeta;
  }
}

export const queryClient = new QueryClient({
  mutationCache: new MutationCache({
    onSuccess: async (_, __, ___, mutation) => {
      if (Array.isArray(mutation.meta?.invalidates)) {
        // biome-ignore lint/complexity/noForEach: <explanation>
        mutation.meta?.invalidates.forEach((queryKey) => {
          return queryClient.invalidateQueries({
            queryKey,
          });
        });
      }
    },
  }),
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 60,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
    },
  },
});
