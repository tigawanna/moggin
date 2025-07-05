import path from 'path';
import { FileUtils, Logger } from './fs';
import { Parser } from 'xml2js';

/**
 * Utility functions for syncing and processing Android manifest files
 */
export class ManifestSync {  /**
   * Syncs manifest file to default location
   * @param projectRoot - Root directory of the Expo project
   * @param customManifestPath - Custom path to manifest file (can be relative or absolute)
   * @param defaultManifestPath - Default path for manifest file
   */
  static syncToDefaults(
    projectRoot: string,
    customManifestPath: string,
    defaultManifestPath: string
  ): void {
    const resolvedSource = this.resolveManifestPath(projectRoot, customManifestPath);
    
    if (!resolvedSource) {
      Logger.warn(`Custom manifest file not found: ${customManifestPath}`);
      return;
    }

    const defaultFile = path.join(projectRoot, defaultManifestPath);

    // Create default directory if it doesn't exist
    FileUtils.ensureDir(path.dirname(defaultFile));

    FileUtils.copyFileSync(resolvedSource, defaultFile);
    Logger.success(`Synced manifest: ${path.relative(projectRoot, defaultFile)}`);
  }
  /**
   * Adds widget receivers and permissions from the widget manifest to the main Android manifest
   * @param config - Expo config object
   * @param projectRoot - Root directory of the Expo project
   * @param manifestPath - Path to the widget manifest file (can be relative or absolute)
   */
  static async addReceiversToMainManifest(
    config: any,
    projectRoot: string,
    manifestPath: string
  ): Promise<void> {
    const resolvedManifestPath = this.resolveManifestPath(projectRoot, manifestPath);
    
    if (!resolvedManifestPath) {
      Logger.warn(`Widget manifest not found: ${manifestPath}`);
      return;
    }    Logger.manifest(`Processing widget manifest: ${manifestPath}`);

    try {
      const widgetManifestContent = FileUtils.readFileSync(resolvedManifestPath);
      const parser = new Parser();
      const widgetManifest = await parser.parseStringPromise(widgetManifestContent);

      const receivers = widgetManifest?.manifest?.application?.[0]?.receiver || [];
      const permissions = widgetManifest?.manifest?.['uses-permission'] || [];

      if (receivers.length === 0 && permissions.length === 0) {
        Logger.info(`No <receiver> or <uses-permission> elements found in widget manifest`);
        return;
      }

      // Add receivers to the main manifest
      const mainApplication = config?.modResults?.manifest?.application?.[0];
      
      if (mainApplication) {
        if (!mainApplication.receiver) {
          mainApplication.receiver = [];
        }

        receivers.forEach((receiver: any, index: number) => {
          Logger.success(`Adding receiver ${index + 1}: ${receiver.$?.['android:name'] || 'unnamed'}`);
          mainApplication.receiver!.push(receiver);
        });

        Logger.mobile(`Added ${receivers.length} widget receiver(s) to Android manifest`);
      }

      // Add permissions to the main manifest
      if (config?.modResults?.manifest) {
        if (!config.modResults.manifest['uses-permission']) {
          config.modResults.manifest['uses-permission'] = [];
        }

        permissions.forEach((permission: any, index: number) => {
          Logger.success(`Adding permission ${index + 1}: ${permission.$?.['android:name'] || 'unnamed'}`);
          config.modResults.manifest['uses-permission']!.push(permission);
        });

        Logger.mobile(`Added ${permissions.length} permission(s) to Android manifest`);
      }

    } catch (error) {
      Logger.error(`Error processing widget manifest: ${error}`);
    }
  }

  /**
   * Resolves manifest path - handles both file paths with robust validation
   * @param projectRoot - Root directory of the Expo project
   * @param manifestPath - Path to manifest file (can be relative or absolute)
   * @returns Resolved path to a valid manifest file, or null if not found
   */
  private static resolveManifestPath(projectRoot: string, manifestPath: string): string | null {
    // Determine if the path is absolute or relative
    const isAbsolutePath = path.isAbsolute(manifestPath);
    const fullPath = isAbsolutePath ? manifestPath : path.join(projectRoot, manifestPath);
    
    Logger.debug(`Resolving manifest path: ${fullPath} (${isAbsolutePath ? 'absolute' : 'relative'})`);
    
    // Check if the file exists and is a valid manifest file
    if (FileUtils.exists(fullPath) && !FileUtils.isDirectory(fullPath)) {
      if (this.isValidManifestFile(fullPath)) {
        Logger.debug(`Found valid manifest file: ${fullPath}`);
        return fullPath;
      } else {
        Logger.warn(`File exists but is not a valid manifest file: ${fullPath}`);
        return null;
      }
    }
    
    Logger.warn(`Manifest file not found: ${fullPath}`);
    return null;
  }

  /**
   * Validates if a file is a legitimate Android manifest file
   * @param filePath - Path to the file to validate
   * @returns True if the file is a valid manifest file
   */
  private static isValidManifestFile(filePath: string): boolean {
    if (!filePath.toLowerCase().includes('manifest') && !filePath.endsWith('.xml')) {
      return false;
    }
    
    try {
      const content = FileUtils.readFileSync(filePath);
      
      // Check if file content contains manifest-related keywords
      const manifestKeywords = ['<manifest', '<application', 'android:'];
      return manifestKeywords.some(keyword => content.includes(keyword));
    } catch {
      return false;
    }
  }
}
