import path from 'path';
import { DEFAULT_OPTIONS } from '../withPlugins';
import { FileUtils, Logger } from './fs';
import { ManifestSync } from './manifestSync';
import { ResourceSync } from './resourceSync';
import { WidgetClassSync } from './widgetClassSync';

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
}

/**
 * Central utility for syncing external widget files to local directories
 */
export class WidgetSync {
  /**
   * Syncs external widget files to local default directories for version control
   * @param projectRoot - Root directory of the Expo project
   * @param options - Plugin configuration options
   * @param packageName - Target package name for the Expo project
   * @param fileMatchPattern - Pattern to match widget files
   * @param includeDirectories - Array of directories to include
   */
  static syncToDefaults(
    projectRoot: string,
    options: WithExpoGlanceWidgetsProps,
    packageName: string,
    fileMatchPattern?: string,
    includeDirectories?: string[]
  ): void {
    Logger.debug('Checking if widget files need to be synced to defaults...');
  
    // Check if user is using non-default paths
    const usingCustomPaths = 
      options.widgetFilesPath !== DEFAULT_OPTIONS.widgetFilesPath ||
      options.manifestPath !== DEFAULT_OPTIONS.manifestPath ||
      options.resPath !== DEFAULT_OPTIONS.resPath;

    if (!usingCustomPaths) {
      Logger.debug('Using default paths, no sync needed');
      return;
    }

    Logger.info('Custom widget paths detected, syncing to default locations for version control...');

    // Determine target paths for syncing
    const targetSyncDir = options.syncDirectory || DEFAULT_OPTIONS.syncDirectory;
    const targetManifestPath = `${targetSyncDir}/AndroidManifest.xml`;  
    const targetResPath = `${targetSyncDir}/res`;
// Sync widget class files
    WidgetClassSync.syncToDefaults({
      projectRoot,
      platformRoot: projectRoot,
      fileMatchPattern: fileMatchPattern || options.fileMatchPattern || "Widget",
      packageName,
      widgetFilesPath: options.widgetFilesPath,
      includeDirectories: includeDirectories || options.includeDirectories,
      defaultSourcePath: options.syncDirectory, // Use the provided path as the default source
    });

    // Sync manifest file
    ManifestSync.syncToDefaults(
      projectRoot, 
      options.manifestPath, 
      targetManifestPath
    );

    // Sync resource files
    ResourceSync.syncToDefaults(
      projectRoot, 
      options.resPath, 
      targetResPath
    );
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
  static copyToBuild(
    projectRoot: string,
    platformRoot: string,
    options: WithExpoGlanceWidgetsProps,
    packageName: string,
    fileMatchPattern?: string,
    includeDirectories?: string[]
  ): void {
    const projectAndroidRoot = path.relative(projectRoot, "android");
    FileUtils.ensureDir(projectAndroidRoot);
    console.log("\n ==== copying with options ===\n", {
      projectRoot,
      platformRoot: projectRoot,
      fileMatchPattern: fileMatchPattern || options.fileMatchPattern || "Widget",
      packageName,
      widgetFilesPath: options.widgetFilesPath,
      includeDirectories: includeDirectories || options.includeDirectories,
      defaultSourcePath: options.widgetFilesPath, // Use the provided path as the default source
    });
    // Copy widget Kotlin files
    WidgetClassSync.copyToBuild({
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
    ResourceSync.copyToBuild(
      projectRoot, 
      platformRoot, 
      options.resPath
    );
  }

  /**
   * Adds widget receivers to Android manifest
   * @param config - Expo config object
   * @param projectRoot - Root directory of the Expo project
   * @param manifestPath - Path to the widget manifest file
   */
  static addReceiversToManifest(
    config: any,
    projectRoot: string,
    manifestPath: string
  ): void {
    ManifestSync.addReceiversToMainManifest(config, projectRoot, manifestPath);
  }
}
