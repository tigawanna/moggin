import * as fs from 'fs';
import path from 'path';

/**
 * File system utilities for Expo Glance Widget plugin operations
 */
export class FileUtils {
  /**
   * Copy file safely, creating destination directory if needed
   * @param src - Source file path
   * @param dest - Destination file path
   */
  static copyFileSync(src: string, dest: string): void {
    const destDir = path.dirname(dest);
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
  static isDirectory(filePath: string): boolean {
    try {
      return fs.lstatSync(filePath).isDirectory();
    } catch {
      return false;
    }
  }

  /**
   * Ensure directory exists, creating it recursively if needed
   * @param dirPath - Directory path to ensure
   */
  static ensureDir(dirPath: string): void {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  /**
   * Check if file exists
   * @param filePath - File path to check
   * @returns True if file exists
   */
  static exists(filePath: string): boolean {
    return fs.existsSync(filePath);
  }

  /**
   * Read file content as UTF-8 string
   * @param filePath - Path to file
   * @returns File content as string
   */
  static readFileSync(filePath: string): string {
    return fs.readFileSync(filePath, 'utf-8');
  }

  /**
   * Write string content to file
   * @param filePath - Path to file
   * @param content - Content to write
   */
  static writeFileSync(filePath: string, content: string): void {
    fs.writeFileSync(filePath, content, 'utf-8');
  }

  /**
   * Read directory contents
   * @param dirPath - Directory path
   * @returns Array of file/directory names
   */
  static readdirSync(dirPath: string): string[] {
    return fs.readdirSync(dirPath);
  }

  /**
   * Recursively copy files and directories with callback support
   * @param sourceDir - Source directory
   * @param destDir - Destination directory
   * @param onSuccess - Callback called when a file is successfully copied
   * @param onSkip - Callback called when a file is skipped (already exists)
   */
  static copyRecursively(
    sourceDir: string,
    destDir: string,
    onSuccess?: (targetPath: string) => void,
    onSkip?: (targetPath: string) => void
  ): void {
    this.ensureDir(destDir);
    const items = this.readdirSync(sourceDir);

    items.forEach((item: string) => {
      const sourcePath = path.join(sourceDir, item);
      const destPath = path.join(destDir, item);

      if (this.isDirectory(sourcePath)) {
        this.copyRecursively(sourcePath, destPath, onSuccess, onSkip);
      } else {
        if (this.exists(destPath)) {
          onSkip?.(destPath);
          return;
        }

        this.copyFileSync(sourcePath, destPath);
        onSuccess?.(destPath);
      }
    });
  }
}

/**
 * Logger utility with emoji prefixes for better visual feedback
 */
export class Logger {
  static info(message: string): void {
    console.log(`ℹ️  ${message}`);
  }

  static success(message: string): void {
    console.log(`✅ ${message}`);
  }

  static warn(message: string): void {
    console.warn(`⚠️  ${message}`);
  }

  static error(message: string): void {
    console.error(`❌ ${message}`);
  }

  static debug(message: string): void {
    console.log(`🔍 ${message}`);
  }

  static file(message: string): void {
    console.log(`📁 ${message}`);
  }

  static mobile(message: string): void {
    console.log(`📱 ${message}`);
  }

  static manifest(message: string): void {
    console.log(`📄 ${message}`);
  }
}
