// Reexport the native module. On web, it will be resolved to ExpoComposeModule.web.ts
// and on native platforms to ExpoComposeModule.ts
export { default } from './src/ExpoComposeModule';
export { default as ExpoComposeView } from './src/ExpoComposeView';
export * from  './src/ExpoCompose.types';
