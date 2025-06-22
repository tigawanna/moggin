import * as React from 'react';

import { ExpoGlanceWidgetViewProps } from './ExpoGlanceWidget.types';

export default function ExpoGlanceWidgetView(props: ExpoGlanceWidgetViewProps) {
  return (
    <div>
      <iframe
        style={{ flex: 1 }}
        src={props.url}
        onLoad={() => props.onLoad({ nativeEvent: { url: props.url } })}
      />
    </div>
  );
}
