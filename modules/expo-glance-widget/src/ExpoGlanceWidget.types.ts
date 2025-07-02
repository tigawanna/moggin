import type { StyleProp, ViewStyle } from 'react-native';

export type OnLoadEventPayload = {
  url: string;
};

export type ExpoGlanceWidgetModuleEvents = {
  onChange: (params: ChangeEventPayload) => void;
};

export type ChangeEventPayload = {
  value: string;
};

export type ExpoGlanceWidgetViewProps = {
  url: string;
  onLoad: (event: { nativeEvent: OnLoadEventPayload }) => void;
  style?: StyleProp<ViewStyle>;
};

// Shared Preferences Types
export type SharedPreferencesValue = string | number | boolean | null;

export interface SharedPreferencesOptions {
  name?: string; // SharedPreferences file name, defaults to app package name
}

// DataStore Types
export type DataStoreValue = string | number | boolean | null;

export interface DataStoreOptions {
  name?: string; // DataStore name, defaults to app package name + "_preferences"
}
