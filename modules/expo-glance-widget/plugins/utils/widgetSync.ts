import { DEFAULT_OPTIONS } from '../withPlugins';
import { Logger } from './fs';
import { ManifestSync } from './manifestSync';
import { ResourceSync } from './resourceSync';
import { WidgetClassSync } from './widgetClassSync';

export interface WithExpoGlanceWidgetsProps {
  /** Path to the widget Kotlin class file */
  widgetClassPath: string;
  /** Path to the AndroidManifest.xml file containing widget receivers */
  manifestPath: string;
  /** Path to the Android resources directory */
  resPath: string;
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
   */
  static syncToDefaults(
    projectRoot: string,
    options: WithExpoGlanceWidgetsProps,
    packageName: string
  ): void {
    Logger.debug('Checking if widget files need to be synced to defaults...');

    // Check if user is using non-default paths
    const usingCustomPaths = 
      options.widgetClassPath !== DEFAULT_OPTIONS.widgetClassPath ||
      options.manifestPath !== DEFAULT_OPTIONS.manifestPath ||
      options.resPath !== DEFAULT_OPTIONS.resPath;

    if (!usingCustomPaths) {
      Logger.debug('Using default paths, no sync needed');
      return;
    }

    Logger.info('Custom widget paths detected, syncing to default locations for version control...');

    // Sync widget class files
    WidgetClassSync.syncToDefaults(
      projectRoot, 
      options.widgetClassPath, 
      DEFAULT_OPTIONS.widgetClassPath, 
      packageName
    );

    // Sync manifest file
    ManifestSync.syncToDefaults(
      projectRoot, 
      options.manifestPath, 
      DEFAULT_OPTIONS.manifestPath
    );

    // Sync resource files
    ResourceSync.syncToDefaults(
      projectRoot, 
      options.resPath, 
      DEFAULT_OPTIONS.resPath
    );
  }

  /**
   * Copies widget files to Android build directories
   * @param projectRoot - Root directory of the Expo project
   * @param platformRoot - Root directory of the Android platform
   * @param options - Plugin configuration options
   * @param packageName - Android package name
   */
  static copyToBuild(
    projectRoot: string,
    platformRoot: string,
    options: WithExpoGlanceWidgetsProps,
    packageName: string
  ): void {
    // Copy widget Kotlin files
    WidgetClassSync.copyToBuild(
      projectRoot, 
      platformRoot, 
      options.widgetClassPath, 
      packageName
    );

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
