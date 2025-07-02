import { registerWebModule, NativeModule } from 'expo';

import { ChangeEventPayload } from './ExpoSampleModule.types';

type ExpoSampleModuleEvents = {
  onChange: (params: ChangeEventPayload) => void;
}

class ExpoSampleModule extends NativeModule<ExpoSampleModuleEvents> {
  PI = Math.PI;
  async setValueAsync(value: string): Promise<void> {
    this.emit('onChange', { value });
  }
  hello() {
    return 'Hello world! 👋';
  }
};

export default registerWebModule(ExpoSampleModule, 'ExpoSampleModule');
