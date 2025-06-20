import { requireNativeView } from 'expo';
import * as React from 'react';

import { ExpoGlanceWidgetViewProps } from './ExpoGlanceWidget.types';

const NativeView: React.ComponentType<ExpoGlanceWidgetViewProps> =
  requireNativeView('ExpoGlanceWidget');

export default function ExpoGlanceWidgetView(props: ExpoGlanceWidgetViewProps) {
  return <NativeView {...props} />;
}
