import { ConfigPlugin, withDangerousMod } from '@expo/config-plugins';
import * as fs from 'fs';
import * as path from 'path';
import { Logger } from './utils/fs';

const logger = new Logger('WithWakatimeWorkManager');

export interface WakatimeWorkManagerOptions {
  packageName?: string;
}

/**
 * Config plugin to inject WakatimeWidgetWorker.setupPeriodicWork() into MainActivity
 */
export const withWakatimeWorkManager: ConfigPlugin<WakatimeWorkManagerOptions> = (config, options = {}) => {
  return withDangerousMod(config, [
    'android',
    async (config) => {
      const { platformProjectRoot } = config.modRequest;
      
      // Find the MainActivity.kt file
      const mainActivityPath = findMainActivityFile(platformProjectRoot);
      
      if (!mainActivityPath) {
        logger.warn('MainActivity.kt not found, skipping WorkManager injection');
        return config;
      }

      // Read the MainActivity file
      let mainActivityContent = fs.readFileSync(mainActivityPath, 'utf8');
      
      logger.debug(`MainActivity content length: ${mainActivityContent.length}`);
      logger.debug(`MainActivity content preview: ${mainActivityContent.substring(0, 200)}...`);
      
      // Get the package name from the file or use the provided one
      const packageName = options.packageName || extractPackageName(mainActivityContent);
      
      if (!packageName) {
        logger.warn('Could not determine package name, skipping WorkManager injection');
        return config;
      }

      // Inject the import and initialization code
      mainActivityContent = injectWakatimeWorkManager(mainActivityContent, packageName);
      
      // Write the modified content back
      fs.writeFileSync(mainActivityPath, mainActivityContent);
      
      logger.info('Successfully injected WakatimeWidgetWorker initialization into MainActivity');
      
      return config;
    },
  ]);
};

/**
 * Find the MainActivity.kt file in the Android project
 */
function findMainActivityFile(platformProjectRoot: string): string | null {
  const possiblePaths = [
    path.join(platformProjectRoot, 'app', 'src', 'main', 'java', '**', 'MainActivity.kt'),
    path.join(platformProjectRoot, 'app', 'src', 'main', 'kotlin', '**', 'MainActivity.kt'),
  ];

  // Search for MainActivity.kt recursively
  function searchDirectory(dir: string): string | null {
    if (!fs.existsSync(dir)) return null;
    
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        const result = searchDirectory(filePath);
        if (result) return result;
      } else if (file === 'MainActivity.kt') {
        return filePath;
      }
    }
    
    return null;
  }

  // Search in the main source directories
  const mainSrcPath = path.join(platformProjectRoot, 'app', 'src', 'main');
  if (fs.existsSync(mainSrcPath)) {
    const javaPath = path.join(mainSrcPath, 'java');
    const kotlinPath = path.join(mainSrcPath, 'kotlin');
    
    let result = searchDirectory(javaPath);
    if (!result) {
      result = searchDirectory(kotlinPath);
    }
    
    return result;
  }
  
  return null;
}

/**
 * Extract package name from MainActivity content
 */
function extractPackageName(content: string): string | null {
  const packageMatch = content.match(/^package\s+([a-zA-Z0-9_.]+)/m);
  return packageMatch ? packageMatch[1] : null;
}

/**
 * Inject WakatimeWidgetWorker import and initialization into MainActivity
 */
function injectWakatimeWorkManager(content: string, packageName: string): string {
  // Import statement to add
  const importStatement = `import ${packageName}.wakatime.WakatimeWidgetWorker`;
  
  // Initialization code to add
  const initializationCode = `
        
        // Initialize wakatime work manager (using application context for thread safety)
        WakatimeWidgetWorker.setupPeriodicWork(this.applicationContext)`;

  // Check if import already exists
  if (content.includes(importStatement)) {
    logger.info('WakatimeWidgetWorker import already exists');
  } else {
    // Add import after the last import statement
    const lastImportMatch = content.match(/^import\s+.+$/gm);
    if (lastImportMatch) {
      const lastImport = lastImportMatch[lastImportMatch.length - 1];
      const lastImportIndex = content.lastIndexOf(lastImport);
      const insertIndex = lastImportIndex + lastImport.length;
      
      content = content.slice(0, insertIndex) + '\n' + importStatement + content.slice(insertIndex);
      logger.info('Added WakatimeWidgetWorker import');
    }
  }

  // Check if initialization already exists (both variants)
  if (content.includes('WakatimeWidgetWorker.setupPeriodicWork(this)') || 
      content.includes('WakatimeWidgetWorker.setupPeriodicWork(this.applicationContext)')) {
    logger.info('WakatimeWidgetWorker initialization already exists');
    return content;
  } else {
    logger.debug('WakatimeWidgetWorker initialization not found, proceeding with injection');
  }

  logger.debug('Looking for onCreate method...');
  // Find the super.onCreate call and inject the initialization right after it
  const superOnCreateRegex = /super\.onCreate\([^)]*\)/;
  const superOnCreateMatch = content.match(superOnCreateRegex);
  
  if (superOnCreateMatch) {
    logger.debug('Found super.onCreate call, injecting WorkManager initialization');
    const superOnCreateCall = superOnCreateMatch[0];
    const superOnCreateIndex = content.indexOf(superOnCreateCall);
    const insertIndex = superOnCreateIndex + superOnCreateCall.length;
    
    content = content.slice(0, insertIndex) + initializationCode + content.slice(insertIndex);
    logger.info('Added WakatimeWidgetWorker initialization after super.onCreate');
  } else {
    logger.error('Could not find super.onCreate call to inject WorkManager initialization');
    logger.debug(`Available content preview: ${content.substring(0, 500)}`);
  }

  return content;
}

export default withWakatimeWorkManager;
