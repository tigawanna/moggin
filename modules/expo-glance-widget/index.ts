// Reexport the native module. On web, it will be resolved to ExpoGlanceWidgetModule.web.ts
// and on native platforms to ExpoGlanceWidgetModule.ts
export { default } from './src/ExpoGlanceWidgetModule';
export { default as ExpoGlanceWidgetView } from './src/ExpoGlanceWidgetView';
export * from  './src/ExpoGlanceWidget.types';
