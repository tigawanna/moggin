"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withGlanceWidgetFiles = void 0;
const config_plugins_1 = require("@expo/config-plugins");
const widgetSync_1 = require("./utils/widgetSync");
const withPlugins_1 = require("./withPlugins");
/**
 * Main config plugin that copies widget files and modifies Android manifest
 *
 * Features:
 * 1. Syncs external widget files to local default directories for version control
 * 2. Updates package names to match the current Expo project package
 * 3. Copies widget Kotlin source files to Android package structure
 * 4. Copies widget resources to main Android resources directory
 * 5. Extracts and adds widget receivers from manifest to main Android manifest
 *
 * When using custom paths (e.g., pointing to Android Studio project):
 * - Files are first copied to default local directories (widgets/android/)
 * - Package names are automatically updated to match your Expo app package
 * - This ensures widget files are checked into version control with correct package names
 * - Then files are copied from the specified location to Android build
 */
const withGlanceWidgetFiles = (config, options = {}) => {
    const finalOptions = { ...withPlugins_1.DEFAULT_OPTIONS, ...options };
    // Copy widget source files and resources
    config = (0, config_plugins_1.withDangerousMod)(config, [
        'android',
        async (newConfig) => {
            const { modRequest } = newConfig;
            const projectRoot = modRequest.projectRoot;
            const platformRoot = modRequest.platformProjectRoot;
            const packageName = config_plugins_1.AndroidConfig.Package.getPackage(config);
            console.log("=====   ✅✅✅✅✅✅✅✅✅✅ ========", modRequest);
            console.log("=====   ✅✅✅✅✅✅✅✅✅✅ ========", packageName);
            if (!packageName) {
                throw new Error(`ExpoGlanceWidgets: app.config must provide a value for android.package.`);
            }
            // First, sync external widget files to default locations for version control
            widgetSync_1.WidgetSync.syncToDefaults(projectRoot, finalOptions, packageName);
            // Copy widget files to Android build directories
            widgetSync_1.WidgetSync.copyToBuild(projectRoot, platformRoot, finalOptions, packageName);
            return newConfig;
        },
    ]);
    // Modify Android manifest to include widget receivers
    config = (0, config_plugins_1.withAndroidManifest)(config, (config) => {
        const projectRoot = config.modRequest?.projectRoot;
        if (projectRoot) {
            widgetSync_1.WidgetSync.addReceiversToManifest(config, projectRoot, finalOptions.manifestPath);
        }
        return config;
    });
    return config;
};
exports.withGlanceWidgetFiles = withGlanceWidgetFiles;
exports.default = exports.withGlanceWidgetFiles;
