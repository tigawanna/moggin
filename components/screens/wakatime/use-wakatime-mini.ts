import { useWakatimeSDK, wakatimeSDK$ } from "@/lib/api/wakatime/wakatime-sdk";
import { getLastFiveDates } from "@/utils/date";
import { queryOptions, useQueries, useQuery } from "@tanstack/react-query";

interface UseWakatimeMiniStatsProps {
  selectedDate: string;
  wakatimeApiKey: string | null;
}

interface WakatimeUserTimeQueryOptions {
  selectedDate: string;
  wakatimeApiKey: string | null;
}

export function wakatimeUserTimeQueryoptions({
  selectedDate,
  wakatimeApiKey,
}: WakatimeUserTimeQueryOptions) {
  const sdk = wakatimeSDK$.get();
  return queryOptions({
    queryKey: ["wakatime-durations", selectedDate, wakatimeApiKey],
    queryFn: async () => {
      if (!sdk) return null;
      // "https://wakatime.com/api/v1/users/current/durations?date=2025-07-03"
      const result = await sdk?.getUserDurations?.({ date: selectedDate });
      if (!result) return null;

      if (result.data) {
        // Calculate total duration from durations array
        const totalSeconds = result.data.reduce((total: number, duration: any) => {
          return total + (duration.duration || 0);
        }, 0);

        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);

        return {
          date: selectedDate,
          todayHours: `${hours}h ${minutes}m`,
          totalDurations: result.data.length,
          currentProject: result.data[0]?.project || "No project",
          topLanguage: result.data[0]?.language || "No language",
        };
      }
      return null;
    },
    enabled: !!sdk && !!wakatimeApiKey,
  });
}

export function useWakatimeMiniStats({ selectedDate, wakatimeApiKey }: UseWakatimeMiniStatsProps) {
  const { data, isLoading, refetch } = useQuery(
    wakatimeUserTimeQueryoptions({
      selectedDate,
      wakatimeApiKey,
    })
  );
  return {
    data,
    isLoading,
    refetch,
    selectedDate,
  };
}

interface UseWakatimeWeeklyStatsProps {
  wakatimeApiKey: string | null;
  selectedDate: string; 
}
export function useWakatimeWeeklyStats({ wakatimeApiKey, selectedDate }: UseWakatimeWeeklyStatsProps) {
  const lastFiveDates = getLastFiveDates(new Date(selectedDate));

  const queries = useQueries({
    queries: lastFiveDates.map((date) =>
      wakatimeUserTimeQueryoptions({
        selectedDate: date,
        wakatimeApiKey,
      })
    ),
    combine(result) {
      return result.toReversed().reduce((acc, curr) => {
        if (curr) {
          acc.push(curr);
        }
        return acc;
      }, [] as typeof result[0][]);
    },

  });
  // // console.log("Wakatime weekly queries:", queries);
  // const data = queries.map((query) => {
  //   console.log("✅ Wakatime weekly query data:", query.data);
  //   return query.data;
  // }).filter(Boolean);
  // console.log("Wakatime weekly queries:", queries);
  return {
    data: queries,
  };
}
