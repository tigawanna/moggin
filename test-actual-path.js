#!/usr/bin/env node
/**
 * Test with the actual Android Studio project path
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
 * Test the actual validation logic
 */
function testActualPath() {
  const actualPath = "C:\Users\user\Desktop\code\expo\moggin\widgets\android";
  
  console.log(`\n=== Testing Actual Path: ${actualPath} ===`);
  
  if (MockFileUtils.exists(actualPath)) {
    console.log(`✅ Path exists!`);
    
    if (MockFileUtils.isDirectory(actualPath)) {
      console.log(`✅ Path is a directory`);
      
      const files = MockFileUtils.readdirSync(actualPath);
      console.log(`📁 Directory contents: ${files.join(', ')}`);
      
      const ktFiles = files.filter(file => file.endsWith('.kt'));
      console.log(`📄 Kotlin files found: ${ktFiles.join(', ')}`);
      
      // Test widget detection logic
      const widgetFiles = ktFiles.filter(file => {
        const fileName = file.toLowerCase();
        
        // Check filename for "widget"
        if (fileName.includes('widget')) {
          console.log(`✅ File ${file} contains "widget" in filename`);
          return true;
        }
        
        // Check file content
        try {
          const filePath = path.join(actualPath, file);
          const content = MockFileUtils.readFileSync(filePath);
          
          const strongKeywords = ['GlanceAppWidget', '@GlanceAppWidget', 'AppWidgetProvider'];
          const hasStrongKeyword = strongKeywords.some(keyword => content.includes(keyword));
          
          if (hasStrongKeyword) {
            console.log(`✅ File ${file} contains strong widget keywords`);
            return true;
          }
          
          const weakKeywords = ['Widget', 'AppWidget'];
          const hasWeakKeyword = weakKeywords.some(keyword => content.includes(keyword));
          
          if (hasWeakKeyword) {
            console.log(`⚠️  File ${file} contains weak widget keywords`);
            return true;
          }
          
          console.log(`❌ File ${file} does not contain widget keywords`);
          return false;
        } catch (error) {
          console.log(`❌ Error reading file ${file}: ${error.message}`);
          return false;
        }
      });
      
      console.log(`\n🎯 Widget files detected: ${widgetFiles.join(', ')}`);
      
      if (widgetFiles.length > 0) {
        console.log(`✅ SUCCESS: Found ${widgetFiles.length} widget file(s)!`);
        return true;
      } else if (ktFiles.length > 0) {
        console.log(`⚠️  FALLBACK: No definitive widget files, but found ${ktFiles.length} .kt file(s)`);
        return true;
      } else {
        console.log(`❌ FAIL: No Kotlin files found`);
        return false;
      }
    } else {
      console.log(`⚠️  Path is a file, not a directory`);
    }
  } else {
    console.log(`❌ Path does not exist`);
    return false;
  }
}

// Run the test
console.log('🧪 Testing Widget Detection with Actual Android Studio Path');
testActualPath();
