"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResourceSync = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = require("./fs");
/**
 * Utility functions for syncing and copying resource files
 */
class ResourceSync {
    /**
     * Syncs resource files to default location
     * @param projectRoot - Root directory of the Expo project
     * @param customResPath - Custom path to resources
     * @param defaultResPath - Default path for resources
     */
    static syncToDefaults(projectRoot, customResPath, defaultResPath) {
        const sourceDir = path_1.default.join(projectRoot, customResPath);
        const defaultDir = path_1.default.join(projectRoot, defaultResPath);
        if (!fs_1.FileUtils.exists(sourceDir)) {
            fs_1.Logger.warn(`Custom resources directory not found: ${sourceDir}`);
            return;
        }
        fs_1.Logger.file(`Syncing resources to ${defaultResPath} directory...`);
        fs_1.FileUtils.copyRecursively(sourceDir, defaultDir, (targetPath) => {
            fs_1.Logger.success(`Synced resource: ${path_1.default.relative(projectRoot, targetPath)}`);
        });
    }
    /**
     * Copies resource files to Android build directory
     * @param projectRoot - Root directory of the Expo project
     * @param platformRoot - Root directory of the Android platform
     * @param resPath - Path to the resources directory
     */
    static copyToBuild(projectRoot, platformRoot, resPath) {
        const sourceResDir = path_1.default.join(projectRoot, resPath);
        if (!fs_1.FileUtils.exists(sourceResDir)) {
            fs_1.Logger.warn(`Resources directory not found: ${sourceResDir}`);
            return;
        }
        const destinationResDir = path_1.default.join(platformRoot, 'app/src/main/res');
        fs_1.Logger.file(`Copying resources from ${resPath}...`);
        // Copy resources with conflict detection
        fs_1.FileUtils.copyRecursively(sourceResDir, destinationResDir, (targetPath) => {
            fs_1.Logger.success(`Copying resource: ${path_1.default.relative(destinationResDir, targetPath)}`);
        }, (targetPath) => {
            fs_1.Logger.warn(`Resource file already exists, skipping: ${path_1.default.relative(destinationResDir, targetPath)}`);
        });
    }
}
exports.ResourceSync = ResourceSync;
