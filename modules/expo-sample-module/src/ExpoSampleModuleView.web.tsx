import * as React from 'react';

import { ExpoSampleModuleViewProps } from './ExpoSampleModule.types';

export default function ExpoSampleModuleView(props: ExpoSampleModuleViewProps) {
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
