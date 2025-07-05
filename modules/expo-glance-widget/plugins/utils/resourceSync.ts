import path from 'path';
import { FileUtils, Logger } from './fs';
import { XmlUtils } from './xml';

/**
 * Utility functions for syncing and copying resource files
 */
export class ResourceSync {  /**
   * Syncs resource files to default location
   * @param projectRoot - Root directory of the Expo project
   * @param customResPath - Custom path to resources (can be relative or absolute)
   * @param defaultResPath - Default path for resources
   */
  static syncToDefaults(
    projectRoot: string,
    customResPath: string,
    defaultResPath: string
  ): void {
    Logger.info(`\n\n==================== Syncing resources ====================\n\n`);
    const resolvedSource = this.resolveResourcePath(projectRoot, customResPath);
    
    if (!resolvedSource) {
      Logger.warn(`Custom resources directory not found: ${customResPath}`);
      return;
    }

    const defaultDir = path.join(projectRoot, defaultResPath);    Logger.file(`Syncing resources to ${defaultResPath} directory...`);
    FileUtils.copyRecursively(resolvedSource, defaultDir, (targetPath) => {
      Logger.success(`Synced resource: ${path.relative(projectRoot, targetPath)}`);    }, (targetPath: string, sourcePath: string) => {
      // Handle conflicts intelligently during sync as well
      if (path.extname(targetPath) === '.xml') {
        // Try to merge XML files instead of skipping
        const merged = XmlUtils.mergeXmlFiles(sourcePath, targetPath, 'smart');
        if (merged) {
          Logger.success(`Merged XML resource during sync: ${path.relative(projectRoot, targetPath)}`);
        } else {
          Logger.warn(`Could not merge XML file during sync, skipping: ${path.relative(projectRoot, targetPath)}`);
        }
      } else {
        Logger.warn(`Resource file already exists during sync, skipping: ${path.relative(projectRoot, targetPath)}`);
      }
    });
  }
  /**
   * Copies resource files to Android build directory
   * @param projectRoot - Root directory of the Expo project
   * @param platformRoot - Root directory of the Android platform
   * @param resPath - Path to the resources directory (can be relative or absolute)
   */
  static copyToBuild(
    projectRoot: string,
    platformRoot: string,
    resPath: string
  ): void {
    Logger.info(`\n\n==================== Copying resources to build directory ====================\n\n`);
    const resolvedSource = this.resolveResourcePath(projectRoot, resPath);
    
    if (!resolvedSource) {
      Logger.warn(`Resources directory not found: ${resPath}`);
      return;
    }    const destinationResDir = path.join(platformRoot, 'app/src/main/res');
    
    Logger.file(`Copying resources from ${resPath}...`);

    // Copy resources with intelligent XML merging
    FileUtils.copyRecursively(resolvedSource, destinationResDir, (targetPath) => {
      Logger.success(`Copying resource: ${path.relative(destinationResDir, targetPath)}`);    }, (targetPath: string, sourcePath: string) => {
      // Handle conflicts intelligently
      if (path.extname(targetPath) === '.xml') {
        // Try to merge XML files instead of skipping
        const merged = XmlUtils.mergeXmlFiles(sourcePath, targetPath, 'smart');
        if (merged) {
          Logger.success(`Merged XML resource: ${path.relative(destinationResDir, targetPath)}`);
        } else {
          Logger.warn(`Could not merge XML file, skipping: ${path.relative(destinationResDir, targetPath)}`);
        }
      } else {
        Logger.warn(`Resource file already exists, skipping: ${path.relative(destinationResDir, targetPath)}`);
      }
    });
  }

  /**
   * Resolves resource path - handles both directory paths with robust validation
   * @param projectRoot - Root directory of the Expo project
   * @param resPath - Path to resource directory (can be relative or absolute)
   * @returns Resolved path to a valid resource directory, or null if not found
   */
  private static resolveResourcePath(projectRoot: string, resPath: string): string | null {
    // Determine if the path is absolute or relative
    const isAbsolutePath = path.isAbsolute(resPath);
    const fullPath = isAbsolutePath ? resPath : path.join(projectRoot, resPath);
    
    Logger.debug(`Resolving resource path: ${fullPath} (${isAbsolutePath ? 'absolute' : 'relative'})`);
    
    // Check if the directory exists and is valid
    if (FileUtils.exists(fullPath) && FileUtils.isDirectory(fullPath)) {
      if (this.isValidResourceDirectory(fullPath)) {
        Logger.debug(`Found valid resource directory: ${fullPath}`);
        return fullPath;
      } else {
        Logger.warn(`Directory exists but is not a valid resource directory: ${fullPath}`);
        return null;
      }
    }
    
    Logger.warn(`Resource directory not found: ${fullPath}`);
    return null;
  }

  /**
   * Validates if a directory is a legitimate Android resources directory
   * @param dirPath - Path to the directory to validate
   * @returns True if the directory is a valid resource directory
   */
  private static isValidResourceDirectory(dirPath: string): boolean {
    try {
      const items = FileUtils.readdirSync(dirPath);
      
      // Check for common Android resource directory patterns
      const resourceDirPatterns = [
        /^drawable/,
        /^layout/,
        /^values/,
        /^mipmap/,
        /^raw/,
        /^xml/,
        /^color/,
        /^string/
      ];
      
      // If it contains any resource-like directories or XML files, consider it valid
      const hasResourceDirs = items.some(item => 
        resourceDirPatterns.some(pattern => pattern.test(item))
      );
      
      const hasXmlFiles = items.some(item => item.endsWith('.xml'));
      
      return hasResourceDirs || hasXmlFiles;
    } catch {
      return false;
    }
  }
}
