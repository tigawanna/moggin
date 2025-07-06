import { NativeModule, requireNativeModule } from "expo";
import { ExpoGlanceWidgetModuleEvents } from "./ExpoGlanceWidgetModule.types";

declare class ExpoGlanceWidgetModule extends NativeModule<ExpoGlanceWidgetModuleEvents> {
  // Generic DataStore operations
  getDatastoreValue(key: string): Promise<string | null>;
  updateDatastoreValue(key: string, value: string): Promise<void>;
  deleteDatastoreValue(key: string): Promise<void>;
  
  // Optional: Get all keys and values (useful for debugging)
  getAllDatastoreKeys(): Promise<string[]>;
  getAllDatastoreValues(): Promise<Record<string, string>>;
}

export default requireNativeModule<ExpoGlanceWidgetModule>("ExpoGlanceWidgetModule");
