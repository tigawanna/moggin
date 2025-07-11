import { ConfigPlugin, withDangerousMod } from '@expo/config-plugins';
import * as fs from 'fs';
import * as path from 'path';
import { Logger } from './utils/fs';

const logger = new Logger('WithWakatimeWorkerErrorHandling');

export interface WakatimeWorkerErrorHandlingOptions {
  packageName?: string;
}

/**
 * Config plugin to add error handling to WakatimeWidgetWorker.setupPeriodicWork
 */
export const withWakatimeWorkerErrorHandling: ConfigPlugin<WakatimeWorkerErrorHandlingOptions> = (config, options = {}) => {
  return withDangerousMod(config, [
    'android',
    async (config) => {
      const { platformProjectRoot } = config.modRequest;
      
      // Find the WakatimeWidgetWorker.kt file
      const wakatimeWorkerPath = findWakatimeWorkerFile(platformProjectRoot);
      
      if (!wakatimeWorkerPath) {
        logger.warn('WakatimeWidgetWorker.kt not found, skipping error handling injection');
        return config;
      }

      // Read the WakatimeWidgetWorker file
      let workerContent = fs.readFileSync(wakatimeWorkerPath, 'utf8');
      
      // Get the package name from the file or use the provided one
      const packageName = options.packageName || extractPackageName(workerContent);
      
      if (!packageName) {
        logger.warn('Could not determine package name, skipping error handling injection');
        return config;
      }

      // Add error handling to the setupPeriodicWork method
      workerContent = addErrorHandlingToSetupPeriodicWork(workerContent);
      
      // Write the modified content back
      fs.writeFileSync(wakatimeWorkerPath, workerContent);
      
      logger.info('Successfully added error handling to WakatimeWidgetWorker.setupPeriodicWork');
      
      return config;
    },
  ]);
};

/**
 * Find the WakatimeWidgetWorker.kt file in the project
 */
function findWakatimeWorkerFile(platformProjectRoot: string): string | null {
  // Check in the widgets directory first
  const widgetsPath = path.join(platformProjectRoot, '..', 'widgets', 'android', 'wakatime', 'WakatimeWidgetWorker.kt');
  if (fs.existsSync(widgetsPath)) {
    return widgetsPath;
  }

  // Search recursively in the Android project
  function searchDirectory(dir: string): string | null {
    if (!fs.existsSync(dir)) return null;
    
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        const result = searchDirectory(filePath);
        if (result) return result;
      } else if (file === 'WakatimeWidgetWorker.kt') {
        return filePath;
      }
    }
    
    return null;
  }

  // Search in the main source directories
  const mainSrcPath = path.join(platformProjectRoot, 'app', 'src', 'main');
  if (fs.existsSync(mainSrcPath)) {
    return searchDirectory(mainSrcPath);
  }
  
  return null;
}

/**
 * Extract package name from file content
 */
function extractPackageName(content: string): string | null {
  const packageMatch = content.match(/^package\s+([a-zA-Z0-9_.]+)/m);
  return packageMatch ? packageMatch[1] : null;
}

/**
 * Add error handling to setupPeriodicWork method
 */
function addErrorHandlingToSetupPeriodicWork(content: string): string {
  // Check if error handling is already present
  if (content.includes('try {') && content.includes('catch (e: Exception)')) {
    logger.info('Error handling already present in setupPeriodicWork');
    return content;
  }

  // Find the setupPeriodicWork method
  const setupMethodRegex = /fun\s+setupPeriodicWork\(context:\s*Context\)\s*\{/;
  const setupMethodMatch = content.match(setupMethodRegex);
  
  if (!setupMethodMatch) {
    logger.warn('Could not find setupPeriodicWork method');
    return content;
  }

  // Find the method body
  const methodStartIndex = content.indexOf(setupMethodMatch[0]);
  const methodBodyStart = methodStartIndex + setupMethodMatch[0].length;
  
  // Find the end of the method (closing brace)
  let braceCount = 1;
  let methodBodyEnd = methodBodyStart;
  
  for (let i = methodBodyStart; i < content.length; i++) {
    if (content[i] === '{') braceCount++;
    else if (content[i] === '}') braceCount--;
    
    if (braceCount === 0) {
      methodBodyEnd = i;
      break;
    }
  }
  
  // Extract the method body
  const methodBody = content.substring(methodBodyStart, methodBodyEnd);
  
  // Create the new method body with error handling
  const newMethodBody = `
            try {
                ${methodBody.trim()}
            } catch (e: Exception) {
                Log.e("WakatimeWorker", "Failed to schedule work", e)
            }
        `;
  
  // Replace the method body
  const newContent = content.substring(0, methodBodyStart) + newMethodBody + content.substring(methodBodyEnd);
  
  logger.info('Added error handling to setupPeriodicWork method');
  return newContent;
}

export default withWakatimeWorkerErrorHandling;
