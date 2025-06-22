"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.withGlanceWidgetFiles = void 0;
const config_plugins_1 = require("@expo/config-plugins");
const path_1 = __importDefault(require("path"));
const fs_1 = require("./utils/fs");
/**
 * Default configuration options
 */
const DEFAULT_OPTIONS = {
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
const withGlanceWidgetFiles = (config, options = {}) => {
    const finalOptions = { ...DEFAULT_OPTIONS, ...options };
    // Copy widget source files and resources
    config = (0, config_plugins_1.withDangerousMod)(config, [
        'android',
        async (newConfig) => {
            const { modRequest } = newConfig;
            const projectRoot = modRequest.projectRoot;
            const platformRoot = modRequest.platformProjectRoot;
            const packageName = config_plugins_1.AndroidConfig.Package.getPackage(config);
            if (!packageName) {
                throw new Error(`ExpoGlanceWidgets: app.config must provide a value for android.package.`);
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
    config = (0, config_plugins_1.withAndroidManifest)(config, (config) => {
        const projectRoot = config.modRequest?.projectRoot;
        if (projectRoot) {
            addWidgetReceiversToManifest(config, projectRoot, finalOptions.manifestPath);
        }
        return config;
    });
    return config;
};
exports.withGlanceWidgetFiles = withGlanceWidgetFiles;
/**
 * Copies widget Kotlin source files to the appropriate Android package directory
 * @param projectRoot - Root directory of the Expo project
 * @param platformRoot - Root directory of the Android platform
 * @param widgetClassPath - Path to the widget class file
 * @param packageName - Android package name
 */
function copyWidgetSourceFiles(projectRoot, platformRoot, widgetClassPath, packageName) {
    const sourceFilePath = path_1.default.join(projectRoot, widgetClassPath);
    if (!fs_1.FileUtils.exists(sourceFilePath)) {
        fs_1.Logger.warn(`Widget source file not found: ${sourceFilePath}`);
        return;
    }
    // Get destination directory based on package name
    const packagePath = packageName.replace(/\./g, '/');
    const destinationDir = path_1.default.join(platformRoot, 'app/src/main/java', packagePath); // Ensure destination directory exists
    fs_1.FileUtils.ensureDir(destinationDir);
    // Copy all .kt files from the widget directory
    const widgetDir = path_1.default.dirname(sourceFilePath);
    const ktFiles = fs_1.FileUtils.readdirSync(widgetDir).filter((file) => file.endsWith('.kt'));
    fs_1.Logger.mobile(`Copying ${ktFiles.length} Kotlin widget files...`);
    ktFiles.forEach((fileName) => {
        const sourceFile = path_1.default.join(widgetDir, fileName);
        const destinationFile = path_1.default.join(destinationDir, fileName);
        if (fs_1.FileUtils.exists(destinationFile)) {
            fs_1.Logger.warn(`File already exists, skipping: ${fileName}`);
            return;
        }
        fs_1.Logger.success(`Copying: ${fileName}`);
        fs_1.FileUtils.copyFileSync(sourceFile, destinationFile);
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
function copyResourceFiles(projectRoot, platformRoot, resPath) {
    const sourceResDir = path_1.default.join(projectRoot, resPath);
    if (!fs_1.FileUtils.exists(sourceResDir)) {
        fs_1.Logger.warn(`Resources directory not found: ${sourceResDir}`);
        return;
    }
    const destinationResDir = path_1.default.join(platformRoot, 'app/src/main/res');
    fs_1.Logger.file(`Copying resources from ${resPath}...`);
    // Copy resources with conflict detection
    copyResourcesRecursively(sourceResDir, destinationResDir);
}
/**
 * Recursively copies resources while detecting conflicts
 * @param sourceDir - Source directory
 * @param destDir - Destination directory
 */
function copyResourcesRecursively(sourceDir, destDir) {
    fs_1.FileUtils.ensureDir(destDir);
    const items = fs_1.FileUtils.readdirSync(sourceDir);
    items.forEach((item) => {
        const sourcePath = path_1.default.join(sourceDir, item);
        const destPath = path_1.default.join(destDir, item);
        if (fs_1.FileUtils.isDirectory(sourcePath)) {
            copyResourcesRecursively(sourcePath, destPath);
        }
        else {
            if (fs_1.FileUtils.exists(destPath)) {
                fs_1.Logger.warn(`Resource file already exists, skipping: ${path_1.default.relative(destDir, destPath)}`);
                return;
            }
            fs_1.Logger.success(`Copying resource: ${path_1.default.relative(destDir, destPath)}`);
            fs_1.FileUtils.copyFileSync(sourcePath, destPath);
        }
    });
}
/**
 * Adds widget receivers from the widget manifest to the main Android manifest
 * @param config - Expo config object
 * @param projectRoot - Root directory of the Expo project
 * @param manifestPath - Path to the widget manifest file
 */
function addWidgetReceiversToManifest(config, projectRoot, manifestPath) {
    const widgetManifestPath = path_1.default.join(projectRoot, manifestPath);
    if (!fs_1.FileUtils.exists(widgetManifestPath)) {
        fs_1.Logger.warn(`Widget manifest not found: ${widgetManifestPath}`);
        return;
    }
    fs_1.Logger.manifest(`Processing widget manifest: ${manifestPath}`);
    try {
        const widgetManifestContent = fs_1.FileUtils.readFileSync(widgetManifestPath);
        const receivers = extractReceiversFromManifest(widgetManifestContent);
        if (receivers.length === 0) {
            fs_1.Logger.info(`No <receiver> elements found in widget manifest`);
            return;
        }
        // Add receivers to the main manifest
        const mainApplication = config?.modResults?.manifest?.application?.[0];
        if (mainApplication) {
            if (!mainApplication.receiver) {
                mainApplication.receiver = [];
            }
            receivers.forEach((receiver, index) => {
                fs_1.Logger.success(`Adding receiver ${index + 1}: ${receiver.$?.['android:name'] || 'unnamed'}`);
                mainApplication.receiver.push(receiver);
            });
            fs_1.Logger.mobile(`Added ${receivers.length} widget receiver(s) to Android manifest`);
        }
    }
    catch (error) {
        fs_1.Logger.error(`Error processing widget manifest: ${error}`);
    }
}
/**
 * Extracts receiver elements from an Android manifest XML string
 * @param manifestContent - XML content of the manifest
 * @returns Array of receiver objects
 */
function extractReceiversFromManifest(manifestContent) {
    const receivers = [];
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
function parseReceiverXml(receiverXml) {
    // This is a simplified parser - in production, use a proper XML parser
    const nameMatch = receiverXml.match(/android:name="([^"]*)"/);
    const exportedMatch = receiverXml.match(/android:exported="([^"]*)"/);
    const receiver = {
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
            const result = { $: {} };
            if (nameMatch)
                result.$['android:name'] = nameMatch[1];
            if (resourceMatch)
                result.$['android:resource'] = resourceMatch[1];
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
function updatePackageDeclaration(filePath, packageName) {
    try {
        let content = fs_1.FileUtils.readFileSync(filePath);
        // Replace package declaration
        content = content.replace(/^package\s+[^\s\n]+/, `package ${packageName}`);
        // Update imports that reference the old package (basic replacement)
        // You might want to make this more sophisticated based on your needs
        content = content.replace(/import\s+com\.anonymous\.moggin/g, `import ${packageName}`);
        fs_1.FileUtils.writeFileSync(filePath, content);
        fs_1.Logger.success(`Updated package declaration in: ${path_1.default.basename(filePath)}`);
    }
    catch (error) {
        fs_1.Logger.error(`Error updating package in ${filePath}: ${error}`);
    }
}
/**
 * Syncs external widget files to local default directories for version control
 * @param projectRoot - Root directory of the Expo project
 * @param options - Plugin configuration options
 */
function syncWidgetFilesToDefaults(projectRoot, options) {
    fs_1.Logger.debug('Checking if widget files need to be synced to defaults...');
    // Check if user is using non-default paths
    const usingCustomPaths = options.widgetClassPath !== DEFAULT_OPTIONS.widgetClassPath ||
        options.manifestPath !== DEFAULT_OPTIONS.manifestPath ||
        options.resPath !== DEFAULT_OPTIONS.resPath;
    if (!usingCustomPaths) {
        fs_1.Logger.debug('Using default paths, no sync needed');
        return;
    }
    fs_1.Logger.info('Custom widget paths detected, syncing to default locations for version control...');
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
function syncWidgetClassFiles(projectRoot, options) {
    const sourceFile = path_1.default.join(projectRoot, options.widgetClassPath);
    const defaultFile = path_1.default.join(projectRoot, DEFAULT_OPTIONS.widgetClassPath);
    if (!fs_1.FileUtils.exists(sourceFile)) {
        fs_1.Logger.warn(`Custom widget class file not found: ${sourceFile}`);
        return;
    }
    // Create default directory if it doesn't exist
    const defaultDir = path_1.default.dirname(defaultFile);
    fs_1.FileUtils.ensureDir(defaultDir);
    // Also sync all .kt files in the same directory
    const sourceDir = path_1.default.dirname(sourceFile);
    const defaultTargetDir = path_1.default.dirname(defaultFile);
    try {
        const ktFiles = fs_1.FileUtils.readdirSync(sourceDir).filter((file) => file.endsWith('.kt'));
        fs_1.Logger.mobile(`Syncing ${ktFiles.length} Kotlin files to ${DEFAULT_OPTIONS.widgetClassPath} directory...`);
        ktFiles.forEach((fileName) => {
            const sourcePath = path_1.default.join(sourceDir, fileName);
            const targetPath = path_1.default.join(defaultTargetDir, fileName);
            fs_1.FileUtils.copyFileSync(sourcePath, targetPath);
            fs_1.Logger.success(`Synced: ${fileName} → ${path_1.default.relative(projectRoot, targetPath)}`);
        });
    }
    catch (error) {
        fs_1.Logger.error(`Error syncing widget class files: ${error}`);
    }
}
/**
 * Syncs manifest file to default location
 */
function syncManifestFile(projectRoot, options) {
    const sourceFile = path_1.default.join(projectRoot, options.manifestPath);
    const defaultFile = path_1.default.join(projectRoot, DEFAULT_OPTIONS.manifestPath);
    if (!fs_1.FileUtils.exists(sourceFile)) {
        fs_1.Logger.warn(`Custom manifest file not found: ${sourceFile}`);
        return;
    }
    // Create default directory if it doesn't exist
    fs_1.FileUtils.ensureDir(path_1.default.dirname(defaultFile));
    fs_1.FileUtils.copyFileSync(sourceFile, defaultFile);
    fs_1.Logger.success(`Synced manifest: ${path_1.default.relative(projectRoot, defaultFile)}`);
}
/**
 * Syncs resource files to default location
 */
function syncResourceFiles(projectRoot, options) {
    const sourceDir = path_1.default.join(projectRoot, options.resPath);
    const defaultDir = path_1.default.join(projectRoot, DEFAULT_OPTIONS.resPath);
    if (!fs_1.FileUtils.exists(sourceDir)) {
        fs_1.Logger.warn(`Custom resources directory not found: ${sourceDir}`);
        return;
    }
    fs_1.Logger.file(`Syncing resources to ${DEFAULT_OPTIONS.resPath} directory...`);
    syncResourcesRecursively(sourceDir, defaultDir, projectRoot);
}
/**
 * Recursively syncs resources to default location
 */
function syncResourcesRecursively(sourceDir, targetDir, projectRoot) {
    fs_1.FileUtils.ensureDir(targetDir);
    const items = fs_1.FileUtils.readdirSync(sourceDir);
    items.forEach((item) => {
        const sourcePath = path_1.default.join(sourceDir, item);
        const targetPath = path_1.default.join(targetDir, item);
        if (fs_1.FileUtils.isDirectory(sourcePath)) {
            syncResourcesRecursively(sourcePath, targetPath, projectRoot);
        }
        else {
            fs_1.FileUtils.copyFileSync(sourcePath, targetPath);
            fs_1.Logger.success(`Synced resource: ${path_1.default.relative(projectRoot, targetPath)}`);
        }
    });
}
exports.default = exports.withGlanceWidgetFiles;
