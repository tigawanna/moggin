// Reexport the native module. On web, it will be resolved to ExpoSampleModule.web.ts
// and on native platforms to ExpoSampleModule.ts
export { default } from './src/ExpoSampleModule';
export { default as ExpoSampleModuleView } from './src/ExpoSampleModuleView';
export * from  './src/ExpoSampleModule.types';
