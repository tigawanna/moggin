import DatastoreModel from "@/modules/expo-glance-widget"


export const datastoreKeys = {
    wakatimeApiKey: "wakatime_api_key",
    wakatimeTotalTime: "wakatime_total_time",
    wakatimeCurrentProject: "wakatime_current_project",
    wakatimeLastSync: "wakatime_last_sync",
} as const
export function updateWakatimeWidgetKey(key: string | null) {
  if(!key) {
    return DatastoreModel.deleteDatastoreValue(datastoreKeys.wakatimeApiKey);
  }
  return DatastoreModel.updateDatastoreValue(datastoreKeys.wakatimeApiKey, key);
}


export function getWakatimeWidgetKey() {
  return DatastoreModel.getDatastoreValue(datastoreKeys.wakatimeApiKey);
}

export function getAllDatastoreData() {
  return DatastoreModel.getAllDatastoreData();
}
