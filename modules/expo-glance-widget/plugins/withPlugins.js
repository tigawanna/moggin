"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_OPTIONS = void 0;
const withComposeProjectLevelDependancyPlugin_1 = __importDefault(require("./withComposeProjectLevelDependancyPlugin"));
const withGlanceWidgetFiles_1 = require("./withGlanceWidgetFiles");
/**
 * Default configuration options for Expo Glance Widgets
 */
exports.DEFAULT_OPTIONS = {
    widgetClassPath: "widgets/android/MyWidget.kt",
    manifestPath: "widgets/android/AndroidManifest.xml",
    resPath: "widgets/android/res",
};
/**
 * Merges user options with default options
 * @param options - User provided options
 * @returns Merged options with defaults
 */
function getDefaultedOptions(options) {
    return {
        ...exports.DEFAULT_OPTIONS,
        ...options,
    };
}
/**
 * Main Expo Glance Widgets configuration plugin
 *
 * This plugin:
 * 1. Syncs external widget files to local directories for version control
 * 2. Adds Kotlin 2.0 and Compose compiler dependencies to the project-level build.gradle
 * 3. Copies widget Kotlin source files to the correct Android package structure
 * 4. Copies widget resources to the main Android resources directory
 * 5. Extracts and adds widget receivers from manifest to the main Android manifest
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
const withExpoGlanceWidgets = (config, userOptions = {}) => {
    const options = getDefaultedOptions(userOptions);
    const sdkVersion = parseInt(config.sdkVersion?.split(".")[0] || "0", 10);
    // Validate SDK version
    if (sdkVersion < 53) {
        throw new Error("🚫 Expo Glance Widgets requires SDK version 53 or higher.");
    }
    // Apply Compose project-level dependencies
    config = (0, withComposeProjectLevelDependancyPlugin_1.default)(config, options);
    // Apply widget files copying and manifest modifications
    config = (0, withGlanceWidgetFiles_1.withGlanceWidgetFiles)(config, options);
    return config;
};
exports.default = withExpoGlanceWidgets;
