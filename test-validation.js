#!/usr/bin/env node
/**
 * Simple test script to verify widget path validation logic
 * Run this from the project root to test the new validation improvements
 */

const path = require('path');
const fs = require('fs');

// Mock the required classes for testing
class MockFileUtils {
  static exists(filePath) {
    return fs.existsSync(filePath);
  }
  
  static isDirectory(filePath) {
    try {
      return fs.lstatSync(filePath).isDirectory();
    } catch {
      return false;
    }
  }
  
  static readdirSync(dirPath) {
    try {
      return fs.readdirSync(dirPath);
    } catch {
      return [];
    }
  }
  
  static readFileSync(filePath) {
    try {
      return fs.readFileSync(filePath, 'utf-8');
    } catch {
      return '';
    }
  }
}

class MockLogger {
  static debug(msg) { console.log(`🔍 ${msg}`); }
  static warn(msg) { console.log(`⚠️  ${msg}`); }
  static success(msg) { console.log(`✅ ${msg}`); }
  static error(msg) { console.log(`❌ ${msg}`); }
}

/**
 * Test function that mimics the validation logic from WidgetClassSync
 */
function testPathValidation(projectRoot, widgetPath) {
  console.log(`\n=== Testing Path: ${widgetPath} ===`);
  
  const fullPath = path.join(projectRoot, widgetPath);
  MockLogger.debug(`Resolving widget path: ${fullPath}`);
  
  // Test if path exists
  if (MockFileUtils.exists(fullPath)) {
    if (MockFileUtils.isDirectory(fullPath)) {
      MockLogger.debug(`Path is a directory, searching for widget files...`);
      
      // Search for .kt files
      const files = MockFileUtils.readdirSync(fullPath);
      const ktFiles = files.filter(file => file.endsWith('.kt'));
      
      MockLogger.debug(`Found ${ktFiles.length} .kt files: ${ktFiles.join(', ')}`);
      
      if (ktFiles.length > 0) {
        MockLogger.success(`✅ Found widget files in directory!`);
        return true;
      }
    } else {
      MockLogger.debug(`Path is a file`);
      if (fullPath.endsWith('.kt')) {
        MockLogger.success(`✅ Found .kt file!`);
        return true;
      }
    }
  } else {
    MockLogger.warn(`Path does not exist: ${fullPath}`);
    
    // Try to find parent directory that exists
    let currentPath = fullPath;
    let attempts = 0;
    const maxAttempts = 5;
    
    while (!MockFileUtils.exists(currentPath) && attempts < maxAttempts) {
      currentPath = path.dirname(currentPath);
      attempts++;
      
      if (MockFileUtils.exists(currentPath) && MockFileUtils.isDirectory(currentPath)) {
        MockLogger.debug(`Found existing parent directory: ${currentPath}`);
        
        // Recursively search for .kt files
        const found = recursiveKotlinSearch(currentPath, 3);
        if (found) {
          MockLogger.success(`✅ Found widget files through recursive search!`);
          return true;
        }
      }
    }
  }
  
  MockLogger.error(`❌ No valid widget files found`);
  return false;
}

function recursiveKotlinSearch(rootDir, maxDepth) {
  if (maxDepth <= 0 || !MockFileUtils.exists(rootDir) || !MockFileUtils.isDirectory(rootDir)) {
    return null;
  }
  
  try {
    const items = MockFileUtils.readdirSync(rootDir);
    
    // Check for .kt files in current directory
    const ktFiles = items.filter(item => item.endsWith('.kt'));
    if (ktFiles.length > 0) {
      MockLogger.debug(`Found .kt files in ${rootDir}: ${ktFiles.join(', ')}`);
      return ktFiles[0];
    }
    
    // Search subdirectories
    for (const item of items) {
      const itemPath = path.join(rootDir, item);
      
      if (MockFileUtils.isDirectory(itemPath)) {
        // Skip common build directories
        const skipDirs = ['build', 'gradle', '.gradle', 'generated', 'intermediates', 'outputs', 'tmp'];
        if (skipDirs.includes(item)) {
          continue;
        }
        
        const result = recursiveKotlinSearch(itemPath, maxDepth - 1);
        if (result) {
          return result;
        }
      }
    }
  } catch (error) {
    MockLogger.debug(`Error during recursive search in ${rootDir}: ${error}`);
  }
  
  return null;
}

// Run tests
const projectRoot = process.cwd();

console.log('🧪 Testing Widget Path Validation Logic');
console.log(`Project Root: ${projectRoot}`);

// Test cases
const testPaths = [
  // Valid paths (should work if they exist)
  'widgets/android/MyWidget.kt',
  'widgets/android/',
  
  // Your problematic path
  'widgets/android',
  
  // Some other Android Studio-like paths
  '../AndroidStudioProjects/MyApp/app/src/main/java',
  '../../AndroidStudioProjects/SomeProject/app/src/main/java/com/example/widgets'
];

testPaths.forEach(testPath => {
  testPathValidation(projectRoot, testPath);
});

console.log('\n🏁 Test completed!');
