
import { getUserDurations } from "@/lib/api/wakatime/wakatime-sdk";
import { getLastFiveDates } from "@/utils/date";
import { queryOptions, useQueries, useQuery } from "@tanstack/react-query";
import { UserDailyDurationsData } from "./types/current-user-types";

interface UseWakatimeDailyDurationProps {
  selectedDate: string;
  wakatimeApiKey: string | null;
}

interface WakatimeUserTimeQueryOptions {
  selectedDate: string;
  wakatimeApiKey: string | null;
}


export async function wakatimeUserTimeQueryFetcher({
  selectedDate,
  wakatimeApiKey,
}: WakatimeUserTimeQueryOptions){
  if (!wakatimeApiKey) {
    console.log("No Wakatime API key provided");
    return {
      type: "unauthorized",
      message: "Unauthorized access. Please check your API key.",
    } as const;
  }
  // "https://wakatime.com/api/v1/users/current/durations?date=2025-07-11&slice_by=language"
  const result = await getUserDurations({ date: selectedDate, api_key: wakatimeApiKey });
  if (result.type === "error" && !result.data) {
    return {
      type: "no_data",
      date: selectedDate,
      todayHours: "0h 0m",
      totalDurations: 0,
      currentProject: "No project",
    } as const;
  }
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

  // Calculate total duration from durations array
  const totalSeconds = result.data.data.reduce((total: number, duration: any) => {
    return total + (duration.duration || 0);
  }, 0);

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  // console.log("Wakatime daily duration result:", result.data);
  const groupedProjects = result.data.data.reduce(
    (acc: UserDailyDurationsData[], curr: UserDailyDurationsData) => {
      if (!acc.some((item) => item.project === curr.project)) {
        acc.push({
          project: curr.project,
          duration: curr.duration,
          color: curr.color,
          time: curr.time,
        });
      } else {
        const existingProject = acc.find((item) => item.project === curr.project);
        if (existingProject) {
          existingProject.duration += curr.duration;
        }
      }
      return acc;
    },
    []
  );
  return {
    type: "success",
    date: selectedDate,
    todayHours: `${hours}h ${minutes}m`,
    totalDurations: result.data.data.length,
    currentProject: result.data.data[0]?.project || "No project",
    groupedProjects,
    allProjects: result.data.data,
  } as const;
}


export function wakatimeUserTimeQueryoptions({
  selectedDate,
  wakatimeApiKey,
}: WakatimeUserTimeQueryOptions) {

  return queryOptions({
    queryKey: ["wakatime-durations", selectedDate, wakatimeApiKey],
    queryFn: async () =>
      wakatimeUserTimeQueryFetcher({
        selectedDate,
        wakatimeApiKey,
      }),
    enabled: !!wakatimeApiKey,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
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
  });

  // Check for error states across all queries
  const hasUnauthorized = queries.some(query => 
    query.data?.type === "unauthorized"
  );
  
  const hasRateLimit = queries.some(query => 
    query.data?.type === "rate_limit_exceeded"
  );

  const isLoading = queries.some(query => query.isLoading);

  // If any query has authorization issues, return that error state
  if (hasUnauthorized) {
    return {
      data: null,
      type: "unauthorized" as const,
      isLoading: false,
      message: "Unauthorized access. Please check your API key.",
    };
  }

  if (hasRateLimit) {
    return {
      data: null,
      type: "rate_limit_exceeded" as const,
      isLoading: false,
      message: "Rate limit exceeded. Please try again later.",
    };
  }

  // Filter out error/loading states and return successful data
  const successfulData = queries
    .map(query => query.data)
    .filter(data => data && data.type === "success")
    .reverse(); // Reverse to get chronological order

  // If no successful data but not loading, return no_data
  if (!isLoading && successfulData.length === 0) {
    return {
      data: null,
      type: "no_data" as const,
      isLoading: false,
      message: "No data available for the selected period.",
    };
  }

  type TrueReturnType = Extract<NonNullable<typeof successfulData>[number], { type: "success" }>;

  return {
    data: successfulData as TrueReturnType[],
    type: "success" as const,
    isLoading,
    message: null,
  };
}


export type UseWakatimeWeeklyStatsReturnType = ReturnType<typeof useWakatimeWeeklyStats>;
type WakatimeWeeklyStatsData = UseWakatimeWeeklyStatsReturnType["data"];
type WakatimeWeeklyStatsSuccess = NonNullable<WakatimeWeeklyStatsData>[number];
export type WakatimeWeeklyStats = Extract<WakatimeWeeklyStatsSuccess, { type: "success" }>;
