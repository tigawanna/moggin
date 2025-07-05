"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WidgetClassSync = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = require("./fs");
/**
 * Utility functions for syncing widget class files
 */
class WidgetClassSync {
    /**
     * Syncs widget Kotlin class files to default location with package name updates
     * @param projectRoot - Root directory of the Expo project
     * @param customPath - Custom path to widget files
     * @param defaultPath - Default path for widget files
     * @param packageName - Target package name for the Expo project
     * @param fileMatchPattern - Pattern to match widget files (default: "Widget")
     */
    static syncToDefaults(projectRoot, customPath, defaultPath, packageName, fileMatchPattern = "Widget") {
        const resolvedSource = this.resolveWidgetPath(projectRoot, customPath);
        if (!resolvedSource) {
            fs_1.Logger.warn(`No valid widget files found at: ${customPath}`);
            return;
        }
        const defaultFile = path_1.default.join(projectRoot, defaultPath);
        const defaultTargetDir = path_1.default.dirname(defaultFile);
        // Ensure default directory exists
        fs_1.FileUtils.ensureDir(defaultTargetDir);
        const sourceDir = path_1.default.dirname(resolvedSource);
        const ktFiles = this.findWidgetFiles(sourceDir, fileMatchPattern);
        if (ktFiles.length === 0) {
            fs_1.Logger.warn(`No widget Kotlin files found in: ${sourceDir}`);
            return;
        }
        fs_1.Logger.mobile(`Syncing ${ktFiles.length} Kotlin files to ${defaultPath} directory...`);
        ktFiles.forEach((fileName) => {
            const sourcePath = path_1.default.join(sourceDir, fileName);
            const targetPath = path_1.default.join(defaultTargetDir, fileName);
            fs_1.FileUtils.copyFileSync(sourcePath, targetPath);
            // Update package name in the synced file to match Expo project
            this.updatePackageDeclaration(targetPath, packageName);
            fs_1.Logger.success(`Synced: ${fileName} → ${path_1.default.relative(projectRoot, targetPath)} (package updated)`);
        });
    }
    /**
     * Copies widget files to Android build directory from specified directories only
     * @param projectRoot - Root directory of the Expo project
     * @param platformRoot - Root directory of the Android platform
     * @param widgetFilesPath - Path to the widget class file
     * @param packageName - Android package name
     * @param fileMatchPattern - Pattern to match widget files (default: "Widget")
     * @param includeDirectories - Array of directory names relative to widget source to copy from
     */
    static copyToBuild(projectRoot, platformRoot, widgetFilesPath, packageName, fileMatchPattern = "Widget", includeDirectories = []) {
        const resolvedSource = this.resolveWidgetPath(projectRoot, widgetFilesPath);
        if (!resolvedSource) {
            fs_1.Logger.warn(`No valid widget files found at: ${widgetFilesPath}`);
            return;
        }
        const sourceDir = path_1.default.dirname(resolvedSource);
        const basePackagePath = packageName.replace(/\./g, '/');
        const destinationBaseDir = path_1.default.join(platformRoot, 'app/src/main/java', basePackagePath);
        // Ensure base destination directory exists
        fs_1.FileUtils.ensureDir(destinationBaseDir);
        let allWidgetFiles = [];
        if (includeDirectories.length > 0) {
            // Copy only from specified directories
            fs_1.Logger.mobile(`Copying from specified directories: ${includeDirectories.join(', ')}`);
            includeDirectories.forEach(dirName => {
                const targetDir = path_1.default.join(sourceDir, dirName);
                if (!fs_1.FileUtils.exists(targetDir) || !fs_1.FileUtils.isDirectory(targetDir)) {
                    fs_1.Logger.warn(`Specified directory does not exist: ${dirName}`);
                    return;
                }
                // Find widget files in this specific directory and its subdirectories
                const widgetFiles = this.findWidgetFilesInDirectory(targetDir, fileMatchPattern);
                widgetFiles.forEach(file => {
                    // Calculate relative path from the source directory to preserve subdirectory structure
                    const relativePath = path_1.default.relative(sourceDir, file);
                    allWidgetFiles.push({
                        sourcePath: file,
                        relativePath: relativePath
                    });
                });
            });
        }
        else {
            // Fallback: only copy files from the immediate source directory (no subdirectories)
            fs_1.Logger.mobile(`No target directories specified, copying from source directory only`);
            const widgetFiles = this.findWidgetFiles(sourceDir, fileMatchPattern);
            widgetFiles.forEach(fileName => {
                allWidgetFiles.push({
                    sourcePath: path_1.default.join(sourceDir, fileName),
                    relativePath: fileName
                });
            });
        }
        if (allWidgetFiles.length === 0) {
            fs_1.Logger.warn(`No widget files found matching pattern "${fileMatchPattern}"`);
            return;
        }
        fs_1.Logger.mobile(`Copying ${allWidgetFiles.length} Kotlin widget files...`);
        allWidgetFiles.forEach(({ sourcePath, relativePath }) => {
            const destinationFile = path_1.default.join(destinationBaseDir, relativePath);
            const destinationDir = path_1.default.dirname(destinationFile);
            // Ensure destination subdirectory exists
            fs_1.FileUtils.ensureDir(destinationDir);
            if (fs_1.FileUtils.exists(destinationFile)) {
                fs_1.Logger.warn(`File already exists, overwriting: ${relativePath}`);
            }
            fs_1.Logger.success(`Copying: ${relativePath}`);
            fs_1.FileUtils.copyFileSync(sourcePath, destinationFile);
            // Calculate package name including subdirectories
            const subPath = path_1.default.relative(destinationBaseDir, destinationDir);
            const fullPackageName = subPath
                ? `${packageName}.${subPath.replace(/[\\/]/g, '.')}` // Convert path separators to dots
                : packageName;
            // Update package declaration in the copied file
            this.updatePackageDeclaration(destinationFile, fullPackageName);
        });
    }
    /**
     * Resolves widget path - handles both file and directory paths with robust validation
     * @param projectRoot - Root directory of the Expo project
     * @param widgetPath - Path to widget file or directory (can be relative or absolute)
     * @returns Resolved path to a valid widget file, or null if not found
     */
    static resolveWidgetPath(projectRoot, widgetPath) {
        // Determine if the path is absolute or relative
        const isAbsolutePath = path_1.default.isAbsolute(widgetPath);
        const fullPath = isAbsolutePath ? widgetPath : path_1.default.join(projectRoot, widgetPath);
        fs_1.Logger.debug(`Resolving widget path: ${fullPath} (${isAbsolutePath ? 'absolute' : 'relative'})`);
        // If it's a file and exists, validate it's a valid widget file
        if (fs_1.FileUtils.exists(fullPath) && !fs_1.FileUtils.isDirectory(fullPath)) {
            if (this.isValidWidgetFile(fullPath)) {
                fs_1.Logger.debug(`Found valid widget file: ${fullPath}`);
                return fullPath;
            }
            else {
                fs_1.Logger.warn(`File exists but is not a valid widget file: ${fullPath}`);
                return null;
            }
        }
        // If it's a directory, look for widget files inside
        if (fs_1.FileUtils.exists(fullPath) && fs_1.FileUtils.isDirectory(fullPath)) {
            const widgetFiles = this.findWidgetFiles(fullPath, "Widget"); // Use default pattern for discovery
            if (widgetFiles.length > 0) {
                const firstWidgetFile = path_1.default.join(fullPath, widgetFiles[0]);
                fs_1.Logger.debug(`Found widget files in directory: ${widgetFiles.join(', ')}`);
                return firstWidgetFile;
            }
            else {
                fs_1.Logger.debug(`Directory exists but contains no widget files: ${fullPath}`);
            }
        }
        // Handle case where path might be invalid but we can scan for widget files
        // This is useful for complex Android Studio project structures
        if (!fs_1.FileUtils.exists(fullPath)) {
            fs_1.Logger.debug(`Path does not exist, checking if we can find widget files in nearby directories...`);
            // Try to find the closest existing parent directory
            let currentPath = fullPath;
            let attempts = 0;
            const maxAttempts = 5; // Prevent infinite loops
            while (!fs_1.FileUtils.exists(currentPath) && attempts < maxAttempts) {
                currentPath = path_1.default.dirname(currentPath);
                attempts++;
                if (fs_1.FileUtils.exists(currentPath) && fs_1.FileUtils.isDirectory(currentPath)) {
                    fs_1.Logger.debug(`Found existing parent directory: ${currentPath}`);
                    // Recursively search for widget files in this directory tree
                    const foundWidgetFile = this.recursiveWidgetSearch(currentPath, 3); // Max depth 3
                    if (foundWidgetFile) {
                        fs_1.Logger.success(`Found widget file through recursive search: ${foundWidgetFile}`);
                        return foundWidgetFile;
                    }
                }
            }
        }
        fs_1.Logger.warn(`No valid widget files found for path: ${widgetPath}`);
        return null;
    }
    /**
     * Finds Kotlin files that contain widget-related content in a directory
     * @param directory - Directory to search in
     * @param fileMatchPattern - Pattern to match widget files (default: "Widget")
     * @returns Array of widget file names, sorted by relevance
     */
    static findWidgetFiles(directory, fileMatchPattern = "Widget") {
        if (!fs_1.FileUtils.exists(directory) || !fs_1.FileUtils.isDirectory(directory)) {
            return [];
        }
        try {
            const allFiles = fs_1.FileUtils.readdirSync(directory);
            const ktFiles = allFiles.filter((file) => file.endsWith('.kt'));
            if (ktFiles.length === 0) {
                return [];
            }
            // Categorize files by widget relevance
            const definitiveWidgetFiles = [];
            const possibleWidgetFiles = [];
            ktFiles.forEach((file) => {
                const fileName = file.toLowerCase();
                const matchPattern = fileMatchPattern.toLowerCase();
                // Files with the specified pattern in the name are prioritized
                if (fileName.includes(matchPattern)) {
                    definitiveWidgetFiles.push(file);
                    return;
                }
                // Check file content for widget-related keywords
                try {
                    const filePath = path_1.default.join(directory, file);
                    const content = fs_1.FileUtils.readFileSync(filePath);
                    // Strong indicators of widget files
                    const strongKeywords = ['GlanceAppWidget', '@GlanceAppWidget', 'AppWidgetProvider'];
                    const hasStrongKeyword = strongKeywords.some(keyword => content.includes(keyword));
                    if (hasStrongKeyword) {
                        definitiveWidgetFiles.push(file);
                        return;
                    }
                    // Weaker indicators
                    const weakKeywords = ['Widget', 'AppWidget'];
                    const hasWeakKeyword = weakKeywords.some(keyword => content.includes(keyword));
                    if (hasWeakKeyword) {
                        possibleWidgetFiles.push(file);
                    }
                }
                catch (_a) {
                    // If we can't read the file, skip it
                }
            });
            // Return definitive widget files first, then possible ones
            const result = [...definitiveWidgetFiles, ...possibleWidgetFiles];
            fs_1.Logger.debug(`Found ${definitiveWidgetFiles.length} definitive and ${possibleWidgetFiles.length} possible widget files in ${directory}`);
            return result;
        }
        catch (error) {
            fs_1.Logger.error(`Error reading directory ${directory}: ${error}`);
            return [];
        }
    }
    /**
     * Finds widget files in a directory and its subdirectories
     * @param directory - Directory to search in (includes subdirectories)
     * @param fileMatchPattern - Pattern to match widget files
     * @returns Array of full paths to widget files
     */
    static findWidgetFilesInDirectory(directory, fileMatchPattern) {
        if (!fs_1.FileUtils.exists(directory) || !fs_1.FileUtils.isDirectory(directory)) {
            return [];
        }
        const widgetFiles = [];
        try {
            const traverse = (dir) => {
                const items = fs_1.FileUtils.readdirSync(dir);
                items.forEach(item => {
                    const itemPath = path_1.default.join(dir, item);
                    if (fs_1.FileUtils.isDirectory(itemPath)) {
                        // Skip common build/generated directories
                        const skipDirs = ['build', 'gradle', '.gradle', 'generated', 'intermediates', 'outputs', 'tmp'];
                        if (!skipDirs.includes(item)) {
                            traverse(itemPath);
                        }
                    }
                    else if (item.endsWith('.kt')) {
                        // Check if this is a widget file
                        const fileName = item.toLowerCase();
                        const matchPattern = fileMatchPattern.toLowerCase();
                        if (fileName.includes(matchPattern)) {
                            widgetFiles.push(itemPath);
                        }
                        else {
                            // Check file content for widget-related keywords
                            try {
                                const content = fs_1.FileUtils.readFileSync(itemPath);
                                const strongKeywords = ['GlanceAppWidget', '@GlanceAppWidget', 'AppWidgetProvider'];
                                const hasStrongKeyword = strongKeywords.some(keyword => content.includes(keyword));
                                if (hasStrongKeyword) {
                                    widgetFiles.push(itemPath);
                                }
                            }
                            catch (_a) {
                                // If we can't read the file, skip it
                            }
                        }
                    }
                });
            };
            traverse(directory);
        }
        catch (error) {
            fs_1.Logger.error(`Error traversing directory ${directory}: ${error}`);
        }
        return widgetFiles;
    }
    /**
     * Updates the package declaration in a Kotlin file
     * @param filePath - Path to the Kotlin file
     * @param packageName - New package name
     */
    static updatePackageDeclaration(filePath, packageName) {
        try {
            let content = fs_1.FileUtils.readFileSync(filePath);
            // Extract the current package name from the file
            const packageMatch = content.match(/^package\s+([^\s\n]+)/m);
            const currentPackage = packageMatch ? packageMatch[1] : null;
            if (currentPackage && currentPackage !== packageName) {
                fs_1.Logger.debug(`Updating package: ${currentPackage} → ${packageName}`);
                // Replace package declaration
                content = content.replace(/^package\s+[^\s\n]+/m, `package ${packageName}`);
                // Update imports that reference the old package
                const importRegex = new RegExp(`import\\s+${currentPackage.replace(/\./g, '\\.')}(\..*)`, 'g');
                content = content.replace(importRegex, `import ${packageName}$1`);
                fs_1.FileUtils.writeFileSync(filePath, content);
                fs_1.Logger.success(`Updated package declaration in: ${path_1.default.basename(filePath)} (${currentPackage} → ${packageName})`);
            }
            else if (!currentPackage) {
                // If no package declaration found, add one
                content = `package ${packageName}\n\n${content}`;
                fs_1.FileUtils.writeFileSync(filePath, content);
                fs_1.Logger.success(`Added package declaration to: ${path_1.default.basename(filePath)} (${packageName})`);
            }
            else {
                fs_1.Logger.debug(`Package already correct in: ${path_1.default.basename(filePath)}`);
            }
        }
        catch (error) {
            fs_1.Logger.error(`Error updating package in ${filePath}: ${error}`);
        }
    }
    /**
     * Validates if a file is a legitimate widget file
     * @param filePath - Path to the file to validate
     * @returns True if the file is a valid widget file
     */
    static isValidWidgetFile(filePath) {
        if (!filePath.endsWith('.kt')) {
            return false;
        }
        try {
            const content = fs_1.FileUtils.readFileSync(filePath);
            const fileName = path_1.default.basename(filePath);
            // Check if filename contains "Widget"
            if (fileName.toLowerCase().includes('widget')) {
                return true;
            }
            // Check if file content contains widget-related keywords
            const widgetKeywords = ['Widget', 'AppWidget', 'GlanceAppWidget', '@GlanceAppWidget'];
            return widgetKeywords.some(keyword => content.includes(keyword));
        }
        catch (_a) {
            return false;
        }
    }
    /**
     * Recursively searches for widget files in a directory tree
     * @param rootDir - Root directory to start search
     * @param maxDepth - Maximum depth to search (prevents infinite recursion)
     * @returns Path to first widget file found, or null
     */
    static recursiveWidgetSearch(rootDir, maxDepth) {
        if (maxDepth <= 0 || !fs_1.FileUtils.exists(rootDir) || !fs_1.FileUtils.isDirectory(rootDir)) {
            return null;
        }
        try {
            // First, check current directory for widget files
            const widgetFiles = this.findWidgetFiles(rootDir, "Widget"); // Use default pattern for discovery
            if (widgetFiles.length > 0) {
                return path_1.default.join(rootDir, widgetFiles[0]);
            }
            // If no widget files in current directory, search subdirectories
            const items = fs_1.FileUtils.readdirSync(rootDir);
            for (const item of items) {
                const itemPath = path_1.default.join(rootDir, item);
                if (fs_1.FileUtils.isDirectory(itemPath)) {
                    // Skip common directories that are unlikely to contain widget source files
                    const skipDirs = ['build', 'gradle', '.gradle', 'generated', 'intermediates', 'outputs', 'tmp'];
                    if (skipDirs.includes(item)) {
                        continue;
                    }
                    const result = this.recursiveWidgetSearch(itemPath, maxDepth - 1);
                    if (result) {
                        return result;
                    }
                }
            }
        }
        catch (error) {
            fs_1.Logger.debug(`Error during recursive search in ${rootDir}: ${error}`);
        }
        return null;
    }
}
exports.WidgetClassSync = WidgetClassSync;
