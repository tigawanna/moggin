// Main plugin export
export { DEFAULT_OPTIONS, WithExpoGlanceWidgetsProps, default as withExpoGlanceWidgets } from './withPlugins';

// Individual plugin exports for advanced usage
export { default as withComposeProjectLevelDependancyPlugin } from './withComposeProjectLevelDependancyPlugin';
export { withGlanceAppLevelGradleConfig } from './withGlanceAppLevelGradleConfig';
export { withGlanceWidgetFiles } from './withGlanceWidgetFiles';

// Utility exports
export { FileUtils, Logger } from './utils/fs';
export { DEFAULT_WIDGET_MERGE_CONFIG, SyncWidget, XmlMergeConfig } from './utils/syncWidget';

