import { NativeModule, requireNativeModule } from 'expo';

import { ExpoSampleModuleEvents } from './ExpoSampleModule.types';

declare class ExpoSampleModule extends NativeModule<ExpoSampleModuleEvents> {
  PI: number;
  hello(): string;
  setValueAsync(value: string): Promise<void>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<ExpoSampleModule>('ExpoSampleModule');
