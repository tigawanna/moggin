import WidgetUpdater from "@/modules/expo-wakatime-glance-widgets";
export function updateWakatimeKey(key?: string | null) {
  if (key) {
    WidgetUpdater.updateApiKey(key);
    // console.warn("⚠️⚠️⚠️ Implenent updateWakatimeKey fisrt ⚠️⚠️⚠️");
  } else {
    WidgetUpdater.removeApiKey();
    // console.warn("⚠️⚠️⚠️ Implenent updateWakatimeKey fisrt ⚠️⚠️⚠️");
  }
  return key;
}
