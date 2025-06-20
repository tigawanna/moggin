import { registerWebModule, NativeModule } from 'expo';

import { ChangeEventPayload } from './ExpoGlanceWidget.types';

type ExpoGlanceWidgetModuleEvents = {
  onChange: (params: ChangeEventPayload) => void;
}

class ExpoGlanceWidgetModule extends NativeModule<ExpoGlanceWidgetModuleEvents> {
  PI = Math.PI;
  async setValueAsync(value: string): Promise<void> {
    this.emit('onChange', { value });
  }
  hello() {
    return 'Hello world! 👋';
  }
};

export default registerWebModule(ExpoGlanceWidgetModule, 'ExpoGlanceWidgetModule');
