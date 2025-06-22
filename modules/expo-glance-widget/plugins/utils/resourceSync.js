"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResourceSync = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = require("./fs");
const xml_1 = require("./xml");
/**
 * Utility functions for syncing and copying resource files
 */
class ResourceSync {
    static syncToDefaults(projectRoot, customResPath, defaultResPath) {
        const resolvedSource = this.resolveResourcePath(projectRoot, customResPath);
        if (!resolvedSource) {
            fs_1.Logger.warn(`Custom resources directory not found: ${customResPath}`);
            return;
        }
        const defaultDir = path_1.default.join(projectRoot, defaultResPath);
        fs_1.Logger.file(`Syncing resources to ${defaultResPath} directory...`);
        fs_1.FileUtils.copyRecursively(resolvedSource, defaultDir, (targetPath) => {
            fs_1.Logger.success(`Synced resource: ${path_1.default.relative(projectRoot, targetPath)}`);
        }, (targetPath, sourcePath) => {
            // Handle conflicts intelligently during sync as well
            if (path_1.default.extname(targetPath) === '.xml') {
                // Try to merge XML files instead of skipping
                const merged = xml_1.XmlUtils.mergeXmlFiles(sourcePath, targetPath, 'smart');
                if (merged) {
                    fs_1.Logger.success(`Merged XML resource during sync: ${path_1.default.relative(projectRoot, targetPath)}`);
                }
                else {
                    fs_1.Logger.warn(`Could not merge XML file during sync, skipping: ${path_1.default.relative(projectRoot, targetPath)}`);
                }
            }
            else {
                fs_1.Logger.warn(`Resource file already exists during sync, skipping: ${path_1.default.relative(projectRoot, targetPath)}`);
            }
        });
    }
    /**
     * Copies resource files to Android build directory
     * @param projectRoot - Root directory of the Expo project
     * @param platformRoot - Root directory of the Android platform
     * @param resPath - Path to the resources directory (can be relative or absolute)
     */
    static copyToBuild(projectRoot, platformRoot, resPath) {
        const resolvedSource = this.resolveResourcePath(projectRoot, resPath);
        if (!resolvedSource) {
            fs_1.Logger.warn(`Resources directory not found: ${resPath}`);
            return;
        }
        const destinationResDir = path_1.default.join(platformRoot, 'app/src/main/res');
        fs_1.Logger.file(`Copying resources from ${resPath}...`);
        // Copy resources with intelligent XML merging
        fs_1.FileUtils.copyRecursively(resolvedSource, destinationResDir, (targetPath) => {
            fs_1.Logger.success(`Copying resource: ${path_1.default.relative(destinationResDir, targetPath)}`);
        }, (targetPath, sourcePath) => {
            // Handle conflicts intelligently
            if (path_1.default.extname(targetPath) === '.xml') {
                // Try to merge XML files instead of skipping
                const merged = xml_1.XmlUtils.mergeXmlFiles(sourcePath, targetPath, 'smart');
                if (merged) {
                    fs_1.Logger.success(`Merged XML resource: ${path_1.default.relative(destinationResDir, targetPath)}`);
                }
                else {
                    fs_1.Logger.warn(`Could not merge XML file, skipping: ${path_1.default.relative(destinationResDir, targetPath)}`);
                }
            }
            else {
                fs_1.Logger.warn(`Resource file already exists, skipping: ${path_1.default.relative(destinationResDir, targetPath)}`);
            }
        });
    }
    /**
     * Resolves resource path - handles both directory paths with robust validation
     * @param projectRoot - Root directory of the Expo project
     * @param resPath - Path to resource directory (can be relative or absolute)
     * @returns Resolved path to a valid resource directory, or null if not found
     */
    static resolveResourcePath(projectRoot, resPath) {
        // Determine if the path is absolute or relative
        const isAbsolutePath = path_1.default.isAbsolute(resPath);
        const fullPath = isAbsolutePath ? resPath : path_1.default.join(projectRoot, resPath);
        fs_1.Logger.debug(`Resolving resource path: ${fullPath} (${isAbsolutePath ? 'absolute' : 'relative'})`);
        // Check if the directory exists and is valid
        if (fs_1.FileUtils.exists(fullPath) && fs_1.FileUtils.isDirectory(fullPath)) {
            if (this.isValidResourceDirectory(fullPath)) {
                fs_1.Logger.debug(`Found valid resource directory: ${fullPath}`);
                return fullPath;
            }
            else {
                fs_1.Logger.warn(`Directory exists but is not a valid resource directory: ${fullPath}`);
                return null;
            }
        }
        fs_1.Logger.warn(`Resource directory not found: ${fullPath}`);
        return null;
    }
    /**
     * Validates if a directory is a legitimate Android resources directory
     * @param dirPath - Path to the directory to validate
     * @returns True if the directory is a valid resource directory
     */
    static isValidResourceDirectory(dirPath) {
        try {
            const items = fs_1.FileUtils.readdirSync(dirPath);
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
            const hasResourceDirs = items.some(item => resourceDirPatterns.some(pattern => pattern.test(item)));
            const hasXmlFiles = items.some(item => item.endsWith('.xml'));
            return hasResourceDirs || hasXmlFiles;
        }
        catch {
            return false;
        }
    }
}
exports.ResourceSync = ResourceSync;
