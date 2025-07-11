import { NativeModule, requireNativeModule } from 'expo';

import { ExpoWakatimeGlanceWidgetsModuleEvents, UpdateWidgetPayload } from './ExpoWakatimeGlanceWidgets.types';

declare class ExpoWakatimeGlanceWidgetsModule extends NativeModule<ExpoWakatimeGlanceWidgetsModuleEvents> {
  updateWakatimeWidget: (payload: UpdateWidgetPayload) => Promise<void>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<ExpoWakatimeGlanceWidgetsModule>('ExpoWakatimeGlanceWidgets');
