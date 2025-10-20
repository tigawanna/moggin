import { NativeModule, requireNativeModule } from 'expo';

import { ExpoComposeModuleEvents } from './ExpoCompose.types';

declare class ExpoComposeModule extends NativeModule<ExpoComposeModuleEvents> {
  PI: number;
  hello(): string;
  setValueAsync(value: string): Promise<void>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<ExpoComposeModule>('ExpoCompose');
