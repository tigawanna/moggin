"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.importWidgetFiles = importWidgetFiles;
exports.recreateWidgetDirectories = recreateWidgetDirectories;
exports.updateWidgetFilesPackageNames = updateWidgetFilesPackageNames;
exports.inferPackageNameFromFile = inferPackageNameFromFile;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const fs_2 = require("./fs");
function importWidgetFiles({ widgetsSourceBasePath, includeDirectories = [], destinationBasePath, filesMatchPattern, destinationPackageName, sourcePackageName, }) {
    console.log(" == inludeDirectories == ", includeDirectories);
    fs_2.Logger.file(`\nFinding widget files in source path: ${widgetsSourceBasePath}\n`);
    if (!fs_1.default.existsSync(widgetsSourceBasePath)) {
        fs_2.Logger.warn(`Widgets source path does not exist: ${widgetsSourceBasePath}`);
        return;
    }
    const rootDirectoryFiles = fs_1.default.readdirSync(widgetsSourceBasePath, {
        withFileTypes: true,
    });
    if (rootDirectoryFiles.length === 0) {
        fs_2.Logger.warn(`No files found in widgets source path: ${widgetsSourceBasePath}`);
        return;
    }
    const patternRegex = filesMatchPattern ? new RegExp(filesMatchPattern) : null;
    rootDirectoryFiles.forEach((file) => {
        const sourcePath = path_1.default.join(widgetsSourceBasePath, file.name);
        const destinationPath = path_1.default.join(destinationBasePath, file.name);
        // Skip if file doesn't match pattern (if pattern exists)
        if (patternRegex && file.isFile() && !patternRegex.test(file.name)) {
            fs_2.Logger.warn(`Skipping ${file.name} - doesn't match pattern`);
            return;
        }
        if (file.isDirectory()) {
            // Process directory if it's in the include list or if no specific directories were specified
            if (includeDirectories.length === 0 || includeDirectories.includes(file.name)) {
                fs_2.Logger.file(`🚧🚧 Processing directory: ${file.name}`);
                recreateWidgetDirectories({
                    directoryToInclude: file.name,
                    widgetsSourceBasePath,
                    destinationBasePath,
                });
            }
            else {
                fs_2.Logger.warn(`Skipping directory: ${file.name} - not in include list`);
            }
        }
        else if (file.isFile()) {
            fs_2.Logger.debug(`Copying file: ${file.name} to destination`);
            ensureDirectoryExists(path_1.default.dirname(destinationPath));
            fs_1.default.copyFileSync(sourcePath, destinationPath);
        }
    });
    fs_2.Logger.success(`Widget files copied to: ${destinationBasePath}`);
    fs_2.Logger.file(`🚧🚧 Updating package names in widget files...`);
    updateWidgetFilesPackageNames({
        destinationBasePath,
        sourcePackageName,
        destinationPackageName,
    });
    fs_2.Logger.success(` Package names updated in widget files.`);
}
function recreateWidgetDirectories({ directoryToInclude, widgetsSourceBasePath, destinationBasePath, }) {
    const sourceDirectory = path_1.default.join(widgetsSourceBasePath, directoryToInclude);
    const filesInDirectory = fs_1.default.readdirSync(sourceDirectory, {
        withFileTypes: true,
    });
    if (filesInDirectory.length === 0) {
        fs_2.Logger.debug(`No files found in directory: ${sourceDirectory}`);
        return;
    }
    const destinationDirectory = path_1.default.join(destinationBasePath, directoryToInclude);
    ensureDirectoryExists(destinationDirectory);
    filesInDirectory.forEach((file) => {
        const sourcePath = path_1.default.join(sourceDirectory, file.name);
        const destinationPath = path_1.default.join(destinationDirectory, file.name);
        if (file.isDirectory()) {
            fs_2.Logger.debug(`Processing subdirectory: ${file.name}`);
            recreateWidgetDirectories({
                directoryToInclude: path_1.default.join(directoryToInclude, file.name),
                widgetsSourceBasePath,
                destinationBasePath,
            });
        }
        else {
            fs_2.Logger.debug(`Copying file: ${file.name}`);
            fs_1.default.copyFileSync(sourcePath, destinationPath);
        }
    });
}
function updateWidgetFilesPackageNames({ destinationBasePath, sourcePackageName, destinationPackageName, }) {
    if (!fs_1.default.existsSync(destinationBasePath)) {
        fs_2.Logger.warn(`Widget files directory does not exist: ${destinationBasePath}`);
        return;
    }
    const files = fs_1.default.readdirSync(destinationBasePath, { withFileTypes: true });
    if (files.length === 0) {
        fs_2.Logger.warn(`No files found in widget files directory: ${destinationBasePath}`);
        return;
    }
    // Find first valid file to infer package name
    let firstValidFile = files.find((f) => f.isFile() && f.name.endsWith(".kt"));
    if (!firstValidFile && !sourcePackageName) {
        fs_2.Logger.warn(`Could not find any .kt files in: ${destinationBasePath} to infer package name`);
        return;
    }
    const sourcePackageNameOrInferred = sourcePackageName ||
        (firstValidFile
            ? inferPackageNameFromFile(path_1.default.join(destinationBasePath, firstValidFile.name))
            : null);
    if (!sourcePackageNameOrInferred) {
        fs_2.Logger.warn(`Could not infer source package name from files in: ${destinationBasePath}. Consider passing sourcePackageName`);
        return;
    }
    processFilesForPackageUpdate(destinationBasePath, files, sourcePackageNameOrInferred, destinationPackageName);
}
function processFilesForPackageUpdate(basePath, files, sourcePackageName, destinationPackageName) {
    files.forEach((file) => {
        const filePath = path_1.default.join(basePath, file.name);
        if (file.isDirectory()) {
            updateWidgetFilesPackageNames({
                destinationBasePath: filePath,
                sourcePackageName,
                destinationPackageName,
            });
        }
        else if (file.isFile() && file.name.endsWith(".kt")) {
            fs_2.Logger.info(`Renaming package in file: ${filePath}`);
            updatePackageNameInFile(filePath, sourcePackageName, destinationPackageName);
        }
    });
}
function updatePackageNameInFile(filePath, sourcePackageName, destinationPackageName) {
    try {
        let content = fs_1.default.readFileSync(filePath, "utf8");
        const escapedSourcePackage = sourcePackageName.replace(/\./g, "\\.");
        content = content.replace(new RegExp(escapedSourcePackage, "g"), destinationPackageName);
        fs_1.default.writeFileSync(filePath, content, "utf8");
    }
    catch (error) {
        fs_2.Logger.warn(`Failed to update package name in file: ${filePath} - ${error.message}`);
    }
}
function inferPackageNameFromFile(filePath) {
    try {
        if (fs_1.default.statSync(filePath).isDirectory()) {
            return null;
        }
        const content = fs_1.default.readFileSync(filePath, "utf8");
        const match = content.match(/package\s+([a-zA-Z0-9_.]+)/);
        return match ? match[1] : null;
    }
    catch (error) {
        fs_2.Logger.warn(`Failed to infer package name from file: ${filePath} - ${error.message}`);
        return null;
    }
}
function ensureDirectoryExists(dirPath) {
    if (!fs_1.default.existsSync(dirPath)) {
        fs_2.Logger.debug(`Creating directory: ${dirPath}`);
        fs_1.default.mkdirSync(dirPath, { recursive: true });
    }
}
