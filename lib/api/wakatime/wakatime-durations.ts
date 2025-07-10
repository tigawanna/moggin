
import { getUserDurations } from "@/lib/api/wakatime/wakatime-sdk";
import { getLastFiveDates } from "@/utils/date";
import { queryOptions, useQueries, useQuery } from "@tanstack/react-query";

interface UseWakatimeDailyDurationProps {
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

  return queryOptions({
    queryKey: ["wakatime-durations", selectedDate, wakatimeApiKey],
    queryFn: async () => {
      if (!wakatimeApiKey) {
        console.warn("No Wakatime API key provided");
        return null;
      }
      // "https://wakatime.com/api/v1/users/current/durations?date=2025-07-03"
      const result = await getUserDurations({ date: selectedDate, api_key: wakatimeApiKey });
      if (!result) return null;

      if (result.data) {
        // Calculate total duration from durations array
        const totalSeconds = result.data.data.reduce((total: number, duration: any) => {
          return total + (duration.duration || 0);
        }, 0);

        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        // console.log("Wakatime daily duration result:", result.data);
        return {
          date: selectedDate,
          todayHours: `${hours}h ${minutes}m`,
          totalDurations: result.data.data.length,
          currentProject: result.data.data[0]?.project || "No project",
        };
      }
      return null;
    },
    enabled: !!wakatimeApiKey,
  });
}

export function useWakatimeDailyDuration({ selectedDate, wakatimeApiKey }: UseWakatimeDailyDurationProps) {
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
