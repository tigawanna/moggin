import path from 'path';
import { FileUtils, Logger } from './fs';

/**
 * Utility functions for syncing and processing Android manifest files
 */
export class ManifestSync {
  /**
   * Syncs manifest file to default location
   * @param projectRoot - Root directory of the Expo project
   * @param customManifestPath - Custom path to manifest file
   * @param defaultManifestPath - Default path for manifest file
   */
  static syncToDefaults(
    projectRoot: string,
    customManifestPath: string,
    defaultManifestPath: string
  ): void {
    const sourceFile = path.join(projectRoot, customManifestPath);
    const defaultFile = path.join(projectRoot, defaultManifestPath);

    if (!FileUtils.exists(sourceFile)) {
      Logger.warn(`Custom manifest file not found: ${sourceFile}`);
      return;
    }

    // Create default directory if it doesn't exist
    FileUtils.ensureDir(path.dirname(defaultFile));

    FileUtils.copyFileSync(sourceFile, defaultFile);
    Logger.success(`Synced manifest: ${path.relative(projectRoot, defaultFile)}`);
  }

  /**
   * Adds widget receivers from the widget manifest to the main Android manifest
   * @param config - Expo config object
   * @param projectRoot - Root directory of the Expo project
   * @param manifestPath - Path to the widget manifest file
   */
  static addReceiversToMainManifest(
    config: any,
    projectRoot: string,
    manifestPath: string
  ): void {
    const widgetManifestPath = path.join(projectRoot, manifestPath);
    
    if (!FileUtils.exists(widgetManifestPath)) {
      Logger.warn(`Widget manifest not found: ${widgetManifestPath}`);
      return;
    }

    Logger.manifest(`Processing widget manifest: ${manifestPath}`);

    try {
      const widgetManifestContent = FileUtils.readFileSync(widgetManifestPath);
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
    }

    return receiver;
  }
}
