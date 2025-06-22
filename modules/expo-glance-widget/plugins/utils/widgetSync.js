"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WidgetSync = void 0;
const fs_1 = require("./fs");
const widgetClassSync_1 = require("./widgetClassSync");
const resourceSync_1 = require("./resourceSync");
const manifestSync_1 = require("./manifestSync");
const withPlugins_1 = require("../withPlugins");
/**
 * Central utility for syncing external widget files to local directories
 */
class WidgetSync {
    /**
     * Syncs external widget files to local default directories for version control
     * @param projectRoot - Root directory of the Expo project
     * @param options - Plugin configuration options
     * @param packageName - Target package name for the Expo project
     */
    static syncToDefaults(projectRoot, options, packageName) {
        fs_1.Logger.debug('Checking if widget files need to be synced to defaults...');
        // Check if user is using non-default paths
        const usingCustomPaths = options.widgetClassPath !== withPlugins_1.DEFAULT_OPTIONS.widgetClassPath ||
            options.manifestPath !== withPlugins_1.DEFAULT_OPTIONS.manifestPath ||
            options.resPath !== withPlugins_1.DEFAULT_OPTIONS.resPath;
        if (!usingCustomPaths) {
            fs_1.Logger.debug('Using default paths, no sync needed');
            return;
        }
        fs_1.Logger.info('Custom widget paths detected, syncing to default locations for version control...');
        // Sync widget class files
        widgetClassSync_1.WidgetClassSync.syncToDefaults(projectRoot, options.widgetClassPath, withPlugins_1.DEFAULT_OPTIONS.widgetClassPath, packageName);
        // Sync manifest file
        manifestSync_1.ManifestSync.syncToDefaults(projectRoot, options.manifestPath, withPlugins_1.DEFAULT_OPTIONS.manifestPath);
        // Sync resource files
        resourceSync_1.ResourceSync.syncToDefaults(projectRoot, options.resPath, withPlugins_1.DEFAULT_OPTIONS.resPath);
    }
    /**
     * Copies widget files to Android build directories
     * @param projectRoot - Root directory of the Expo project
     * @param platformRoot - Root directory of the Android platform
     * @param options - Plugin configuration options
     * @param packageName - Android package name
     */
    static copyToBuild(projectRoot, platformRoot, options, packageName) {
        // Copy widget Kotlin files
        widgetClassSync_1.WidgetClassSync.copyToBuild(projectRoot, platformRoot, options.widgetClassPath, packageName);
        // Copy resource files
        resourceSync_1.ResourceSync.copyToBuild(projectRoot, platformRoot, options.resPath);
    }
    /**
     * Adds widget receivers to Android manifest
     * @param config - Expo config object
     * @param projectRoot - Root directory of the Expo project
     * @param manifestPath - Path to the widget manifest file
     */
    static addReceiversToManifest(config, projectRoot, manifestPath) {
        manifestSync_1.ManifestSync.addReceiversToMainManifest(config, projectRoot, manifestPath);
    }
}
exports.WidgetSync = WidgetSync;
