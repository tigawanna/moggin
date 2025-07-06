"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WidgetSync = void 0;
const path_1 = __importDefault(require("path"));
const withPlugins_1 = require("../withPlugins");
const fs_1 = require("./fs");
const manifestSync_1 = require("./manifestSync");
const resourceSync_1 = require("./resourceSync");
const widgetFilesSync_1 = require("./widgetFilesSync");
/**
 * Central utility for syncing external widget files to local directories
 */
class WidgetSync {
    /**
     * Syncs external widget files to local default directories for version control
     * @param projectRoot - Root directory of the Expo project
     * @param options - Plugin configuration options
     * @param packageName - Target package name for the Expo project
     * @param fileMatchPattern - Pattern to match widget files
     * @param includeDirectories - Array of directories to include
     */
    static syncToDefaults(projectRoot, options, packageName, fileMatchPattern, includeDirectories) {
        fs_1.Logger.debug('Checking if widget files need to be synced to defaults...');
        // Check if user is using non-default paths
        const usingCustomPaths = options.widgetFilesPath !== withPlugins_1.DEFAULT_OPTIONS.widgetFilesPath ||
            options.manifestPath !== withPlugins_1.DEFAULT_OPTIONS.manifestPath ||
            options.resPath !== withPlugins_1.DEFAULT_OPTIONS.resPath;
        if (!usingCustomPaths) {
            fs_1.Logger.debug('Using default paths, no sync needed');
            return;
        }
        fs_1.Logger.info('Custom widget paths detected, syncing to default locations for version control...');
        // Determine target paths for syncing
        const targetSyncDir = options.syncDirectory || withPlugins_1.DEFAULT_OPTIONS.syncDirectory;
        const targetManifestPath = `${targetSyncDir}/AndroidManifest.xml`;
        const targetResPath = `${targetSyncDir}/res`;
        // Sync widget class files
        widgetFilesSync_1.WidgetFilesSync.syncToDefaults({
            projectRoot,
            platformRoot: projectRoot,
            fileMatchPattern: fileMatchPattern || options.fileMatchPattern || "Widget",
            packageName,
            widgetFilesPath: options.widgetFilesPath,
            includeDirectories: includeDirectories || options.includeDirectories,
            defaultSourcePath: options.syncDirectory, // Use the provided path as the default source
        });
        // Sync manifest file
        manifestSync_1.ManifestSync.syncToDefaults(projectRoot, options.manifestPath, targetManifestPath);
        // Sync resource files
        resourceSync_1.ResourceSync.syncToDefaults(projectRoot, options.resPath, targetResPath);
    }
    /**
     * Copies widget files to Android build directories
     * @param projectRoot - Root directory of the Expo project
     * @param platformRoot - Root directory of the Android platform
     * @param options - Plugin configuration options
     * @param packageName - Android package name
     * @param fileMatchPattern - Pattern to match widget files
     * @param includeDirectories - Array of directories to include
     */
    static copyToBuild(projectRoot, platformRoot, options, packageName, fileMatchPattern, includeDirectories) {
        const projectAndroidRoot = path_1.default.relative(projectRoot, "android");
        fs_1.FileUtils.ensureDir(projectAndroidRoot);
        // Copy widget Kotlin files
        widgetFilesSync_1.WidgetFilesSync.copyToBuild({
            projectRoot,
            projectAndroidRoot,
            platformRoot: projectRoot,
            fileMatchPattern: fileMatchPattern || options.fileMatchPattern || "Widget",
            packageName,
            widgetFilesPath: options.widgetFilesPath,
            includeDirectories: includeDirectories || options.includeDirectories,
            defaultSourcePath: options.widgetFilesPath, // Use the provided path as the default source
        });
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
