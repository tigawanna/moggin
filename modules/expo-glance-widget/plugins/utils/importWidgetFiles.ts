import fs from "fs";
import path from "path";
import { Logger } from "./fs";

interface FindWidgetFilesProps {
  widgetsSourceBasePath: string;
  directoriesToInclude?: string[];
  destinationBasePath: string;
  filesMatchPattern?: string;
  destinationPackageName: string;
  sourcePackageName?: string;
}

export function findWidgetFiles({
  widgetsSourceBasePath,
  directoriesToInclude = [],
  destinationBasePath,
  filesMatchPattern,
  destinationPackageName,
  sourcePackageName,
}: FindWidgetFilesProps) {
  Logger.file(`Finding widget files in source path: ${widgetsSourceBasePath}`);

  if (!fs.existsSync(widgetsSourceBasePath)) {
    Logger.warn(`Widgets source path does not exist: ${widgetsSourceBasePath}`);
    return;
  }

  const rootDirectoryFiles = fs.readdirSync(widgetsSourceBasePath, {
    withFileTypes: true,
  });

  if (rootDirectoryFiles.length === 0) {
    Logger.warn(`No files found in widgets source path: ${widgetsSourceBasePath}`);
    return;
  }

  const patternRegex = filesMatchPattern ? new RegExp(filesMatchPattern) : null;

  rootDirectoryFiles.forEach((file) => {
    const sourcePath = path.join(widgetsSourceBasePath, file.name);
    const destinationPath = path.join(destinationBasePath, file.name);

    // Skip if file doesn't match pattern (if pattern exists)
    if (patternRegex && !patternRegex.test(file.name)) {
      Logger.warn(`Skipping ${file.name} - doesn't match pattern`);
      return;
    }

    if (file.isDirectory()) {
      // Process directory if it's in the include list or if no specific directories were specified
      if (directoriesToInclude.length === 0 || directoriesToInclude.includes(file.name)) {
        Logger.file(`🚧🚧 Processing directory: ${file.name}`);
        recreateWidgetDirectories({
          directoryToInclude: file.name,
          widgetsSourceBasePath,
          destinationBasePath,
        });
      } else {
        Logger.warn(`Skipping directory: ${file.name} - not in include list`);
      }
    } else if (file.isFile()) {
      Logger.debug(`Copying file: ${file.name} to destination`);
      ensureDirectoryExists(path.dirname(destinationPath));
      fs.copyFileSync(sourcePath, destinationPath);
    }
  });
  Logger.success(`Widget files copied to: ${destinationBasePath}`);
  Logger.file(`🚧🚧 Updating package names in widget files...`);
  updateWidgetFilesPackageNames({
    destinationBasePath,
    sourcePackageName,
    destinationPackageName,
  });
  Logger.success(` Package names updated in widget files.`);
}

interface RecreateWidgetDirectoriesProps {
  directoryToInclude: string;
  widgetsSourceBasePath: string;
  destinationBasePath: string;
}

export function recreateWidgetDirectories({
  directoryToInclude,
  widgetsSourceBasePath,
  destinationBasePath,
}: RecreateWidgetDirectoriesProps) {
  const sourceDirectory = path.join(widgetsSourceBasePath, directoryToInclude);
  const filesInDirectory = fs.readdirSync(sourceDirectory, {
    withFileTypes: true,
  });

  if (filesInDirectory.length === 0) {
    Logger.debug(`No files found in directory: ${sourceDirectory}`);
    return;
  }

  const destinationDirectory = path.join(destinationBasePath, directoryToInclude);
  ensureDirectoryExists(destinationDirectory);

  filesInDirectory.forEach((file) => {
    const sourcePath = path.join(sourceDirectory, file.name);
    const destinationPath = path.join(destinationDirectory, file.name);

    if (file.isDirectory()) {
      Logger.debug(`Processing subdirectory: ${file.name}`);
      recreateWidgetDirectories({
        directoryToInclude: path.join(directoryToInclude, file.name),
        widgetsSourceBasePath,
        destinationBasePath,
      });
    } else {
      Logger.debug(`Copying file: ${file.name}`);
      fs.copyFileSync(sourcePath, destinationPath);
    }
  });
}

interface UpdatePackageNames {
  destinationBasePath: string;
  destinationPackageName: string;
  sourcePackageName?: string;
}

export function updateWidgetFilesPackageNames({
  destinationBasePath,
  sourcePackageName,
  destinationPackageName,
}: UpdatePackageNames) {
  if (!fs.existsSync(destinationBasePath)) {
    Logger.warn(`Widget files directory does not exist: ${destinationBasePath}`);
    return;
  }

  const files = fs.readdirSync(destinationBasePath, { withFileTypes: true });
  if (files.length === 0) {
    Logger.warn(`No files found in widget files directory: ${destinationBasePath}`);
    return;
  }

  // Find first valid file to infer package name
  let firstValidFile = files.find((f) => f.isFile() && f.name.endsWith(".kt"));
  if (!firstValidFile && !sourcePackageName) {
    Logger.warn(`Could not find any .kt files in: ${destinationBasePath} to infer package name`);
    return;
  }

  const sourcePackageNameOrInferred =
    sourcePackageName ||
    (firstValidFile
      ? inferPackageNameFromFile(path.join(destinationBasePath, firstValidFile.name))
      : null);

  if (!sourcePackageNameOrInferred) {
    Logger.warn(
      `Could not infer source package name from files in: ${destinationBasePath}. Consider passing sourcePackageName`
    );
    return;
  }

  processFilesForPackageUpdate(
    destinationBasePath,
    files,
    sourcePackageNameOrInferred,
    destinationPackageName
  );
}

function processFilesForPackageUpdate(
  basePath: string,
  files: fs.Dirent[],
  sourcePackageName: string,
  destinationPackageName: string
) {
  files.forEach((file) => {
    const filePath = path.join(basePath, file.name);
    if (file.isDirectory()) {
      updateWidgetFilesPackageNames({
        destinationBasePath: filePath,
        sourcePackageName,
        destinationPackageName,
      });
    } else if (file.isFile() && file.name.endsWith(".kt")) {
      Logger.info(`Renaming package in file: ${filePath}`);
      updatePackageNameInFile(filePath, sourcePackageName, destinationPackageName);
    }
  });
}

function updatePackageNameInFile(
  filePath: string,
  sourcePackageName: string,
  destinationPackageName: string
) {
  try {
    let content = fs.readFileSync(filePath, "utf8");
    const escapedSourcePackage = sourcePackageName.replace(/\./g, "\\.");
    content = content.replace(new RegExp(escapedSourcePackage, "g"), destinationPackageName);
    fs.writeFileSync(filePath, content, "utf8");
  } catch (error:any) {
    Logger.warn(`Failed to update package name in file: ${filePath} - ${error.message}`);
  }
}

export function inferPackageNameFromFile(filePath: string): string | null {
  try {
    if (fs.statSync(filePath).isDirectory()) {
      return null;
    }
    const content = fs.readFileSync(filePath, "utf8");
    const match = content.match(/package\s+([a-zA-Z0-9_.]+)/);
    return match ? match[1] : null;
  } catch (error:any) {
    Logger.warn(`Failed to infer package name from file: ${filePath} - ${error.message}`);
    return null;
  }
}

function ensureDirectoryExists(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    Logger.debug(`Creating directory: ${dirPath}`);
    fs.mkdirSync(dirPath, { recursive: true });
  }
}
