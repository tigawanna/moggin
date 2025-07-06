import { requireNativeModule } from 'expo';

import { MaterialDynamicTheme } from './ExpoMaterialDynamicColors.types';

// declare class ExpoMaterialDynamicColorsModule extends NativeModule<MaterialDynamicTheme> {

// }

// This call loads the native module object from the JSI.
export default requireNativeModule<MaterialDynamicTheme>('ExpoMaterialDynamicColors');
