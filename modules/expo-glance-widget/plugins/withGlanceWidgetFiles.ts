import {
    AndroidConfig,
    ConfigPlugin,
    withAndroidManifest,
    withDangerousMod,
} from '@expo/config-plugins';
import path from 'path';
import { FileUtils, Logger } from './utils/fs';

/**
 * Configuration options for the Expo Glance Widgets plugin
 */
export interface WithExpoGlanceWidgetsProps {
  /** Path to the widget Kotlin class file */
  widgetClassPath: string;
  /** Path to the AndroidManifest.xml file containing widget receivers */
  manifestPath: string;
  /** Path to the Android resources directory */
  resPath: string;
}

/**
 * Default configuration options
 */
const DEFAULT_OPTIONS: WithExpoGlanceWidgetsProps = {
  widgetClassPath: "widgets/android/MyWidget.kt",
  manifestPath: "widgets/android/AndroidManifest.xml",
  resPath: "widgets/android/res",
};

/**
 * Main config plugin that copies widget files and modifies Android manifest
 * 
 * Features:
 * 1. Syncs external widget files to local default directories for version control
 * 2. Copies widget Kotlin source files to Android package structure
 * 3. Copies widget resources to main Android resources directory
 * 4. Extracts and adds widget receivers from manifest to main Android manifest
 * 
 * When using custom paths (e.g., pointing to Android Studio project):
 * - Files are first copied to default local directories (widgets/android/)
 * - This ensures widget files are checked into version control
 * - Then files are copied from the specified location to Android build
 */
export const withGlanceWidgetFiles: ConfigPlugin<Partial<WithExpoGlanceWidgetsProps>> = (
  config,
  options = {}
) => {
  const finalOptions = { ...DEFAULT_OPTIONS, ...options };

  // Copy widget source files and resources
  config = withDangerousMod(config, [
    'android',
    async (newConfig) => {
      const { modRequest } = newConfig;
      const projectRoot = modRequest.projectRoot;
      const platformRoot = modRequest.platformProjectRoot;
      const packageName = AndroidConfig.Package.getPackage(config);

      if (!packageName) {
        throw new Error(
          `ExpoGlanceWidgets: app.config must provide a value for android.package.`
        );
      }

      // First, sync external widget files to default locations for version control
      syncWidgetFilesToDefaults(projectRoot, finalOptions);

      // Copy widget Kotlin files
      copyWidgetSourceFiles(projectRoot, platformRoot, finalOptions.widgetClassPath, packageName);

      // Copy resource files
      copyResourceFiles(projectRoot, platformRoot, finalOptions.resPath);

      return newConfig;
    },
  ]);

  // Modify Android manifest to include widget receivers
  config = withAndroidManifest(config, (config) => {
    const projectRoot = config.modRequest?.projectRoot;
    if (projectRoot) {
      addWidgetReceiversToManifest(config, projectRoot, finalOptions.manifestPath);
    }
    return config;
  });

  return config;
};

/**
 * Copies widget Kotlin source files to the appropriate Android package directory
 * @param projectRoot - Root directory of the Expo project
 * @param platformRoot - Root directory of the Android platform
 * @param widgetClassPath - Path to the widget class file
 * @param packageName - Android package name
 */
function copyWidgetSourceFiles(
  projectRoot: string,
  platformRoot: string,
  widgetClassPath: string,
  packageName: string
): void {
  const sourceFilePath = path.join(projectRoot, widgetClassPath);
    if (!FileUtils.exists(sourceFilePath)) {
    Logger.warn(`Widget source file not found: ${sourceFilePath}`);
    return;
  }

  // Get destination directory based on package name
  const packagePath = packageName.replace(/\./g, '/');
  const destinationDir = path.join(platformRoot, 'app/src/main/java', packagePath);    // Ensure destination directory exists
  FileUtils.ensureDir(destinationDir);
  // Copy all .kt files from the widget directory
  const widgetDir = path.dirname(sourceFilePath);
  const ktFiles = FileUtils.readdirSync(widgetDir).filter((file: string) => file.endsWith('.kt'));

  Logger.mobile(`Copying ${ktFiles.length} Kotlin widget files...`);

  ktFiles.forEach((fileName: string) => {
    const sourceFile = path.join(widgetDir, fileName);
    const destinationFile = path.join(destinationDir, fileName);

    if (FileUtils.exists(destinationFile)) {
      Logger.warn(`File already exists, skipping: ${fileName}`);    return;
    }    Logger.success(`Copying: ${fileName}`);
    FileUtils.copyFileSync(sourceFile, destinationFile);

    // Update package declaration in the copied file
    updatePackageDeclaration(destinationFile, packageName);
  });
}

/**
 * Copies Android resource files to the main resources directory
 * @param projectRoot - Root directory of the Expo project
 * @param platformRoot - Root directory of the Android platform
 * @param resPath - Path to the resources directory
 */
function copyResourceFiles(
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
  copyResourcesRecursively(sourceResDir, destinationResDir);
}

/**
 * Recursively copies resources while detecting conflicts
 * @param sourceDir - Source directory
 * @param destDir - Destination directory
 */
function copyResourcesRecursively(sourceDir: string, destDir: string): void {
  FileUtils.ensureDir(destDir);
  const items = FileUtils.readdirSync(sourceDir);

  items.forEach((item: string) => {
    const sourcePath = path.join(sourceDir, item);
    const destPath = path.join(destDir, item);    if (FileUtils.isDirectory(sourcePath)) {
      copyResourcesRecursively(sourcePath, destPath);
    } else {
      if (FileUtils.exists(destPath)) {
        Logger.warn(`Resource file already exists, skipping: ${path.relative(destDir, destPath)}`);
        return;
      }      Logger.success(`Copying resource: ${path.relative(destDir, destPath)}`);
      FileUtils.copyFileSync(sourcePath, destPath);
    }
  });
}

/**
 * Adds widget receivers from the widget manifest to the main Android manifest
 * @param config - Expo config object
 * @param projectRoot - Root directory of the Expo project
 * @param manifestPath - Path to the widget manifest file
 */
function addWidgetReceiversToManifest(
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
    const receivers = extractReceiversFromManifest(widgetManifestContent);    if (receivers.length === 0) {
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

      Logger.mobile(`Added ${receivers.length} widget receiver(s) to Android manifest`);    }
  } catch (error) {
    Logger.error(`Error processing widget manifest: ${error}`);
  }
}

/**
 * Extracts receiver elements from an Android manifest XML string
 * @param manifestContent - XML content of the manifest
 * @returns Array of receiver objects
 */
function extractReceiversFromManifest(manifestContent: string): any[] {
  const receivers: any[] = [];
  
  // Simple regex to extract receiver blocks (basic implementation)
  // In a production environment, you might want to use a proper XML parser
  const receiverRegex = /<receiver[^>]*>[\s\S]*?<\/receiver>/g;
  const matches = manifestContent.match(receiverRegex);

  if (matches) {
    matches.forEach(receiverXml => {
      // Parse basic receiver attributes and children
      const receiver = parseReceiverXml(receiverXml);
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
function parseReceiverXml(receiverXml: string): any {
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

/**
 * Updates the package declaration in a Kotlin file
 * @param filePath - Path to the Kotlin file
 * @param packageName - New package name
 */
function updatePackageDeclaration(filePath: string, packageName: string): void {
  try {
    let content = FileUtils.readFileSync(filePath);
    
    // Replace package declaration
    content = content.replace(/^package\s+[^\s\n]+/, `package ${packageName}`);
    
    // Update imports that reference the old package (basic replacement)
    // You might want to make this more sophisticated based on your needs
    content = content.replace(/import\s+com\.anonymous\.moggin/g, `import ${packageName}`);
    
    FileUtils.writeFileSync(filePath, content);
    Logger.success(`Updated package declaration in: ${path.basename(filePath)}`);
  } catch (error) {
    Logger.error(`Error updating package in ${filePath}: ${error}`);
  }
}

/**
 * Syncs external widget files to local default directories for version control
 * @param projectRoot - Root directory of the Expo project
 * @param options - Plugin configuration options
 */
function syncWidgetFilesToDefaults(
  projectRoot: string,
  options: WithExpoGlanceWidgetsProps
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
  syncWidgetClassFiles(projectRoot, options);

  // Sync manifest file
  syncManifestFile(projectRoot, options);

  // Sync resource files
  syncResourceFiles(projectRoot, options);
}

/**
 * Syncs widget Kotlin class files to default location
 */
function syncWidgetClassFiles(
  projectRoot: string,
  options: WithExpoGlanceWidgetsProps
): void {
  const sourceFile = path.join(projectRoot, options.widgetClassPath);
  const defaultFile = path.join(projectRoot, DEFAULT_OPTIONS.widgetClassPath);

  if (!FileUtils.exists(sourceFile)) {
    Logger.warn(`Custom widget class file not found: ${sourceFile}`);
    return;
  }

  // Create default directory if it doesn't exist
  const defaultDir = path.dirname(defaultFile);
  FileUtils.ensureDir(defaultDir);

  // Also sync all .kt files in the same directory
  const sourceDir = path.dirname(sourceFile);
  const defaultTargetDir = path.dirname(defaultFile);

  try {
    const ktFiles = FileUtils.readdirSync(sourceDir).filter((file: string) => file.endsWith('.kt'));
    
    Logger.mobile(`Syncing ${ktFiles.length} Kotlin files to ${DEFAULT_OPTIONS.widgetClassPath} directory...`);

    ktFiles.forEach((fileName: string) => {
      const sourcePath = path.join(sourceDir, fileName);
      const targetPath = path.join(defaultTargetDir, fileName);

      FileUtils.copyFileSync(sourcePath, targetPath);
      Logger.success(`Synced: ${fileName} → ${path.relative(projectRoot, targetPath)}`);
    });
  } catch (error) {
    Logger.error(`Error syncing widget class files: ${error}`);
  }
}

/**
 * Syncs manifest file to default location
 */
function syncManifestFile(
  projectRoot: string,
  options: WithExpoGlanceWidgetsProps
): void {
  const sourceFile = path.join(projectRoot, options.manifestPath);
  const defaultFile = path.join(projectRoot, DEFAULT_OPTIONS.manifestPath);

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
 * Syncs resource files to default location
 */
function syncResourceFiles(
  projectRoot: string,
  options: WithExpoGlanceWidgetsProps
): void {
  const sourceDir = path.join(projectRoot, options.resPath);
  const defaultDir = path.join(projectRoot, DEFAULT_OPTIONS.resPath);

  if (!FileUtils.exists(sourceDir)) {
    Logger.warn(`Custom resources directory not found: ${sourceDir}`);
    return;
  }

  Logger.file(`Syncing resources to ${DEFAULT_OPTIONS.resPath} directory...`);
  syncResourcesRecursively(sourceDir, defaultDir, projectRoot);
}

/**
 * Recursively syncs resources to default location
 */
function syncResourcesRecursively(
  sourceDir: string,
  targetDir: string,
  projectRoot: string
): void {
  FileUtils.ensureDir(targetDir);
  const items = FileUtils.readdirSync(sourceDir);

  items.forEach((item: string) => {
    const sourcePath = path.join(sourceDir, item);
    const targetPath = path.join(targetDir, item);

    if (FileUtils.isDirectory(sourcePath)) {
      syncResourcesRecursively(sourcePath, targetPath, projectRoot);
    } else {
      FileUtils.copyFileSync(sourcePath, targetPath);
      Logger.success(`Synced resource: ${path.relative(projectRoot, targetPath)}`);
    }
  });
}

export default withGlanceWidgetFiles;
