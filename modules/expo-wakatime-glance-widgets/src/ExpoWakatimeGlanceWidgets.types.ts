export type ExpoWakatimeGlanceWidgetsModuleEvents = {
  updateWakatimeWidget: (params: UpdateWidgetPayload) => void;
};

export type UpdateWidgetPayload = {
  value: string;
};

