import { NativeModule, requireNativeModule } from "expo";
import { DatastoreData, ExpoGlanceWidgetModuleEvents } from "./ExpoGlanceWidgetModule.types";

declare class ExpoGlanceWidgetModule extends NativeModule<ExpoGlanceWidgetModuleEvents> {
  // Generic DataStore operations
  getDatastoreValue(key: string): Promise<string | null>;
  updateDatastoreValue(key: string, value: string): Promise<void>;
  deleteDatastoreValue(key: string): Promise<void>;
  
  // Get all keys and values (useful for debugging)
  getAllDatastoreData(): Promise<DatastoreData>;
}

export default requireNativeModule<ExpoGlanceWidgetModule>("ExpoGlanceWidgetModule");
