import { ConfigPlugin } from "expo/config-plugins";
import withComposeProjectLevelDependancyPlugin from "./withComposeProjectLevelDependancyPlugin";
import { withGlanceAppLevelGradleConfig } from "./withGlanceAppLevelGradleConfig";
import { withGlanceWidgetFiles } from "./withGlanceWidgetFiles";

/**
 * Configuration options for the Expo Glance Widgets plugin
 */
export interface WithExpoGlanceWidgetsProps {
  /** Path to the widget Kotlin class file */
  widgetClassPath: string;
  /** Path to the AndroidManifest.xml file containing widget receivers */
  manifestPath: string;
  /** Path to the Android resources directory */
  resPath: string;
}

/**
 * Default configuration options for Expo Glance Widgets
 */
export const DEFAULT_OPTIONS: WithExpoGlanceWidgetsProps = {
  widgetClassPath: "widgets/android/MyWidget.kt",
  manifestPath: "widgets/android/AndroidManifest.xml",
  resPath: "widgets/android/res",
};

/**
 * Merges user options with default options
 * @param options - User provided options
 * @returns Merged options with defaults
 */
function getDefaultedOptions(options: Partial<WithExpoGlanceWidgetsProps>): WithExpoGlanceWidgetsProps {
  return {
    ...DEFAULT_OPTIONS,
    ...options,
  };
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
 *   widgetClassPath: "../../MyAndroidProject/app/src/main/java/com/example/MyWidget.kt",
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
