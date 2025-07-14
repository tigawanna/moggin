export type ExpoWakatimeGlanceWidgetsModuleEvents = {
  updateWakatimeDailyDurationWidget: (params: UpdateWidgetPayload) => void;
  updateApiKey: (apiKey: string) => void;
};

export type UpdateWidgetPayload = {
  totalTime: string;
  currentProject: string;
  lastSync: string;
};

