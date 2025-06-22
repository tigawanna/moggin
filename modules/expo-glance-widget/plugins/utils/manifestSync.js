"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManifestSync = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = require("./fs");
/**
 * Utility functions for syncing and processing Android manifest files
 */
class ManifestSync {
    static syncToDefaults(projectRoot, customManifestPath, defaultManifestPath) {
        const resolvedSource = this.resolveManifestPath(projectRoot, customManifestPath);
        if (!resolvedSource) {
            fs_1.Logger.warn(`Custom manifest file not found: ${customManifestPath}`);
            return;
        }
        const defaultFile = path_1.default.join(projectRoot, defaultManifestPath);
        // Create default directory if it doesn't exist
        fs_1.FileUtils.ensureDir(path_1.default.dirname(defaultFile));
        fs_1.FileUtils.copyFileSync(resolvedSource, defaultFile);
        fs_1.Logger.success(`Synced manifest: ${path_1.default.relative(projectRoot, defaultFile)}`);
    }
    /**
     * Adds widget receivers from the widget manifest to the main Android manifest
     * @param config - Expo config object
     * @param projectRoot - Root directory of the Expo project
     * @param manifestPath - Path to the widget manifest file (can be relative or absolute)
     */
    static addReceiversToMainManifest(config, projectRoot, manifestPath) {
        const resolvedManifestPath = this.resolveManifestPath(projectRoot, manifestPath);
        if (!resolvedManifestPath) {
            fs_1.Logger.warn(`Widget manifest not found: ${manifestPath}`);
            return;
        }
        fs_1.Logger.manifest(`Processing widget manifest: ${manifestPath}`);
        try {
            const widgetManifestContent = fs_1.FileUtils.readFileSync(resolvedManifestPath);
            const receivers = this.extractReceiversFromManifest(widgetManifestContent);
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
    static extractReceiversFromManifest(manifestContent) {
        const receivers = [];
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
    static parseReceiverXml(receiverXml) {
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
     * Resolves manifest path - handles both file paths with robust validation
     * @param projectRoot - Root directory of the Expo project
     * @param manifestPath - Path to manifest file (can be relative or absolute)
     * @returns Resolved path to a valid manifest file, or null if not found
     */
    static resolveManifestPath(projectRoot, manifestPath) {
        // Determine if the path is absolute or relative
        const isAbsolutePath = path_1.default.isAbsolute(manifestPath);
        const fullPath = isAbsolutePath ? manifestPath : path_1.default.join(projectRoot, manifestPath);
        fs_1.Logger.debug(`Resolving manifest path: ${fullPath} (${isAbsolutePath ? 'absolute' : 'relative'})`);
        // Check if the file exists and is a valid manifest file
        if (fs_1.FileUtils.exists(fullPath) && !fs_1.FileUtils.isDirectory(fullPath)) {
            if (this.isValidManifestFile(fullPath)) {
                fs_1.Logger.debug(`Found valid manifest file: ${fullPath}`);
                return fullPath;
            }
            else {
                fs_1.Logger.warn(`File exists but is not a valid manifest file: ${fullPath}`);
                return null;
            }
        }
        fs_1.Logger.warn(`Manifest file not found: ${fullPath}`);
        return null;
    }
    /**
     * Validates if a file is a legitimate Android manifest file
     * @param filePath - Path to the file to validate
     * @returns True if the file is a valid manifest file
     */
    static isValidManifestFile(filePath) {
        if (!filePath.toLowerCase().includes('manifest') && !filePath.endsWith('.xml')) {
            return false;
        }
        try {
            const content = fs_1.FileUtils.readFileSync(filePath);
            // Check if file content contains manifest-related keywords
            const manifestKeywords = ['<manifest', '<application', 'android:'];
            return manifestKeywords.some(keyword => content.includes(keyword));
        }
        catch {
            return false;
        }
    }
}
exports.ManifestSync = ManifestSync;
