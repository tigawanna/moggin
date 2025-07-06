# Expo Glance Widget

A modern Android widget module for Expo that provides seamless integration with Android's Glance widget system. This module allows you to create, sync, and manage Android widgets directly from your Expo/React Native application.

## Table of Contents

- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
- [Configuration](#configuration)
- [DataStore API](#datastore-api)
- [Usage Examples](#usage-examples)
- [Directory-Based Copying](#directory-based-copying)
- [External Project Integration](#external-project-integration)
- [Troubleshooting](#troubleshooting)
- [Best Practices](#best-practices)
- [API Reference](#api-reference)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [License](#license)
- [Support](#support)

## Features

- 🔄 **Automatic Widget File Syncing**: Sync widget files from external Android Studio projects
- 📦 **Package Name Updates**: Automatically updates package names to match your Expo project
- 🎨 **Resource Management**: Handles widget resources (layouts, drawables, etc.)
- 📱 **DataStore Integration**: Generic CRUD interface for widget data storage
- 🔧 **Build System Integration**: Automatically configures Gradle for Kotlin Compose and Glance
- 📋 **Manifest Merging**: Automatically merges widget receivers into your app manifest
- 🎯 **Directory-Based Copying**: Selective copying from specific directories

## Requirements

- Expo SDK 53 or higher
- Android API level 31 or higher (for Glance support)
- Kotlin 2.0+ (automatically configured)
- Compose Compiler 1.5.4+ (automatically configured)

## Installation

1. Install the module in your Expo project:
   ```bash
   npm install ./modules/expo-glance-widget
   ```

2. Add the plugin to your `app.config.ts`:
   ```typescript
   import { withExpoGlanceWidgets } from "./modules/expo-glance-widget/plugins";
   
   export default {
     // ... your config
     plugins: [
       // ... other plugins
       [
         withExpoGlanceWidgets,
         {
           widgetFilesPath: "widgets/android",
           manifestPath: "widgets/android/AndroidManifest.xml",
           resPath: "widgets/android/res"
         }
       ]
     ]
   };
   ```

## Configuration

### Basic Configuration

```typescript
[
  withExpoGlanceWidgets,
  {
    widgetFilesPath: "widgets/android",      // Path to widget source files
    manifestPath: "widgets/android/AndroidManifest.xml",  // Widget manifest
    resPath: "widgets/android/res"           // Widget resources
  }
]
```

### Advanced Configuration

```typescript
[
  withExpoGlanceWidgets,
  {
    widgetFilesPath: "C:\\path\\to\\external\\project\\src\\main\\java\\com\\example",
    manifestPath: "C:\\path\\to\\external\\project\\src\\main\\AndroidManifest.xml",
    resPath: "C:\\path\\to\\external\\project\\src\\main\\res",
    fileMatchPattern: "Widget|Provider",     // Match files containing these patterns
    syncDirectory: "widgets/android",        // Where to sync external files
    includeDirectories: ["wakatime", "ui"],  // Only copy from these directories
    sourcePackageName: "com.example.widgets",
    destinationPackageName: "com.yourapp.widgets"
  }
]
```

### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `widgetFilesPath` | string | `"widgets/android"` | Path to widget Kotlin source files |
| `manifestPath` | string | `"widgets/android/AndroidManifest.xml"` | Path to widget manifest file |
| `resPath` | string | `"widgets/android/res"` | Path to widget resources |
| `fileMatchPattern` | string | `"Widget"` | Pattern to match widget files |
| `syncDirectory` | string | `"widgets/android"` | Directory for syncing external files |
| `includeDirectories` | string[] | `undefined` | Specific directories to copy from |
| `sourcePackageName` | string | Auto-detected | Source package name for updates |
| `destinationPackageName` | string | Auto-detected | Target package name |

## DataStore API

The module provides a generic DataStore interface for storing and retrieving widget data:

### JavaScript/TypeScript API

```typescript
import ExpoGlanceWidgetModule from 'expo-glance-widget';

// Get a value
const value = await ExpoGlanceWidgetModule.getDatastoreValue('myKey');

// Update a value
await ExpoGlanceWidgetModule.updateDatastoreValue('myKey', 'myValue');

// Delete a value
await ExpoGlanceWidgetModule.deleteDatastoreValue('myKey');

// Get all keys (for debugging)
const keys = await ExpoGlanceWidgetModule.getAllDatastoreKeys();

// Get all values (for debugging)
const values = await ExpoGlanceWidgetModule.getAllDatastoreValues();
```

### Kotlin Widget API

```kotlin
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.glance.appwidget.state.getAppWidgetState

@Composable
fun MyWidget() {
    val context = LocalContext.current
    val prefs = currentState<Preferences>()
    
    // Read value
    val myValue = prefs[stringPreferencesKey("myKey")] ?: "default"
    
    // Your widget UI
    Text(text = myValue)
}
```

## Usage Examples

### 1. Basic Widget Control Screen

```typescript
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import ExpoGlanceWidgetModule from 'expo-glance-widget';

export default function WidgetControlScreen() {
  const [widgetData, setWidgetData] = useState('');
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    loadWidgetData();
  }, []);

  const loadWidgetData = async () => {
    try {
      const data = await ExpoGlanceWidgetModule.getDatastoreValue('widget_text');
      setWidgetData(data || 'No data');
    } catch (error) {
      console.error('Failed to load widget data:', error);
    }
  };

  const updateWidget = async () => {
    try {
      await ExpoGlanceWidgetModule.updateDatastoreValue('widget_text', inputValue);
      setWidgetData(inputValue);
      setInputValue('');
    } catch (error) {
      console.error('Failed to update widget:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Widget Control</Text>
      <Text style={styles.currentData}>Current Data: {widgetData}</Text>
      <TextInput
        style={styles.input}
        value={inputValue}
        onChangeText={setInputValue}
        placeholder="Enter widget text"
      />
      <Button title="Update Widget" onPress={updateWidget} />
    </View>
  );
}
```

### 2. Kotlin Widget Example

```kotlin
@Composable
fun ExampleWidget() {
    val context = LocalContext.current
    val prefs = currentState<Preferences>()
    
    // Read values from DataStore
    val title = prefs[stringPreferencesKey("widget_title")] ?: "Default Title"
    val subtitle = prefs[stringPreferencesKey("widget_subtitle")] ?: "Default Subtitle"
    
    Column(
        modifier = GlanceModifier
            .fillMaxSize()
            .background(Color.White)
            .padding(16.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(
            text = title,
            style = TextStyle(
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold,
                color = ColorProvider(Color.Black)
            )
        )
        
        Spacer(modifier = GlanceModifier.height(8.dp))
        
        Text(
            text = subtitle,
            style = TextStyle(
                fontSize = 14.sp,
                color = ColorProvider(Color.Gray)
            )
        )
    }
}
```

## Directory-Based Copying

When working with external Android Studio projects, you can specify which directories to copy:

```typescript
[
  withExpoGlanceWidgets,
  {
    widgetFilesPath: "C:\\MyAndroidProject\\app\\src\\main\\java\\com\\example",
    includeDirectories: ["wakatime", "ui", "utils"],  // Only copy these directories
    // ... other config
  }
]
```

This feature:
- Preserves directory structure
- Updates package names automatically
- Handles nested directories
- Maintains file relationships

## External Project Integration

### Step 1: Configure for External Project

```typescript
[
  withExpoGlanceWidgets,
  {
    widgetFilesPath: "C:\\Users\\username\\MyWidgetProject\\app\\src\\main\\java\\com\\example",
    manifestPath: "C:\\Users\\username\\MyWidgetProject\\app\\src\\main\\AndroidManifest.xml",
    resPath: "C:\\Users\\username\\MyWidgetProject\\app\\src\\main\\res",
    syncDirectory: "widgets/android",  // Files will be synced here
    includeDirectories: ["widgets", "data"]  // Only copy specific directories
  }
]
```

### Step 2: Build Your Project

```bash
npm run prebuild:android
```

The plugin will:
1. Copy files from external project to `syncDirectory`
2. Update package names to match your Expo project
3. Preserve directory structure
4. Merge resources and manifest entries

## Troubleshooting

### Common Issues

1. **Widget not appearing**: Check that the widget receiver is properly defined in your manifest
2. **Build errors**: Ensure you're using Expo SDK 53+ and the correct Kotlin version
3. **DataStore errors**: Verify your widget is properly accessing the DataStore context
4. **Package name issues**: Check that package names are being updated correctly

### Debug Commands

```bash
# Check for compilation errors
npm run build:android

# Clean and rebuild
npm run prebuild:android

# Check widget files
ls widgets/android/
```

### Plugin Debug Mode

Enable debug logging by checking the console output during build. The plugin will show:
- File copy operations
- Package name updates
- Manifest merging
- Resource copying

## Best Practices

1. **Use Version Control**: Always commit the synced files in your `syncDirectory`
2. **Test Locally**: Test widget functionality before deploying
3. **Package Names**: Use consistent package naming across your project
4. **Resource Management**: Keep widget resources organized and named clearly
5. **Error Handling**: Always handle DataStore operations with try-catch blocks

## API Reference

### ExpoGlanceWidgetModule Methods

#### `getDatastoreValue(key: string): Promise<string | null>`
Retrieves a value from the DataStore.

#### `updateDatastoreValue(key: string, value: string): Promise<void>`
Updates or creates a value in the DataStore.

#### `deleteDatastoreValue(key: string): Promise<void>`
Deletes a value from the DataStore.

#### `getAllDatastoreKeys(): Promise<string[]>`
Returns all keys in the DataStore (for debugging).

#### `getAllDatastoreValues(): Promise<Record<string, string>>`
Returns all key-value pairs in the DataStore (for debugging).

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Documentation

- **[Quick Start Guide](./QUICKSTART.md)** - Get started in 5 minutes
- **[API Reference](./API.md)** - Complete method documentation
- **[Migration Guide](./MIGRATION.md)** - Upgrade from v1.x to v2.0
- **[Troubleshooting](./TROUBLESHOOTING.md)** - Common issues and solutions
- **[Changelog](./CHANGELOG.md)** - Version history and changes
- **[Examples](./example/)** - Real-world usage examples

## Support

For issues and questions:
1. Check the [Troubleshooting Guide](./TROUBLESHOOTING.md)
2. Review the [API Reference](./API.md) for method usage
3. Look at the [Examples](./example/) directory for code samples
4. Read the [Migration Guide](./MIGRATION.md) if upgrading
5. Open an issue on GitHub with detailed information about your setup
