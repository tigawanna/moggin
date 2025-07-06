import { NativeModule, requireNativeModule } from 'expo';

import { ExpoMaterialDynamicColorsModuleEvents } from './ExpoMaterialDynamicColors.types';

declare class ExpoMaterialDynamicColorsModule extends NativeModule<ExpoMaterialDynamicColorsModuleEvents> {
  PI: number;
  hello(): string;
  setValueAsync(value: string): Promise<void>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<ExpoMaterialDynamicColorsModule>('ExpoMaterialDynamicColors');
