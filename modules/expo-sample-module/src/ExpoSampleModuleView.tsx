import { requireNativeView } from 'expo';
import * as React from 'react';

import { ExpoSampleModuleViewProps } from './ExpoSampleModule.types';

const NativeView: React.ComponentType<ExpoSampleModuleViewProps> =
  requireNativeView('ExpoSampleModule');

export default function ExpoSampleModuleView(props: ExpoSampleModuleViewProps) {
  return <NativeView {...props} />;
}
