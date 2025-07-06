import { NativeModule, requireNativeModule } from "expo";
import { ExpoGlanceWidgetModuleEvents } from "./ExpoGlanceWidgetModule.types";

declare class ExpoGlanceWidgetModule extends NativeModule<ExpoGlanceWidgetModuleEvents> {
  getDatastoreValue(key: string): Promise<string | null>;
  updateDatastoreValue(key: string, value: string): Promise<void>;
  deleteDatastoreValue(key: string): Promise<void>;
}

export default requireNativeModule<ExpoGlanceWidgetModule>("ExpoGlanceWidgetModule");
