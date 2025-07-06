import { useWakatimeSDK } from "@/lib/api/wakatime/wakatime-sdk";
import { useQuery } from "@tanstack/react-query";

interface UseWakatimeMiniStatsProps {
  selectedDate: string;
  wakatimeApiKey: string | null;
}

export function useWakatimeMiniStats({ selectedDate, wakatimeApiKey }: UseWakatimeMiniStatsProps) {
  const sdk = useWakatimeSDK();
  // Wakatime query using the correct durations endpoint
  const { data, isLoading, refetch } = useQuery({
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
          todayHours: `${hours}h ${minutes}m`,
          totalDurations: result.data.length,
          currentProject: result.data[0]?.project || "No project",
          topLanguage: result.data[0]?.language || "No language",
        };
      }
      return null;
    },
    enabled: !!sdk,
  });
  return {
    data,
    isLoading,
    refetch,
    selectedDate,
  };
}
