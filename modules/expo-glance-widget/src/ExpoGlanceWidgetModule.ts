import { NativeModule, requireNativeModule } from "expo";

import { ExpoGlanceWidgetModuleEvents } from "./ExpoGlanceWidgetModule.types";

declare class ExpoGlanceWidgetModule extends NativeModule<ExpoGlanceWidgetModuleEvents> {
  PI: number;
  hello(): string;
  setValueAsync(value: string): Promise<void>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<ExpoGlanceWidgetModule>("ExpoGlanceWidgetModule");
