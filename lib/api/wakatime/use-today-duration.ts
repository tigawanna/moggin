import { queryOptions } from "@tanstack/react-query";


interface TodayDurationsQueryOptionsProps{
    apiKey: string | null;
    date?: string;
}
export function todayDurationsQueryOptions({ apiKey, date }: TodayDurationsQueryOptionsProps) {
    return queryOptions({
        queryKey: ['wakatime-today-duration', apiKey, date],
        // getUserDurations;
    })
}

export function useWakatimeTodayDuration(apiKey: string) {

}
