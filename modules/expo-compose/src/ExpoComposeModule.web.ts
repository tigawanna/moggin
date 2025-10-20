import { registerWebModule, NativeModule } from 'expo';

import { ChangeEventPayload } from './ExpoCompose.types';

type ExpoComposeModuleEvents = {
  onChange: (params: ChangeEventPayload) => void;
}

class ExpoComposeModule extends NativeModule<ExpoComposeModuleEvents> {
  PI = Math.PI;
  async setValueAsync(value: string): Promise<void> {
    this.emit('onChange', { value });
  }
  hello() {
    return 'Hello world! 👋';
  }
};

export default registerWebModule(ExpoComposeModule, 'ExpoComposeModule');
