import * as React from 'react';

import { ExpoMaterialDynamicColorsViewProps } from './ExpoMaterialDynamicColors.types';

export default function ExpoMaterialDynamicColorsView(props: ExpoMaterialDynamicColorsViewProps) {
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
