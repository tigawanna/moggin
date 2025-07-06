import { requireNativeView } from 'expo';
import * as React from 'react';

import { ExpoMaterialDynamicColorsViewProps } from './ExpoMaterialDynamicColors.types';

const NativeView: React.ComponentType<ExpoMaterialDynamicColorsViewProps> =
  requireNativeView('ExpoMaterialDynamicColors');

export default function ExpoMaterialDynamicColorsView(props: ExpoMaterialDynamicColorsViewProps) {
  return <NativeView {...props} />;
}
