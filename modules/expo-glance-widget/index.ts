// Reexport the native module. On web, it will be resolved to ExpoGlanceWidgetModule.web.ts
// and on native platforms to ExpoGlanceWidgetModule.ts
export * from './src/ExpoGlanceWidget.types';
export { default } from './src/ExpoGlanceWidgetModule';

// Export shared preferences API
export * from './src/SharedPreferences';
