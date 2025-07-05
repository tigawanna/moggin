"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_OPTIONS = void 0;
const path_1 = __importDefault(require("path"));
const withComposeProjectLevelDependancyPlugin_1 = __importDefault(require("./withComposeProjectLevelDependancyPlugin"));
const withGlanceAppLevelGradleConfig_1 = require("./withGlanceAppLevelGradleConfig");
const withGlanceWidgetFiles_1 = require("./withGlanceWidgetFiles");
/**
 * Default configuration options for Expo Glance Widgets
 */
exports.DEFAULT_OPTIONS = {
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
function getDefaultedOptions(options) {
    const mergedOptions = {
        ...exports.DEFAULT_OPTIONS,
        ...options,
    };
    // Auto-detect external sources and adjust sync directory
    const isExternalWidgetPath = path_1.default.isAbsolute(mergedOptions.widgetFilesPath) ||
        mergedOptions.widgetFilesPath.startsWith('../');
    const isExternalManifestPath = path_1.default.isAbsolute(mergedOptions.manifestPath) ||
        mergedOptions.manifestPath.startsWith('../');
    const isExternalResPath = path_1.default.isAbsolute(mergedOptions.resPath) ||
        mergedOptions.resPath.startsWith('../');
    // If any source is external and syncDirectory wasn't explicitly set, ensure we use the default
    if ((isExternalWidgetPath || isExternalManifestPath || isExternalResPath) &&
        !options.syncDirectory) {
        mergedOptions.syncDirectory = exports.DEFAULT_OPTIONS.syncDirectory;
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
const withExpoGlanceWidgets = (config, userOptions = {}) => {
    const options = getDefaultedOptions(userOptions);
    const sdkVersion = parseInt(config.sdkVersion?.split(".")[0] || "0", 10);
    // Validate SDK version
    if (sdkVersion < 53) {
        throw new Error("🚫 Expo Glance Widgets requires SDK version 53 or higher.");
    }
    // Apply Compose project-level dependencies
    config = (0, withComposeProjectLevelDependancyPlugin_1.default)(config, options);
    // Apply app-level build configuration for Kotlin Compose and Glance
    config = (0, withGlanceAppLevelGradleConfig_1.withGlanceAppLevelGradleConfig)(config);
    // Apply widget files copying and manifest modifications
    config = (0, withGlanceWidgetFiles_1.withGlanceWidgetFiles)(config, options);
    return config;
};
exports.default = withExpoGlanceWidgets;
