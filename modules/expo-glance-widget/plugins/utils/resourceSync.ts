import path from 'path';
import { FileUtils, Logger } from './fs';

/**
 * Utility functions for syncing and copying resource files
 */
export class ResourceSync {
  /**
   * Syncs resource files to default location
   * @param projectRoot - Root directory of the Expo project
   * @param customResPath - Custom path to resources
   * @param defaultResPath - Default path for resources
   */
  static syncToDefaults(
    projectRoot: string,
    customResPath: string,
    defaultResPath: string
  ): void {
    const sourceDir = path.join(projectRoot, customResPath);
    const defaultDir = path.join(projectRoot, defaultResPath);

    if (!FileUtils.exists(sourceDir)) {
      Logger.warn(`Custom resources directory not found: ${sourceDir}`);
      return;
    }

    Logger.file(`Syncing resources to ${defaultResPath} directory...`);
    FileUtils.copyRecursively(sourceDir, defaultDir, (targetPath) => {
      Logger.success(`Synced resource: ${path.relative(projectRoot, targetPath)}`);
    });
  }

  /**
   * Copies resource files to Android build directory
   * @param projectRoot - Root directory of the Expo project
   * @param platformRoot - Root directory of the Android platform
   * @param resPath - Path to the resources directory
   */
  static copyToBuild(
    projectRoot: string,
    platformRoot: string,
    resPath: string
  ): void {
    const sourceResDir = path.join(projectRoot, resPath);
    
    if (!FileUtils.exists(sourceResDir)) {
      Logger.warn(`Resources directory not found: ${sourceResDir}`);
      return;
    }

    const destinationResDir = path.join(platformRoot, 'app/src/main/res');
    
    Logger.file(`Copying resources from ${resPath}...`);

    // Copy resources with conflict detection
    FileUtils.copyRecursively(sourceResDir, destinationResDir, (targetPath) => {
      Logger.success(`Copying resource: ${path.relative(destinationResDir, targetPath)}`);
    }, (targetPath) => {
      Logger.warn(`Resource file already exists, skipping: ${path.relative(destinationResDir, targetPath)}`);
    });
  }
}
