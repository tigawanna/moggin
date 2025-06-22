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
    /**
     * Syncs manifest file to default location
     * @param projectRoot - Root directory of the Expo project
     * @param customManifestPath - Custom path to manifest file
     * @param defaultManifestPath - Default path for manifest file
     */
    static syncToDefaults(projectRoot, customManifestPath, defaultManifestPath) {
        const sourceFile = path_1.default.join(projectRoot, customManifestPath);
        const defaultFile = path_1.default.join(projectRoot, defaultManifestPath);
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
     * Adds widget receivers from the widget manifest to the main Android manifest
     * @param config - Expo config object
     * @param projectRoot - Root directory of the Expo project
     * @param manifestPath - Path to the widget manifest file
     */
    static addReceiversToMainManifest(config, projectRoot, manifestPath) {
        const widgetManifestPath = path_1.default.join(projectRoot, manifestPath);
        if (!fs_1.FileUtils.exists(widgetManifestPath)) {
            fs_1.Logger.warn(`Widget manifest not found: ${widgetManifestPath}`);
            return;
        }
        fs_1.Logger.manifest(`Processing widget manifest: ${manifestPath}`);
        try {
            const widgetManifestContent = fs_1.FileUtils.readFileSync(widgetManifestPath);
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
}
exports.ManifestSync = ManifestSync;
