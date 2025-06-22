# Expo Glance Widgets Plugin

A comprehensive Expo config plugin for integrating Android Glance Widgets with automatic file synchronization and build configuration.

## Features

✅ **Automatic Kotlin 2.0 & Compose setup**  
✅ **Smart widget file copying with package name updates**  
✅ **External file synchronization for version control**  
✅ **Resource management with conflict detection**  
✅ **Android manifest receiver integration**  
✅ **Comprehensive logging with emoji feedback**
⚠️ **Conflict Detection**: Warns about existing files without overwriting  

## Installation

```bash
npm install expo-glance-widget
```

## Usage

### Basic Configuration

Add the plugin to your `app.config.ts`:

```typescript
import { withExpoGlanceWidgets } from './modules/expo-glance-widget/plugins';

export default {
  // ...other config
  plugins: [
    // ...other plugins
    [
      withExpoGlanceWidgets,
      {
        widgetClassPath: "widgets/android/MyWidget.kt",
        manifestPath: "widgets/android/AndroidManifest.xml",
        resPath: "widgets/android/res"
      }
    ]
  ]
};
```

### Default Options

If no options are provided, the plugin uses these defaults:

```typescript
{
  widgetClassPath: "widgets/android/MyWidget.kt",
  manifestPath: "widgets/android/AndroidManifest.xml", 
  resPath: "widgets/android/res"
}
```

## Project Structure

```
your-project/
├── widgets/
│   └── android/
│       ├── MyWidget.kt           # Widget implementation
│       ├── AndroidManifest.xml   # Widget receivers definition
│       └── res/                  # Widget resources
│           ├── xml/
│           │   └── widget_info.xml
│           └── layout/
│               └── widget_layout.xml
└── app.config.ts
```

## What the Plugin Does

### 1. **Project-Level Dependencies**
Adds to `android/build.gradle`:
```gradle
dependencies {
    classpath('org.jetbrains.kotlin:kotlin-gradle-plugin:2.0.0')
    classpath('org.jetbrains.kotlin:compose-compiler-gradle-plugin:2.0.0')
}
```

### 2. **Widget File Copying**
- Copies all `.kt` files from your widget directory
- Updates package declarations to match your app's package name
- Preserves existing files with warnings

### 3. **Resource Integration**
- Recursively copies all resources from `resPath`
- Maintains directory structure
- Skips existing files to prevent conflicts

### 4. **Manifest Integration**
Extracts widget receivers like:
```xml
<receiver android:name=".MyWidgetReceiver" android:exported="true">
    <intent-filter>
        <action android:name="android.appwidget.action.APPWIDGET_UPDATE" />
    </intent-filter>
    <meta-data
        android:name="android.appwidget.provider"
        android:resource="@xml/widget_info" />
</receiver>
```

And adds them to your main `AndroidManifest.xml`.

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `widgetClassPath` | `string` | `"widgets/android/MyWidget.kt"` | Path to your widget Kotlin class |
| `manifestPath` | `string` | `"widgets/android/AndroidManifest.xml"` | Path to widget manifest with receivers |
| `resPath` | `string` | `"widgets/android/res"` | Path to widget resources directory |

## Console Output

The plugin provides detailed logging with emoji prefixes:

```
🎯 Expo Glance Widgets Plugin Configuration: { ... }
📱 Expo SDK Version: 53
📱 Copying 2 Kotlin widget files...
✅ Copying: MyWidget.kt
✅ Updated package declaration in: MyWidget.kt
📁 Copying resources from widgets/android/res...
✅ Copying resource: xml/widget_info.xml
📄 Processing widget manifest: widgets/android/AndroidManifest.xml
✅ Adding receiver 1: .MyWidgetReceiver
📱 Added 1 widget receiver(s) to Android manifest
```

## Requirements

- Expo SDK 50 or higher
- Android target SDK 24 or higher
- Kotlin 2.0 support

## Advanced Usage

### Individual Plugin Components

```typescript
import { 
  withComposeProjectLevelDependancyPlugin,
  withGlanceWidgetFiles,
  FileUtils,
  Logger 
} from 'expo-glance-widget/plugins';

// Use individual plugins for custom setups
```

### Custom File Operations

```typescript
import { FileUtils, Logger } from 'expo-glance-widget/plugins';

// Use the utility classes for custom file operations
FileUtils.copyFileSync(src, dest);
Logger.success('Operation completed!');
```

## Troubleshooting

### Build Errors
- Ensure your Expo SDK version is 50 or higher
- Verify Kotlin files have correct syntax
- Check that widget resources are properly structured

### File Conflicts
- The plugin warns about existing files but doesn't overwrite them
- Remove conflicting files manually if you want fresh copies

### Package Name Issues
- Ensure your `app.config.ts` has `android.package` defined
- Check that imports in your widget files are correctly updated

## Contributing

Contributions are welcome! Please ensure:
- TypeScript types are properly defined
- Console logging uses the Logger utility
- File operations use FileUtils for consistency

## License

MIT


res path: C:\Users\user\AndroidStudioProjects\Bidii-kotlin-widget\app\src\main\res

manifest path: C:\Users\user\AndroidStudioProjects\Bidii-kotlin-widget\app\src\main\AndroidManifest.xml

class pats C:\Users\user\AndroidStudioProjects\Bidii-kotlin-widget\app\src\main\java\com\tigawanna\bidii
