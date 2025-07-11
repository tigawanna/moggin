import type { UpdateWidgetPayload } from './ExpoWakatimeGlanceWidgets.types';
import ExpoWakatimeGlanceWidgetsModule from './ExpoWakatimeGlanceWidgetsModule';

export async function updateWakatimeWidget(payload: UpdateWidgetPayload): Promise<void> {
  return ExpoWakatimeGlanceWidgetsModule.updateWakatimeWidget(payload);
}

export type { UpdateWidgetPayload } from './ExpoWakatimeGlanceWidgets.types';
export { ExpoWakatimeGlanceWidgetsModule };

