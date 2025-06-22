import path from 'path';
import { FileUtils, Logger } from './fs';

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
   * Adds widget receivers from the widget manifest to the main Android manifest
   * @param config - Expo config object
   * @param projectRoot - Root directory of the Expo project
   * @param manifestPath - Path to the widget manifest file (can be relative or absolute)
   */
  static addReceiversToMainManifest(
    config: any,
    projectRoot: string,
    manifestPath: string
  ): void {
    const resolvedManifestPath = this.resolveManifestPath(projectRoot, manifestPath);
    
    if (!resolvedManifestPath) {
      Logger.warn(`Widget manifest not found: ${manifestPath}`);
      return;
    }    Logger.manifest(`Processing widget manifest: ${manifestPath}`);

    try {
      const widgetManifestContent = FileUtils.readFileSync(resolvedManifestPath);
      const receivers = this.extractReceiversFromManifest(widgetManifestContent);

      if (receivers.length === 0) {
        Logger.info(`No <receiver> elements found in widget manifest`);
        return;
      }

      // Add receivers to the main manifest
      const mainApplication = config?.modResults?.manifest?.application?.[0];
      
      if (mainApplication) {
        if (!mainApplication.receiver) {
          mainApplication.receiver = [];
        }

        receivers.forEach((receiver, index) => {
          Logger.success(`Adding receiver ${index + 1}: ${receiver.$?.['android:name'] || 'unnamed'}`);
          mainApplication.receiver!.push(receiver);
        });

        Logger.mobile(`Added ${receivers.length} widget receiver(s) to Android manifest`);
      }
    } catch (error) {
      Logger.error(`Error processing widget manifest: ${error}`);
    }
  }

  /**
   * Extracts receiver elements from an Android manifest XML string
   * @param manifestContent - XML content of the manifest
   * @returns Array of receiver objects
   */
  private static extractReceiversFromManifest(manifestContent: string): any[] {
    const receivers: any[] = [];
    
    // Simple regex to extract receiver blocks (basic implementation)
    // In a production environment, you might want to use a proper XML parser
    const receiverRegex = /<receiver[^>]*>[\s\S]*?<\/receiver>/g;
    const matches = manifestContent.match(receiverRegex);

    if (matches) {
      matches.forEach(receiverXml => {
        // Parse basic receiver attributes and children
        const receiver = this.parseReceiverXml(receiverXml);
        if (receiver) {
          receivers.push(receiver);
        }
      });
    }

    return receivers;
  }

  /**
   * Basic XML parser for receiver elements
   * @param receiverXml - XML string for a receiver element
   * @returns Parsed receiver object
   */
  private static parseReceiverXml(receiverXml: string): any {
    // This is a simplified parser - in production, use a proper XML parser
    const nameMatch = receiverXml.match(/android:name="([^"]*)"/);
    const exportedMatch = receiverXml.match(/android:exported="([^"]*)"/);

    const receiver: any = {
      $: {}
    };

    if (nameMatch) {
      receiver.$['android:name'] = nameMatch[1];
    }

    if (exportedMatch) {
      receiver.$['android:exported'] = exportedMatch[1];
    }

    // Extract intent-filter and meta-data (simplified)
    const intentFilterRegex = /<intent-filter[^>]*>[\s\S]*?<\/intent-filter>/g;
    const metaDataRegex = /<meta-data[^>]*\/>/g;

    const intentFilters = receiverXml.match(intentFilterRegex);
    const metaDataElements = receiverXml.match(metaDataRegex);

    if (intentFilters) {
      receiver['intent-filter'] = intentFilters.map(filter => {
        const actionMatch = filter.match(/<action[^>]*android:name="([^"]*)"[^>]*\/>/);
        return {
          action: actionMatch ? [{ $: { 'android:name': actionMatch[1] } }] : []
        };
      });
    }

    if (metaDataElements) {
      receiver['meta-data'] = metaDataElements.map(metaData => {
        const nameMatch = metaData.match(/android:name="([^"]*)"/);
        const resourceMatch = metaData.match(/android:resource="([^"]*)"/);
        
        const result: any = { $: {} };
        if (nameMatch) result.$['android:name'] = nameMatch[1];
        if (resourceMatch) result.$['android:resource'] = resourceMatch[1];
        
        return result;
      });
    }    return receiver;
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
