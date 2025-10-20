import { requireNativeView } from 'expo';
import * as React from 'react';

import { ExpoComposeViewProps } from './ExpoCompose.types';

const NativeView: React.ComponentType<ExpoComposeViewProps> =
  requireNativeView('ExpoCompose');

export default function ExpoComposeView(props: ExpoComposeViewProps) {
  return <NativeView {...props} />;
}
