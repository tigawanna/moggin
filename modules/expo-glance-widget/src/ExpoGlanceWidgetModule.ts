import { NativeModule, requireNativeModule } from "expo";
import { ExpoGlanceWidgetModuleEvents, WidgetCreationResult } from "./ExpoGlanceWidgetModule.types";

declare class ExpoGlanceWidgetModule extends NativeModule<ExpoGlanceWidgetModuleEvents> {
  createWidget(): Promise<WidgetCreationResult>;
  PI: number;
  hello(): string;
  setValueAsync(value: string): Promise<void>;

  // Add this:
  updateWakatimeHours(hours: string): Promise<void>;
}

export default requireNativeModule<ExpoGlanceWidgetModule>("ExpoGlanceWidgetModule");
