import path from "path";
import { FileUtils, Logger } from "./fs";
import { importWidgetFiles } from "./importWidgetFiles";

interface CopyToProps {
  projectRoot: string;
  platformRoot: string;
  widgetFilesPath: string;
  packageName: string;
  fileMatchPattern?: string;
  includeDirectories?: string[];
  projectAndroidRoot: string;
  /**
   * used as the default source path if widgetFilesPath is not provided
   * if widgets file paths is external to the project the files will be duplicated here
   * @default "widgets/android"
   *
   */
  defaultSourcePath?: string;
}

/**
 * Utility functions for syncing widget class files
 */
export class WidgetFilesSync {
  /**
   * Syncs widget Kotlin class files to default location with package name updates
   */
  static syncToDefaults({
    projectRoot,
    widgetFilesPath,
    includeDirectories,
    defaultSourcePath = "widgets/android",
    packageName,
    fileMatchPattern = "Widget",
  }: Omit<CopyToProps, "projectAndroidRoot">): void {
    Logger.info(
      `\n\n==================== Syncing widget files to default location ====================\n\n`
    );
    if (FileUtils.exists(widgetFilesPath)) {
      Logger.warn(`widgetFilesPath should be a directory, but found a file: ${widgetFilesPath}`);
      return;
    }
    const resolvedSource = this.resolveWidgetPath(projectRoot, widgetFilesPath);

    if (!resolvedSource) {
      Logger.warn(`No valid widget files found at: ${widgetFilesPath}`);
      return;
    }
    if (!resolvedSource) {
      Logger.warn(`No valid widget files found at: ${widgetFilesPath}`);
      return;
    }

    const sourceDir = path.dirname(resolvedSource);

    if (!FileUtils.exists(sourceDir)) {
      Logger.warn(`Source directory does not exist: ${sourceDir}`);
      return;
    }
    const destinationBaseDir = path.join(projectRoot, defaultSourcePath);

    importWidgetFiles({
      includeDirectories: includeDirectories || [],
      widgetsSourceBasePath: sourceDir,
      destinationBasePath: destinationBaseDir,
      filesMatchPattern: fileMatchPattern,
      destinationPackageName: packageName,
    });
  }

  /**
   * Copies widget files to Android build directory from specified directories only

   */
  static copyToBuild({
    packageName,
    widgetFilesPath,
    includeDirectories,
    projectAndroidRoot,
    projectRoot,
    fileMatchPattern,
  }: CopyToProps): void {
    Logger.info(
      `\n\n\==================== Copying widget files to build location ====================\n\n`
    );

    const resolvedSource = this.resolveWidgetPath(projectRoot, widgetFilesPath);

    if (!resolvedSource || !FileUtils.exists(resolvedSource)) {
      Logger.warn(`No valid widget files found at: ${widgetFilesPath}`);
      return;
    }

    const sourceDir = path.dirname(resolvedSource);
    const packageNameAsPath = packageName.replace(/\./g, "/");
    const destinationBaseDir = path.join(projectRoot, projectAndroidRoot, "app/src/main/java", packageNameAsPath);

    importWidgetFiles({
      includeDirectories: includeDirectories || [],
      widgetsSourceBasePath: sourceDir,
      destinationBasePath: destinationBaseDir,
      filesMatchPattern: fileMatchPattern,
      destinationPackageName: packageName,
    });
  }

  /**
   * Resolves widget path - handles both file and directory paths with robust validation
   * @param projectRoot - Root directory of the Expo project
   * @param widgetPath - Path to widget file or directory (can be relative or absolute)
   * @returns Resolved path to a valid widget file, or null if not found
   */
  static resolveWidgetPath(projectRoot: string, widgetPath: string): string | null {
    // Determine if the path is absolute or relative
    const isAbsolutePath = path.isAbsolute(widgetPath);
    const fullPath = isAbsolutePath ? widgetPath : path.join(projectRoot, widgetPath);

    Logger.debug(
      `Resolving widget path: ${fullPath} (${isAbsolutePath ? "absolute" : "relative"})`
    );

    // If it's a file and exists, validate it's a valid widget file
    if (FileUtils.exists(fullPath) && !FileUtils.isDirectory(fullPath)) {
      if (this.isValidWidgetFile(fullPath)) {
        Logger.debug(`Found valid widget file: ${fullPath}`);
        return fullPath;
      } else {
        Logger.warn(`File exists but is not a valid widget file: ${fullPath}`);
        return null;
      }
    }

    // If it's a directory, look for widget files inside
    if (FileUtils.exists(fullPath) && FileUtils.isDirectory(fullPath)) {
      const widgetFiles = this.findWidgetFiles(fullPath, "Widget"); // Use default pattern for discovery
      if (widgetFiles.length > 0) {
        const firstWidgetFile = path.join(fullPath, widgetFiles[0]);
        Logger.debug(`Found widget files in directory: ${widgetFiles.join(", ")}`);
        return firstWidgetFile;
      } else {
        Logger.debug(`Directory exists but contains no widget files: ${fullPath}`);
      }
    }

    // Handle case where path might be invalid but we can scan for widget files
    // This is useful for complex Android Studio project structures
    if (!FileUtils.exists(fullPath)) {
      Logger.debug(
        `Path does not exist, checking if we can find widget files in nearby directories...`
      );

      // Try to find the closest existing parent directory
      let currentPath = fullPath;
      let attempts = 0;
      const maxAttempts = 5; // Prevent infinite loops

      while (!FileUtils.exists(currentPath) && attempts < maxAttempts) {
        currentPath = path.dirname(currentPath);
        attempts++;

        if (FileUtils.exists(currentPath) && FileUtils.isDirectory(currentPath)) {
          Logger.debug(`Found existing parent directory: ${currentPath}`);

          // Recursively search for widget files in this directory tree
          const foundWidgetFile = this.recursiveWidgetSearch(currentPath, 3); // Max depth 3
          if (foundWidgetFile) {
            Logger.success(`Found widget file through recursive search: ${foundWidgetFile}`);
            return foundWidgetFile;
          }
        }
      }
    }

    Logger.warn(`No valid widget files found for path: ${widgetPath}`);
    return null;
  }

  /**
   * Finds Kotlin files that contain widget-related content in a directory
   * @param directory - Directory to search in
   * @param fileMatchPattern - Pattern to match widget files (default: "Widget")
   * @returns Array of widget file names, sorted by relevance
   */
  private static findWidgetFiles(directory: string, fileMatchPattern: string = "Widget"): string[] {
    if (!FileUtils.exists(directory) || !FileUtils.isDirectory(directory)) {
      return [];
    }

    try {
      const allFiles = FileUtils.readdirSync(directory);
      const ktFiles = allFiles.filter((file: string) => file.endsWith(".kt"));

      if (ktFiles.length === 0) {
        return [];
      }

      // Categorize files by widget relevance
      const definitiveWidgetFiles: string[] = [];
      const possibleWidgetFiles: string[] = [];

      ktFiles.forEach((file: string) => {
        const fileName = file.toLowerCase();
        const matchPattern = fileMatchPattern.toLowerCase();

        // Files with the specified pattern in the name are prioritized
        if (fileName.includes(matchPattern)) {
          definitiveWidgetFiles.push(file);
          return;
        }

        // Check file content for widget-related keywords
        try {
          const filePath = path.join(directory, file);
          const content = FileUtils.readFileSync(filePath);

          // Strong indicators of widget files
          const strongKeywords = ["GlanceAppWidget", "@GlanceAppWidget", "AppWidgetProvider"];
          const hasStrongKeyword = strongKeywords.some((keyword) => content.includes(keyword));

          if (hasStrongKeyword) {
            definitiveWidgetFiles.push(file);
            return;
          }

          // Weaker indicators
          const weakKeywords = ["Widget", "AppWidget"];
          const hasWeakKeyword = weakKeywords.some((keyword) => content.includes(keyword));

          if (hasWeakKeyword) {
            possibleWidgetFiles.push(file);
          }
        } catch {
          // If we can't read the file, skip it
        }
      });

      // Return definitive widget files first, then possible ones
      const result = [...definitiveWidgetFiles, ...possibleWidgetFiles];

      Logger.debug(
        `Found ${definitiveWidgetFiles.length} definitive and ${possibleWidgetFiles.length} possible widget files in ${directory}`
      );

      return result;
    } catch (error) {
      Logger.error(`Error reading directory ${directory}: ${error}`);
      return [];
    }
  }

  /**
   * Finds widget files in a directory and its subdirectories
   * @param directory - Directory to search in (includes subdirectories)
   * @param fileMatchPattern - Pattern to match widget files
   * @returns Array of full paths to widget files
   */
  private static findWidgetFilesInDirectory(directory: string, fileMatchPattern: string): string[] {
    if (!FileUtils.exists(directory) || !FileUtils.isDirectory(directory)) {
      return [];
    }

    const widgetFiles: string[] = [];

    try {
      const traverse = (dir: string): void => {
        const items = FileUtils.readdirSync(dir);

        items.forEach((item) => {
          const itemPath = path.join(dir, item);

          if (FileUtils.isDirectory(itemPath)) {
            // Skip common build/generated directories
            const skipDirs = [
              "build",
              "gradle",
              ".gradle",
              "generated",
              "intermediates",
              "outputs",
              "tmp",
            ];
            if (!skipDirs.includes(item)) {
              traverse(itemPath);
            }
          } else if (item.endsWith(".kt")) {
            // Check if this is a widget file
            const fileName = item.toLowerCase();
            const matchPattern = fileMatchPattern.toLowerCase();

            if (fileName.includes(matchPattern)) {
              widgetFiles.push(itemPath);
            } else {
              // Check file content for widget-related keywords
              try {
                const content = FileUtils.readFileSync(itemPath);
                const strongKeywords = ["GlanceAppWidget", "@GlanceAppWidget", "AppWidgetProvider"];
                const hasStrongKeyword = strongKeywords.some((keyword) =>
                  content.includes(keyword)
                );

                if (hasStrongKeyword) {
                  widgetFiles.push(itemPath);
                }
              } catch {
                // If we can't read the file, skip it
              }
            }
          }
        });
      };

      traverse(directory);
    } catch (error) {
      Logger.error(`Error traversing directory ${directory}: ${error}`);
    }

    return widgetFiles;
  }

  /**
   * Updates the package declaration in a Kotlin file
   * @param filePath - Path to the Kotlin file
   * @param packageName - New package name
   */
  private static updatePackageDeclaration(filePath: string, packageName: string): void {
    try {
      let content = FileUtils.readFileSync(filePath);

      // Extract the current package name from the file
      const packageMatch = content.match(/^package\s+([^\s\n]+)/m);
      const currentPackage = packageMatch ? packageMatch[1] : null;

      if (currentPackage && currentPackage !== packageName) {
        Logger.debug(`Updating package: ${currentPackage} → ${packageName}`);

        // Replace package declaration
        content = content.replace(/^package\s+[^\s\n]+/m, `package ${packageName}`);

        // Update imports that reference the old package
        const importRegex = new RegExp(
          `import\\s+${currentPackage.replace(/\./g, "\\.")}(\..*)`,
          "g"
        );
        content = content.replace(importRegex, `import ${packageName}$1`);

        FileUtils.writeFileSync(filePath, content);
        Logger.success(
          `Updated package declaration in: ${path.basename(
            filePath
          )} (${currentPackage} → ${packageName})`
        );
      } else if (!currentPackage) {
        // If no package declaration found, add one
        content = `package ${packageName}\n\n${content}`;
        FileUtils.writeFileSync(filePath, content);
        Logger.success(`Added package declaration to: ${path.basename(filePath)} (${packageName})`);
      } else {
        Logger.debug(`Package already correct in: ${path.basename(filePath)}`);
      }
    } catch (error) {
      Logger.error(`Error updating package in ${filePath}: ${error}`);
    }
  }

  /**
   * Validates if a file is a legitimate widget file
   * @param filePath - Path to the file to validate
   * @returns True if the file is a valid widget file
   */
  private static isValidWidgetFile(filePath: string): boolean {
    if (!filePath.endsWith(".kt")) {
      return false;
    }

    try {
      const content = FileUtils.readFileSync(filePath);
      const fileName = path.basename(filePath);

      // Check if filename contains "Widget"
      if (fileName.toLowerCase().includes("widget")) {
        return true;
      }

      // Check if file content contains widget-related keywords
      const widgetKeywords = ["Widget", "AppWidget", "GlanceAppWidget", "@GlanceAppWidget"];
      return widgetKeywords.some((keyword) => content.includes(keyword));
    } catch {
      return false;
    }
  }

  /**
   * Recursively searches for widget files in a directory tree
   * @param rootDir - Root directory to start search
   * @param maxDepth - Maximum depth to search (prevents infinite recursion)
   * @returns Path to first widget file found, or null
   */
  private static recursiveWidgetSearch(rootDir: string, maxDepth: number): string | null {
    if (maxDepth <= 0 || !FileUtils.exists(rootDir) || !FileUtils.isDirectory(rootDir)) {
      return null;
    }

    try {
      // First, check current directory for widget files
      const widgetFiles = this.findWidgetFiles(rootDir, "Widget"); // Use default pattern for discovery
      if (widgetFiles.length > 0) {
        return path.join(rootDir, widgetFiles[0]);
      }

      // If no widget files in current directory, search subdirectories
      const items = FileUtils.readdirSync(rootDir);

      for (const item of items) {
        const itemPath = path.join(rootDir, item);

        if (FileUtils.isDirectory(itemPath)) {
          // Skip common directories that are unlikely to contain widget source files
          const skipDirs = [
            "build",
            "gradle",
            ".gradle",
            "generated",
            "intermediates",
            "outputs",
            "tmp",
          ];
          if (skipDirs.includes(item)) {
            continue;
          }

          const result = this.recursiveWidgetSearch(itemPath, maxDepth - 1);
          if (result) {
            return result;
          }
        }
      }
    } catch (error) {
      Logger.debug(`Error during recursive search in ${rootDir}: ${error}`);
    }

    return null;
  }
}
