export type ExpoGlanceWidgetModuleEvents = {
  onLoad: { url: string };
};

export type WidgetCreationResult = {
  success: boolean;
  error?: string;
};

export type ExpoGlanceWidgetModuleViewProps = {
  url: string;
  onLoad?: (event: { nativeEvent: { url: string } }) => void;
};
