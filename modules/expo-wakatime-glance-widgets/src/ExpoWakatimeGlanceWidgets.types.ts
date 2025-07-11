export type ExpoWakatimeGlanceWidgetsModuleEvents = {
  updateWakatimeWidget: (params: UpdateWidgetPayload) => void;
};

export type UpdateWidgetPayload = {
  totalTime: string;
  currentProject: string;
  lastSync: string;
};

