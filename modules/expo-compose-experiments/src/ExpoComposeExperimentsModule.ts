import { NativeModule, requireNativeModule } from 'expo';

import { ExpoComposeExperimentsModuleEvents } from './ExpoComposeExperiments.types';

declare class ExpoComposeExperimentsModule extends NativeModule<ExpoComposeExperimentsModuleEvents> {
  PI: number;
  hello(): string;
  setValueAsync(value: string): Promise<void>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<ExpoComposeExperimentsModule>('ExpoComposeExperiments');
