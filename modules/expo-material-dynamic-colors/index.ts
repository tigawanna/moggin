// Reexport the native module. On web, it will be resolved to ExpoMaterialDynamicColorsModule.web.ts
// and on native platforms to ExpoMaterialDynamicColorsModule.ts
export { default } from './src/ExpoMaterialDynamicColorsModule';
export { default as ExpoMaterialDynamicColorsView } from './src/ExpoMaterialDynamicColorsView';
export * from  './src/ExpoMaterialDynamicColors.types';
