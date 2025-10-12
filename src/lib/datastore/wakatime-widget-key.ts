import WidgetUpdater from "@/modules/expo-wakatime-glance-widgets";
export function updateWakatimeKey(key?: string | null) {
  if (key) {
    WidgetUpdater.updateApiKey(key);
  } else {
    WidgetUpdater.removeApiKey();
  }
  return key;
}
