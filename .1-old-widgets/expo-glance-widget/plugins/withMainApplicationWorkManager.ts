import { ConfigPlugin, withDangerousMod } from '@expo/config-plugins';
import * as fs from 'fs';
import * as path from 'path';
import { Logger } from './utils/fs';

const logger = new Logger('WithMainApplicationWorkManager');

export interface MainApplicationWorkManagerOptions {
  packageName?: string;
}

/**
 * Config plugin to inject WorkManager initialization into MainApplication
 */
export const withMainApplicationWorkManager: ConfigPlugin<MainApplicationWorkManagerOptions> = (config, options = {}) => {
  return withDangerousMod(config, [
    'android',
    async (config) => {
      const { platformProjectRoot } = config.modRequest;
      
      // Find the MainApplication.kt file
      const mainApplicationPath = findMainApplicationFile(platformProjectRoot);
      
      if (!mainApplicationPath) {
        logger.warn('MainApplication.kt not found, skipping WorkManager injection');
        return config;
      }

      // Read the MainApplication file
      let mainApplicationContent = fs.readFileSync(mainApplicationPath, 'utf8');
      
      // Get the package name from the file or use the provided one
      const packageName = options.packageName || extractPackageName(mainApplicationContent);
      
      if (!packageName) {
        logger.warn('Could not determine package name, skipping WorkManager injection');
        return config;
      }

      // Inject the WorkManager initialization
      mainApplicationContent = injectWorkManagerIntoMainApplication(mainApplicationContent, packageName);
      
      // Write the modified content back
      fs.writeFileSync(mainApplicationPath, mainApplicationContent);
      
      logger.info('Successfully injected WorkManager initialization into MainApplication');
      
      return config;
    },
  ]);
};

/**
 * Find the MainApplication.kt file in the Android project
 */
function findMainApplicationFile(platformProjectRoot: string): string | null {
  // Search for MainApplication.kt recursively
  function searchDirectory(dir: string): string | null {
    if (!fs.existsSync(dir)) return null;
    
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        const result = searchDirectory(filePath);
        if (result) return result;
      } else if (file === 'MainApplication.kt') {
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
 * Extract package name from MainApplication content
 */
function extractPackageName(content: string): string | null {
  const packageMatch = content.match(/^package\s+([a-zA-Z0-9_.]+)/m);
  return packageMatch ? packageMatch[1] : null;
}

/**
 * Inject WorkManager configuration into MainApplication
 */
function injectWorkManagerIntoMainApplication(content: string, packageName: string): string {
  // Required imports to add
  const requiredImports = [
    'import android.content.res.Configuration',
    'import androidx.work.Configuration',
    'import androidx.work.WorkManager'
  ];

  // Check and add missing imports
  requiredImports.forEach(importStatement => {
    if (!content.includes(importStatement)) {
      // Add import after the last import statement
      const lastImportMatch = content.match(/^import\s+.+$/gm);
      if (lastImportMatch) {
        const lastImport = lastImportMatch[lastImportMatch.length - 1];
        const lastImportIndex = content.lastIndexOf(lastImport);
        const insertIndex = lastImportIndex + lastImport.length;
        
        content = content.slice(0, insertIndex) + '\n' + importStatement + content.slice(insertIndex);
        logger.info(`Added import: ${importStatement}`);
      }
    }
  });

  // Add Configuration.Provider interface if not present
  if (!content.includes('Configuration.Provider')) {
    const classDeclarationRegex = /class\s+MainApplication\s*:\s*Application\(\)\s*,\s*ReactApplication/;
    const classMatch = content.match(classDeclarationRegex);
    
    if (classMatch) {
      const classDeclaration = classMatch[0];
      const newClassDeclaration = classDeclaration + ', Configuration.Provider';
      content = content.replace(classDeclaration, newClassDeclaration);
      logger.info('Added Configuration.Provider interface to MainApplication');
    }
  }

  // Add WorkManager configuration method if not present
  if (!content.includes('getWorkManagerConfiguration')) {
    const workManagerConfigMethod = `
  // WorkManager configuration
  override fun getWorkManagerConfiguration(): Configuration =
      Configuration.Builder()
          .setMinimumLoggingLevel(android.util.Log.DEBUG)
          .build()`;

    // Insert before the onCreate method
    const onCreateRegex = /override\s+fun\s+onCreate\(\)/;
    const onCreateMatch = content.match(onCreateRegex);
    
    if (onCreateMatch) {
      const onCreateIndex = content.indexOf(onCreateMatch[0]);
      content = content.slice(0, onCreateIndex) + workManagerConfigMethod + '\n\n  ' + content.slice(onCreateIndex);
      logger.info('Added getWorkManagerConfiguration method');
    }
  }

  // Add WorkManager initialization in onCreate if not present
  if (!content.includes('WorkManager.initialize')) {
    const superOnCreateRegex = /super\.onCreate\(\)/;
    const superOnCreateMatch = content.match(superOnCreateRegex);
    
    if (superOnCreateMatch) {
      const superOnCreateCall = superOnCreateMatch[0];
      const superOnCreateIndex = content.indexOf(superOnCreateCall);
      const insertIndex = superOnCreateIndex + superOnCreateCall.length;
      
      const workManagerInit = `
        
        // Initialize WorkManager first
        WorkManager.initialize(this, workManagerConfiguration)`;
      
      content = content.slice(0, insertIndex) + workManagerInit + content.slice(insertIndex);
      logger.info('Added WorkManager.initialize call to onCreate');
    }
  }

  return content;
}

export default withMainApplicationWorkManager;
