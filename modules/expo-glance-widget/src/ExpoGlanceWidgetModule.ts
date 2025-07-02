import { NativeModule, requireNativeModule } from "expo";
import { ExpoGlanceWidgetModuleEvents, WidgetCreationResult } from "./ExpoGlanceWidgetModule.types";

declare class ExpoGlanceWidgetModule extends NativeModule<ExpoGlanceWidgetModuleEvents> {
  createWidget(): Promise<WidgetCreationResult>;
  updateWakatimeHours(hours: string): Promise<void>;
  updateWakatimeWidget(data: string): Promise<void>;
}

export default requireNativeModule<ExpoGlanceWidgetModule>("ExpoGlanceWidgetModule");
