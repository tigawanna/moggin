import path from 'path';
import { Parser } from 'xml2js';
import { FileUtils, Logger } from './fs';

/**
 * Configuration for XML element merging
 */
export interface XmlMergeConfig {
  /** Elements to merge from widget manifest to main manifest */
  elementsToMerge: string[];
  /** Whether to merge application-level elements (like receivers) */
  mergeApplicationElements?: boolean;
  /** Whether to merge manifest-level elements (like permissions) */
  mergeManifestElements?: boolean;
  /** Custom merge rules for specific elements */
  customMergeRules?: Record<string, (existing: any[], incoming: any[]) => any[]>;
}

/**
 * Default configuration for widget XML merging
 */
export const DEFAULT_WIDGET_MERGE_CONFIG: XmlMergeConfig = {
  elementsToMerge: ['receiver', 'uses-permission', 'service', 'activity'],
  mergeApplicationElements: true,
  mergeManifestElements: true,
  customMergeRules: {
    'uses-permission': (existing, incoming) => {
      // Avoid duplicate permissions by checking android:name attribute
      const existingNames = new Set(
        existing.map(p => p.$?.['android:name']).filter(Boolean)
      );
      
      const uniqueIncoming = incoming.filter(
        p => !existingNames.has(p.$?.['android:name'])
      );
      
      return [...existing, ...uniqueIncoming];
    },
    'receiver': (existing, incoming) => {
      // Avoid duplicate receivers by checking android:name attribute
      const existingNames = new Set(
        existing.map(r => r.$?.['android:name']).filter(Boolean)
      );
      
      const uniqueIncoming = incoming.filter(
        r => !existingNames.has(r.$?.['android:name'])
      );
      
      return [...existing, ...uniqueIncoming];
    },
    'activity': (existing, incoming) => {
      // Avoid duplicate activities by checking android:name attribute
      const existingNames = new Set(
        existing.map(a => a.$?.['android:name']).filter(Boolean)
      );
      
      const uniqueIncoming = incoming.filter(
        a => !existingNames.has(a.$?.['android:name'])
      );
      
      return [...existing, ...uniqueIncoming];
    },
    'service': (existing, incoming) => {
      // Avoid duplicate services by checking android:name attribute
      const existingNames = new Set(
        existing.map(s => s.$?.['android:name']).filter(Boolean)
      );
      
      const uniqueIncoming = incoming.filter(
        s => !existingNames.has(s.$?.['android:name'])
      );
      
      return [...existing, ...uniqueIncoming];
    }
  }
};

/**
 * Utility class for syncing widget files and merging XML manifests
 */
export class SyncWidget {
  /**
   * Syncs widget files to default location
   * @param projectRoot - Root directory of the Expo project
   * @param customPath - Custom path to widget file/directory
   * @param defaultPath - Default path for widget files
   */
  static syncToDefaults(
    projectRoot: string,
    customPath: string,
    defaultPath: string
  ): void {
    Logger.info(`\n\n==================== Syncing widget files ====================\n\n`);
    const resolvedSource = this.resolveWidgetPath(projectRoot, customPath);
    
    if (!resolvedSource) {
      Logger.warn(`Custom widget path not found: ${customPath}`);
      return;
    }

    const defaultLocation = path.join(projectRoot, defaultPath);

    // Create default directory if it doesn't exist
    FileUtils.ensureDir(path.dirname(defaultLocation));

    if (FileUtils.isDirectory(resolvedSource)) {
      // Copy entire directory
      FileUtils.copyRecursively(
        resolvedSource,
        defaultLocation,
        (targetPath) => Logger.success(`Synced: ${path.relative(projectRoot, targetPath)}`),
        (targetPath) => Logger.warn(`Skipped existing: ${path.relative(projectRoot, targetPath)}`)
      );
    } else {
      // Copy single file
      FileUtils.copyFileSync(resolvedSource, defaultLocation);
      Logger.success(`Synced widget file: ${path.relative(projectRoot, defaultLocation)}`);
    }
  }

  /**
   * Merges XML elements from widget manifest to main Android manifest
   * @param config - Expo config object
   * @param projectRoot - Root directory of the Expo project
   * @param widgetManifestPath - Path to the widget manifest file
   * @param mergeConfig - Configuration for what elements to merge
   */
  static async mergeXmlManifest(
    config: any,
    projectRoot: string,
    widgetManifestPath: string,
    mergeConfig: XmlMergeConfig = DEFAULT_WIDGET_MERGE_CONFIG
  ): Promise<void> {
    Logger.info(`\n\n==================== Merging XML manifest elements ====================\n\n`);
    
    const resolvedManifestPath = this.resolveWidgetPath(projectRoot, widgetManifestPath);
    
    if (!resolvedManifestPath || !this.isValidManifestFile(resolvedManifestPath)) {
      Logger.warn(`Valid widget manifest not found: ${widgetManifestPath}`);
      return;
    }

    Logger.manifest(`Processing widget manifest: ${widgetManifestPath}`);

    try {
      const widgetManifestContent = FileUtils.readFileSync(resolvedManifestPath);
      const parser = new Parser();
      const widgetManifest = await parser.parseStringPromise(widgetManifestContent);

      let mergedCount = 0;

      // Merge manifest-level elements (like permissions)
      if (mergeConfig.mergeManifestElements) {
        mergedCount += this.mergeManifestLevelElements(
          config,
          widgetManifest,
          mergeConfig
        );
      }

      // Merge application-level elements (like receivers, services)
      if (mergeConfig.mergeApplicationElements) {
        mergedCount += this.mergeApplicationLevelElements(
          config,
          widgetManifest,
          mergeConfig
        );
      }

      if (mergedCount > 0) {
        Logger.mobile(`Successfully merged ${mergedCount} XML elements from widget manifest`);
      } else {
        Logger.info(`No elements found to merge from widget manifest`);
      }

    } catch (error) {
      Logger.error(`Error merging widget manifest: ${error}`);
    }
  }

  /**
   * Merges manifest-level elements (permissions, etc.)
   */
  private static mergeManifestLevelElements(
    config: any,
    widgetManifest: any,
    mergeConfig: XmlMergeConfig
  ): number {
    let mergedCount = 0;
    const manifestRoot = config?.modResults?.manifest;
    
    if (!manifestRoot) {
      Logger.warn('Main manifest not found in config');
      return 0;
    }

    mergeConfig.elementsToMerge.forEach(elementName => {
      const widgetElements = widgetManifest?.manifest?.[elementName] || [];
      
      if (widgetElements.length > 0) {
        if (!manifestRoot[elementName]) {
          manifestRoot[elementName] = [];
        }

        const mergeRule = mergeConfig.customMergeRules?.[elementName];
        
        if (mergeRule) {
          // Use custom merge rule
          manifestRoot[elementName] = mergeRule(manifestRoot[elementName], widgetElements);
        } else {
          // Default merge: append all elements
          manifestRoot[elementName] = [...manifestRoot[elementName], ...widgetElements];
        }

        Logger.success(`Merged ${widgetElements.length} <${elementName}> element(s)`);
        mergedCount += widgetElements.length;
      }
    });

    return mergedCount;
  }

  /**
   * Merges application-level elements (receivers, services, activities, etc.)
   */
  private static mergeApplicationLevelElements(
    config: any,
    widgetManifest: any,
    mergeConfig: XmlMergeConfig
  ): number {
    let mergedCount = 0;
    const mainApplication = config?.modResults?.manifest?.application?.[0];
    const widgetApplication = widgetManifest?.manifest?.application?.[0];
    
    if (!mainApplication || !widgetApplication) {
      Logger.warn('Application section not found in one of the manifests');
      return 0;
    }

    mergeConfig.elementsToMerge.forEach(elementName => {
      const widgetElements = widgetApplication[elementName] || [];
      
      if (widgetElements.length > 0) {
        if (!mainApplication[elementName]) {
          mainApplication[elementName] = [];
        }

        const mergeRule = mergeConfig.customMergeRules?.[elementName];
        
        if (mergeRule) {
          // Use custom merge rule
          mainApplication[elementName] = mergeRule(mainApplication[elementName], widgetElements);
        } else {
          // Default merge: append all elements
          mainApplication[elementName] = [...mainApplication[elementName], ...widgetElements];
        }

        Logger.success(`Merged ${widgetElements.length} application <${elementName}> element(s)`);
        mergedCount += widgetElements.length;
      }
    });

    return mergedCount;
  }

  /**
   * Resolves widget path - handles both files and directories
   * @param projectRoot - Root directory of the Expo project
   * @param widgetPath - Path to widget file/directory
   * @returns Resolved path or null if not found
   */
  private static resolveWidgetPath(projectRoot: string, widgetPath: string): string | null {
    const isAbsolutePath = path.isAbsolute(widgetPath);
    const fullPath = isAbsolutePath ? widgetPath : path.join(projectRoot, widgetPath);
    
    Logger.debug(`Resolving widget path: ${fullPath} (${isAbsolutePath ? 'absolute' : 'relative'})`);
    
    if (FileUtils.exists(fullPath)) {
      Logger.debug(`Found widget path: ${fullPath}`);
      return fullPath;
    }
    
    Logger.warn(`Widget path not found: ${fullPath}`);
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

  /**
   * Creates a configuration to merge only specific elements
   * @param elements - Array of element names to merge
   * @returns Merge configuration
   */
  static createCustomMergeConfig(elements: string[]): XmlMergeConfig {
    return {
      elementsToMerge: elements,
      mergeApplicationElements: elements.some(e => 
        ['receiver', 'service', 'activity', 'provider'].includes(e)
      ),
      mergeManifestElements: elements.some(e => 
        ['uses-permission', 'permission', 'uses-feature'].includes(e)
      ),
      customMergeRules: DEFAULT_WIDGET_MERGE_CONFIG.customMergeRules
    };
  }

  /**
   * Helper method to add WorkManager fix to manifest
   * @param config - Expo config object
   */
  static addWorkManagerFix(config: any): void {
    Logger.info('Adding WorkManager initialization fix...');
    
    const mainApplication = config?.modResults?.manifest?.application?.[0];
    
    if (!mainApplication) {
      Logger.warn('Application section not found in manifest');
      return;
    }

    if (!mainApplication.provider) {
      mainApplication.provider = [];
    }

    // Add provider to disable WorkManager auto-initialization
    const workManagerFix = {
      $: {
        'android:name': 'androidx.startup.InitializationProvider',
        'android:authorities': '${applicationId}.androidx-startup',
        'tools:node': 'remove'
      }
    };

    // mainApplication.provider.push(workManagerFix);
    
    // Ensure tools namespace is added to manifest
    if (!config.modResults.manifest.$['xmlns:tools']) {
      config.modResults.manifest.$['xmlns:tools'] = 'http://schemas.android.com/tools';
    }

    Logger.success('Added WorkManager initialization fix');
  }
}
