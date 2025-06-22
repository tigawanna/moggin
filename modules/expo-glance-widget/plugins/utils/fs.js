"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = exports.FileUtils = void 0;
const fs = __importStar(require("fs"));
const path_1 = __importDefault(require("path"));
/**
 * File system utilities for Expo Glance Widget plugin operations
 */
class FileUtils {
    /**
     * Copy file safely, creating destination directory if needed
     * @param src - Source file path
     * @param dest - Destination file path
     */
    static copyFileSync(src, dest) {
        const destDir = path_1.default.dirname(dest);
        if (!fs.existsSync(destDir)) {
            fs.mkdirSync(destDir, { recursive: true });
        }
        fs.copyFileSync(src, dest);
    }
    /**
     * Check if path exists and is a directory
     * @param filePath - Path to check
     * @returns True if path exists and is a directory
     */
    static isDirectory(filePath) {
        try {
            return fs.lstatSync(filePath).isDirectory();
        }
        catch {
            return false;
        }
    }
    /**
     * Ensure directory exists, creating it recursively if needed
     * @param dirPath - Directory path to ensure
     */
    static ensureDir(dirPath) {
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }
    }
    /**
     * Check if file exists
     * @param filePath - File path to check
     * @returns True if file exists
     */
    static exists(filePath) {
        return fs.existsSync(filePath);
    }
    /**
     * Read file content as UTF-8 string
     * @param filePath - Path to file
     * @returns File content as string
     */
    static readFileSync(filePath) {
        return fs.readFileSync(filePath, 'utf-8');
    }
    /**
     * Write string content to file
     * @param filePath - Path to file
     * @param content - Content to write
     */
    static writeFileSync(filePath, content) {
        fs.writeFileSync(filePath, content, 'utf-8');
    }
    /**
     * Read directory contents
     * @param dirPath - Directory path
     * @returns Array of file/directory names
     */
    static readdirSync(dirPath) {
        return fs.readdirSync(dirPath);
    }
}
exports.FileUtils = FileUtils;
/**
 * Logger utility with emoji prefixes for better visual feedback
 */
class Logger {
    static info(message) {
        console.log(`ℹ️  ${message}`);
    }
    static success(message) {
        console.log(`✅ ${message}`);
    }
    static warn(message) {
        console.warn(`⚠️  ${message}`);
    }
    static error(message) {
        console.error(`❌ ${message}`);
    }
    static debug(message) {
        console.log(`🔍 ${message}`);
    }
    static file(message) {
        console.log(`📁 ${message}`);
    }
    static mobile(message) {
        console.log(`📱 ${message}`);
    }
    static manifest(message) {
        console.log(`📄 ${message}`);
    }
}
exports.Logger = Logger;
