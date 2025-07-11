"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManifestSync = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = require("./fs");
const xml2js_1 = require("xml2js");
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
     * Adds widget receivers and permissions from the widget manifest to the main Android manifest
     * @param config - Expo config object
     * @param projectRoot - Root directory of the Expo project
     * @param manifestPath - Path to the widget manifest file (can be relative or absolute)
     */
    static addReceiversToMainManifest(config, projectRoot, manifestPath) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            const resolvedManifestPath = this.resolveManifestPath(projectRoot, manifestPath);
            if (!resolvedManifestPath) {
                fs_1.Logger.warn(`Widget manifest not found: ${manifestPath}`);
                return;
            }
            fs_1.Logger.manifest(`Processing widget manifest: ${manifestPath}`);
            try {
                const widgetManifestContent = fs_1.FileUtils.readFileSync(resolvedManifestPath);
                const parser = new xml2js_1.Parser();
                const widgetManifest = yield parser.parseStringPromise(widgetManifestContent);
                const receivers = ((_c = (_b = (_a = widgetManifest === null || widgetManifest === void 0 ? void 0 : widgetManifest.manifest) === null || _a === void 0 ? void 0 : _a.application) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.receiver) || [];
                const permissions = ((_d = widgetManifest === null || widgetManifest === void 0 ? void 0 : widgetManifest.manifest) === null || _d === void 0 ? void 0 : _d['uses-permission']) || [];
                if (receivers.length === 0 && permissions.length === 0) {
                    fs_1.Logger.info(`No <receiver> or <uses-permission> elements found in widget manifest`);
                    return;
                }
                // Add receivers to the main manifest
                const mainApplication = (_g = (_f = (_e = config === null || config === void 0 ? void 0 : config.modResults) === null || _e === void 0 ? void 0 : _e.manifest) === null || _f === void 0 ? void 0 : _f.application) === null || _g === void 0 ? void 0 : _g[0];
                if (mainApplication) {
                    if (!mainApplication.receiver) {
                        mainApplication.receiver = [];
                    }
                    receivers.forEach((receiver, index) => {
                        var _a;
                        fs_1.Logger.success(`Adding receiver ${index + 1}: ${((_a = receiver.$) === null || _a === void 0 ? void 0 : _a['android:name']) || 'unnamed'}`);
                        mainApplication.receiver.push(receiver);
                    });
                    fs_1.Logger.mobile(`Added ${receivers.length} widget receiver(s) to Android manifest`);
                }
                // Add permissions to the main manifest
                if ((_h = config === null || config === void 0 ? void 0 : config.modResults) === null || _h === void 0 ? void 0 : _h.manifest) {
                    if (!config.modResults.manifest['uses-permission']) {
                        config.modResults.manifest['uses-permission'] = [];
                    }
                    permissions.forEach((permission, index) => {
                        var _a;
                        fs_1.Logger.success(`Adding permission ${index + 1}: ${((_a = permission.$) === null || _a === void 0 ? void 0 : _a['android:name']) || 'unnamed'}`);
                        config.modResults.manifest['uses-permission'].push(permission);
                    });
                    fs_1.Logger.mobile(`Added ${permissions.length} permission(s) to Android manifest`);
                }
            }
            catch (error) {
                fs_1.Logger.error(`Error processing widget manifest: ${error}`);
            }
        });
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
        catch (_a) {
            return false;
        }
    }
}
exports.ManifestSync = ManifestSync;
