// import DatastoreModel from "@/modules/expo-glance-widget"

// TODO - Implement the actual datastore model logic
class DatastoreModel {
  static getDatastoreValue = (key: string) => {
    // Returning dummy data for now to be implemented
    return Promise.resolve("dummy_data");
  }
  static updateDatastoreValue = (key: string, value: string) => {
    // Returning dummy data for now to be implemented
    return Promise.resolve();
  }
  static deleteDatastoreValue = (key: string) => {
    return Promise.resolve();
  }
  static getAllDatastoreData = () => {
    return Promise.resolve({
      wakatimeApiKey: "dummy_api_key",
      wakatimeTotalTime: "dummy_total_time",
      wakatimeCurrentProject: "dummy_current_project",
      wakatimeLastSync: "dummy_last_sync",
    });
  }
}
 
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
