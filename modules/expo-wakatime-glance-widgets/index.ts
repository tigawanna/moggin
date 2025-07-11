// Reexport the native module. On web, it will be resolved to ExpoWakatimeGlanceWidgetsModule.web.ts
// and on native platforms to ExpoWakatimeGlanceWidgetsModule.ts
export { default } from './src/ExpoWakatimeGlanceWidgetsModule';
export { default as ExpoWakatimeGlanceWidgetsView } from './src/ExpoWakatimeGlanceWidgetsView';
export * from  './src/ExpoWakatimeGlanceWidgets.types';
