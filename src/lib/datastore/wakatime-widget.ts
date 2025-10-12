import { wakatimeUserTimeQueryFetcher } from "@/data-access-layer/wakatime/use-wakatime-durations";
import WidgetUpdater from "@/modules/expo-wakatime-glance-widgets";
import { useSettingsStore } from "@/stores/app-settings-store";
import { dateToDayHoursMinutesSeconds } from "@/utils/date";


export function updateWakatimeHoursWidget({
  currentProject,
  totalTime,
  byWorker,
}: {
  currentProject: string;
  byWorker?: boolean;
  totalTime: string;
}) {
  const lastSync = dateToDayHoursMinutesSeconds(new Date());
  WidgetUpdater.updateWakatimeDailyDurationWidget({
    currentProject,
    // The ⚡ prefix is used to indicate the that the update was triggerd by the background task
    lastSync: byWorker ? `⚡${lastSync}` : lastSync,
    totalTime,
  }).catch((e) => {
    console.log("\n\nFailed to update Wakatime widget", e,"\n\n");
  });
  return {
    currentProject,
    lastSync,
    totalTime,
  };
}

export async function fetchHoursAndUpdateWakatimeWidget() {
  const date = new Date().toISOString().split("T")[0];
  const wakatimeKey = useSettingsStore.getState().wakatimeApiKey;
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
    const { currentProject, todayHours } = res;
    return updateWakatimeHoursWidget({
      currentProject,
      byWorker: true,
      totalTime: todayHours,
    });
  }
}
