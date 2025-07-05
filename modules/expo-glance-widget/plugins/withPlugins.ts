import { ConfigPlugin } from "expo/config-plugins";
import path from "path";
import withComposeProjectLevelDependancyPlugin from "./withComposeProjectLevelDependancyPlugin";
import { withGlanceAppLevelGradleConfig } from "./withGlanceAppLevelGradleConfig";
import { withGlanceWidgetFiles } from "./withGlanceWidgetFiles";

/**
 * Configuration options for the Expo Glance Widgets plugin
 */
export interface WithExpoGlanceWidgetsProps {
  /** Path to the widget Kotlin class file or directory */
  widgetFilesPath: string;
  /** Path to the AndroidManifest.xml file containing widget receivers */
  manifestPath: string;
  /** Path to the Android resources directory */
  resPath: string;
  /** Pattern to match widget files (regex string or simple string with wildcards) */
  fileMatchPattern?: string;
  /** Directory to sync external widget files for version control (auto-generated if external sources) */
  syncDirectory?: string;
  /** Array of specific directories to include when copying files (relative to widgetFilesPath) */
  includeDirectories?: string[];
  /** Base path for external widget sources (if using external Android Studio projects) */
  destinationPackageName ?: string;
  /** Base path for the original widget sources (if different from destination) */
  sourcePackageName?: string;
}

/**
 * Default configuration options for Expo Glance Widgets
 */
export const DEFAULT_OPTIONS: WithExpoGlanceWidgetsProps = {
  widgetFilesPath: "widgets/android/MyWidget.kt",
  manifestPath: "widgets/android/AndroidManifest.xml",
  resPath: "widgets/android/res",
  fileMatchPattern: "Widget", // Default: match files containing "Widget" in the name
  syncDirectory: "widgets/android", // Default sync directory for external sources
};

/**
 * Merges user options with default options and handles external source paths
 * @param options - User provided options
 * @returns Merged options with defaults and smart path resolution
 */
function getDefaultedOptions(options: Partial<WithExpoGlanceWidgetsProps>): WithExpoGlanceWidgetsProps {
  const mergedOptions = {
    ...DEFAULT_OPTIONS,
    ...options,
  };

  // Auto-detect external sources and adjust sync directory
  const isExternalWidgetPath = path.isAbsolute(mergedOptions.widgetFilesPath) || 
                              mergedOptions.widgetFilesPath.startsWith('../');
  const isExternalManifestPath = path.isAbsolute(mergedOptions.manifestPath) ||
                                mergedOptions.manifestPath.startsWith('../');
  const isExternalResPath = path.isAbsolute(mergedOptions.resPath) ||
                           mergedOptions.resPath.startsWith('../');

  // If any source is external and syncDirectory wasn't explicitly set, ensure we use the default
  if ((isExternalWidgetPath || isExternalManifestPath || isExternalResPath) && 
      !options.syncDirectory) {
    mergedOptions.syncDirectory = DEFAULT_OPTIONS.syncDirectory;
    console.log(`🔍 External widget sources detected, will sync to: ${mergedOptions.syncDirectory}`);
  }

  return mergedOptions;
}

/**
 * Main Expo Glance Widgets configuration plugin
 *  * This plugin:
 * 1. Syncs external widget files to local directories for version control
 * 2. Updates package names to match your Expo project package automatically
 * 3. Adds Kotlin 2.0 and Compose compiler dependencies to the project-level build.gradle
 * 4. Copies widget Kotlin source files to the correct Android package structure
 * 5. Copies widget resources to the main Android resources directory
 * 6. Extracts and adds widget receivers from manifest to the main Android manifest
 * 
 * @example
 * // Using default paths (files in your repo)
 * [withExpoGlanceWidgets, {}]
 * 
 * @example
 * // Using external Android Studio project
 * [withExpoGlanceWidgets, {
 *   widgetFilesPath: "../../MyAndroidProject/app/src/main/java/com/example/MyWidget.kt",
 *   manifestPath: "../../MyAndroidProject/app/src/main/AndroidManifest.xml",
 *   resPath: "../../MyAndroidProject/app/src/main/res"
 * }]
 * // Files will be synced to local widgets/android/ directory for version control
 * 
 * @param config - Expo configuration object
 * @param userOptions - User provided plugin options
 * @returns Modified Expo configuration
 */
const withExpoGlanceWidgets: ConfigPlugin<Partial<WithExpoGlanceWidgetsProps>> = (config, userOptions = {}) => {
  const options = getDefaultedOptions(userOptions);
  const sdkVersion = parseInt(config.sdkVersion?.split(".")[0] || "0", 10);
  // Validate SDK version
  if (sdkVersion < 53) {
    throw new Error("🚫 Expo Glance Widgets requires SDK version 53 or higher.");
  }
    // Apply Compose project-level dependencies
  config = withComposeProjectLevelDependancyPlugin(config, options);
  
  // Apply app-level build configuration for Kotlin Compose and Glance
  config = withGlanceAppLevelGradleConfig(config);
  
  // Apply widget files copying and manifest modifications
  config = withGlanceWidgetFiles(config, options);

  return config;
};

export default withExpoGlanceWidgets;
