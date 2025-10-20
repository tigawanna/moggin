import * as React from 'react';

import { ExpoComposeViewProps } from './ExpoCompose.types';

export default function ExpoComposeView(props: ExpoComposeViewProps) {
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
