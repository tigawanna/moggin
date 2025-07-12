import WidgetUpdater from "@/modules/expo-wakatime-glance-widgets";
import { wakatimeUserTimeQueryFetcher } from "../api/wakatime/use-wakatime-durations";
import { settings$ } from "@/stores/use-app-settings";
import { dateToDayHoursMinutesSeconds } from "@/utils/date";

export function updateWakatimeHoursWidget({
  currentProject,
  lastSync,
  totalTime,
}: {
  currentProject: string;
  lastSync: string;
  totalTime: string;
}) {
  WidgetUpdater.updateWakatimeWidget({
    currentProject,
    lastSync,
    totalTime,
  });
}

export async function fetchHoursAndUpdateWakatimeWidget() {
  const date = new Date().toISOString().split("T")[0];
  const wakatimeKey = settings$.wakatimeApiKey.get();
  console.log("Fetching Wakatime data for widget update  ::: ", date, wakatimeKey);
  if (!wakatimeKey) {
    console.warn("No Wakatime API key configured, cannot update widget");
    return;
  }
  const res = await wakatimeUserTimeQueryFetcher({
    selectedDate: date,
    wakatimeApiKey: wakatimeKey,
  });
  if (res.type === "success") {
    const lastSync = dateToDayHoursMinutesSeconds(new Date());
    const { currentProject, todayHours } = res;
    updateWakatimeHoursWidget({
      currentProject,
      lastSync,
      totalTime: todayHours,
    });
    return {
      currentProject,
      lastSync,
      totalTime: todayHours,
    };  }
}
