import { NativeModule, requireNativeModule } from 'expo';

import { ExpoGlanceWidgetModuleEvents, SharedPreferencesOptions, SharedPreferencesValue } from './ExpoGlanceWidget.types';

declare class ExpoGlanceWidgetModule extends NativeModule<ExpoGlanceWidgetModuleEvents> {
  PI: number;
  hello(): string;
  setValueAsync(value: string): Promise<void>;
  
  // Shared Preferences methods
  setSharedPreferenceAsync(key: string, value: SharedPreferencesValue, options?: SharedPreferencesOptions): Promise<void>;
  getSharedPreferenceAsync(key: string, options?: SharedPreferencesOptions): Promise<SharedPreferencesValue>;
  removeSharedPreferenceAsync(key: string, options?: SharedPreferencesOptions): Promise<void>;
  clearSharedPreferencesAsync(options?: SharedPreferencesOptions): Promise<void>;
  getAllSharedPreferencesAsync(options?: SharedPreferencesOptions): Promise<Record<string, SharedPreferencesValue>>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<ExpoGlanceWidgetModule>('ExpoGlanceWidget');
