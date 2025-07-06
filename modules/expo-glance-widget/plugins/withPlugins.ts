import { ConfigPlugin } from "expo/config-plugins";
import path from "path";
import withComposeProjectLevelDependancyPlugin from "./withComposeProjectLevelDependancyPlugin";
import { withGlanceAppLevelGradleConfig } from "./withGlanceAppLevelGradleConfig";
import { withGlanceWidgetFiles } from "./withGlanceWidgetFiles";
import { FileUtils, Logger } from "./utils/fs";


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
  destinationPackageName?: string;
  /** Base path for the original widget sources (if different from destination) */
  sourcePackageName?: string;
}

/**
 * Default configuration options for Expo Glance Widgets
 */
export const DEFAULT_OPTIONS: WithExpoGlanceWidgetsProps = {
  widgetFilesPath: "widgets/android",
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
function getDefaultedOptions(
  options: Partial<WithExpoGlanceWidgetsProps>
): WithExpoGlanceWidgetsProps {
  const mergedOptions = {
    ...DEFAULT_OPTIONS,
    ...options,
  };

  // check if the specified widgetSources exist and use defult paths if not
  if (!FileUtils.exists(mergedOptions.widgetFilesPath)) {
    Logger.warn(
      `ExpoGlanceWidgets: widgetFilesPath does not exist: ${mergedOptions.widgetFilesPath}`
    );
    if (!FileUtils.exists(DEFAULT_OPTIONS.widgetFilesPath)) {
      throw new Error(
        `ExpoGlanceWidgets: widgetFilesPath does not exist: ${mergedOptions.widgetFilesPath}`
      );
    }
    Logger.warn(`Using default widgetFilesPath: ${DEFAULT_OPTIONS.widgetFilesPath}\n`);
    mergedOptions.widgetFilesPath = DEFAULT_OPTIONS.widgetFilesPath;
  }

  if (!FileUtils.exists(mergedOptions.manifestPath)) {
    Logger.warn(`ExpoGlanceWidgets: manifestPath does not exist: ${mergedOptions.manifestPath}`);
    // If the manifest path doesn't exist, use the default one
    if (!FileUtils.exists(DEFAULT_OPTIONS.manifestPath)) {
      throw new Error(
        `ExpoGlanceWidgets: manifestPath does not exist: ${mergedOptions.manifestPath}`
      );
    }
    Logger.warn(`Using default manifestPath: ${DEFAULT_OPTIONS.manifestPath}\n`);
    mergedOptions.manifestPath = DEFAULT_OPTIONS.manifestPath;
  }
  
  if (!FileUtils.exists(mergedOptions.resPath)) {
    Logger.warn(`ExpoGlanceWidgets: resPath does not exist: ${mergedOptions.resPath}`);
    if (!FileUtils.exists(DEFAULT_OPTIONS.resPath)) {
      throw new Error(`ExpoGlanceWidgets: resPath does not exist: ${mergedOptions.resPath}`);
    }
    Logger.warn(`Using default resPath: ${DEFAULT_OPTIONS.resPath}\n`);
    mergedOptions.resPath = DEFAULT_OPTIONS.resPath;
  }

  // Auto-detect external sources and adjust sync directory
  const isExternalWidgetPath =
    path.isAbsolute(mergedOptions.widgetFilesPath) ||
    mergedOptions.widgetFilesPath.startsWith("../");
  const isExternalManifestPath =
    path.isAbsolute(mergedOptions.manifestPath) || mergedOptions.manifestPath.startsWith("../");
  const isExternalResPath =
    path.isAbsolute(mergedOptions.resPath) || mergedOptions.resPath.startsWith("../");

  // If any source is external and syncDirectory wasn't explicitly set, ensure we use the default
  if (
    (isExternalWidgetPath || isExternalManifestPath || isExternalResPath) &&
    !options.syncDirectory
  ) {
    mergedOptions.syncDirectory = DEFAULT_OPTIONS.syncDirectory;
    console.log(
      `🔍 External widget sources detected, will sync to: ${mergedOptions.syncDirectory}`
    );
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
const withExpoGlanceWidgets: ConfigPlugin<Partial<WithExpoGlanceWidgetsProps>> = (
  config,
  userOptions = {}
) => {
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
