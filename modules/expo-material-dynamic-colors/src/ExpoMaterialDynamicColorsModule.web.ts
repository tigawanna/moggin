import { registerWebModule, NativeModule } from 'expo';

import { ChangeEventPayload } from './ExpoMaterialDynamicColors.types';

type ExpoMaterialDynamicColorsModuleEvents = {
  onChange: (params: ChangeEventPayload) => void;
}

class ExpoMaterialDynamicColorsModule extends NativeModule<ExpoMaterialDynamicColorsModuleEvents> {
  PI = Math.PI;
  async setValueAsync(value: string): Promise<void> {
    this.emit('onChange', { value });
  }
  hello() {
    return 'Hello world! 👋';
  }
};

export default registerWebModule(ExpoMaterialDynamicColorsModule, 'ExpoMaterialDynamicColorsModule');
