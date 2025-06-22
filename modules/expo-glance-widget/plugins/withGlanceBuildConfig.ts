import { ConfigPlugin, withAppBuildGradle } from '@expo/config-plugins';

/**
 * Config plugin that modifies the app-level build.gradle to add Kotlin Compose and Glance dependencies
 */
export const withGlanceBuildConfig: ConfigPlugin = (config) => {
  return withAppBuildGradle(config, (config) => {
    if (config.modResults.language === 'groovy') {
      config.modResults.contents = addGlanceBuildConfiguration(config.modResults.contents);
    }
    return config;
  });
};

/**
 * Adds Kotlin Compose and Glance configuration to app build.gradle
 * @param buildGradle - Current build.gradle content
 * @returns Modified build.gradle content
 */
function addGlanceBuildConfiguration(buildGradle: string): string {
  // Check if Kotlin plugins are already applied
  const hasKotlinPlugin = buildGradle.includes('apply plugin: "org.jetbrains.kotlin.android"');
  const hasComposePlugin = buildGradle.includes('apply plugin: "org.jetbrains.kotlin.plugin.compose"');
  
  // Check if Compose build features are configured
  const hasBuildFeatures = buildGradle.includes('buildFeatures') && buildGradle.includes('compose true');
  
  // Check if Glance dependencies are present
  const hasGlanceDeps = buildGradle.includes('androidx.glance:glance-appwidget');

  let modifiedGradle = buildGradle;

  // 1. Add Kotlin plugins after the React Native plugin
  if (!hasKotlinPlugin || !hasComposePlugin) {
    const pluginInsertPoint = modifiedGradle.indexOf('apply plugin: "com.facebook.react"');
    if (pluginInsertPoint !== -1) {
      const insertAfter = modifiedGradle.indexOf('\n', pluginInsertPoint) + 1;
      
      let pluginsToAdd = '';
      if (!hasKotlinPlugin) {
        pluginsToAdd += 'apply plugin: "org.jetbrains.kotlin.android"\n';
      }
      if (!hasComposePlugin) {
        pluginsToAdd += 'apply plugin: "org.jetbrains.kotlin.plugin.compose"\n';
      }
      
      modifiedGradle = 
        modifiedGradle.slice(0, insertAfter) + 
        pluginsToAdd + 
        modifiedGradle.slice(insertAfter);
    }
  }

  // 2. Add Compose build features
  if (!hasBuildFeatures) {
    // Find the android block and add buildFeatures
    const androidBlockMatch = modifiedGradle.match(/android\s*\{/);
    if (androidBlockMatch) {
      const androidStart = androidBlockMatch.index! + androidBlockMatch[0].length;
      
      // Find a good place to insert - after namespace or defaultConfig
      const namespaceMatch = modifiedGradle.slice(androidStart).match(/namespace\s+['"][^'"]+['"]/);
      const defaultConfigMatch = modifiedGradle.slice(androidStart).match(/defaultConfig\s*\{[^}]*\}/);
      
      let insertPoint: number;
      if (namespaceMatch) {
        insertPoint = androidStart + namespaceMatch.index! + namespaceMatch[0].length;
      } else if (defaultConfigMatch) {
        insertPoint = androidStart + defaultConfigMatch.index! + defaultConfigMatch[0].length;
      } else {
        insertPoint = androidStart;
      }
      
      const buildFeaturesConfig = `
    
    buildFeatures {
        compose true
    }`;
      
      modifiedGradle = 
        modifiedGradle.slice(0, insertPoint) + 
        buildFeaturesConfig + 
        modifiedGradle.slice(insertPoint);
    }
  }

  // 3. Add Glance dependencies
  if (!hasGlanceDeps) {
    // Find the dependencies block
    const depsMatch = modifiedGradle.match(/dependencies\s*\{/);
    if (depsMatch) {
      const depsStart = depsMatch.index! + depsMatch[0].length;
        const glanceDependencies = `
    // Compose BOM for version management
    implementation platform('androidx.compose:compose-bom:2024.02.00')
    
    // Core Compose dependencies
    implementation 'androidx.compose.runtime:runtime'
    implementation 'androidx.compose.ui:ui'
    implementation 'androidx.compose.ui:ui-tooling-preview'
    implementation 'androidx.compose.material3:material3'
    implementation 'androidx.compose.ui:ui-unit'
    
    // Glance dependencies for widgets
    implementation 'androidx.glance:glance:1.0.0'
    implementation 'androidx.glance:glance-appwidget:1.0.0'
    implementation 'androidx.glance:glance-material3:1.0.0'
    
    // Additional dependencies for widget functionality
    implementation 'androidx.datastore:datastore-preferences:1.0.0'
    implementation 'androidx.work:work-runtime-ktx:2.9.0'
`;
      
      modifiedGradle = 
        modifiedGradle.slice(0, depsStart) + 
        glanceDependencies + 
        modifiedGradle.slice(depsStart);
    }
  }

  return modifiedGradle;
}

export default withGlanceBuildConfig;
