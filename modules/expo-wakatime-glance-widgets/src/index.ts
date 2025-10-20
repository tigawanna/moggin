import type { UpdateWidgetPayload } from './ExpoWakatimeGlanceWidgets.types';
import ExpoWakatimeGlanceWidgetsModule from './ExpoWakatimeGlanceWidgetsModule';

export async function updateWakatimeDailyDurationWidget(payload: UpdateWidgetPayload): Promise<void> {
  return ExpoWakatimeGlanceWidgetsModule.updateWakatimeDailyDurationWidget(payload);
}

export async function updateApiKey(apiKey: string): Promise<void> {
  return ExpoWakatimeGlanceWidgetsModule.updateApiKey(apiKey);
}

export async function removeApiKey(): Promise<void> {
  return ExpoWakatimeGlanceWidgetsModule.removeApiKey();
}

export type { UpdateWidgetPayload } from './ExpoWakatimeGlanceWidgets.types';
export { ExpoWakatimeGlanceWidgetsModule };

