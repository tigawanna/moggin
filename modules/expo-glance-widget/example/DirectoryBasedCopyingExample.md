# Directory-Based File Copying Example

This example demonstrates how to use the new `includeDirectories` option to selectively copy files from specific directories while preserving folder structure.

## Configuration

```typescript
// app.config.ts
import { withExpoGlanceWidgets } from 'expo-glance-widget/plugins';

export default {
  plugins: [
    [
      withExpoGlanceWidgets,
      {
        // Path to your Android project or widget directory
        widgetFilesPath: "../MyAndroidProject/app/src/main/java/com/mycompany/",
        
        // Only copy from these specific directories
        includeDirectories: ["widgets", "utils", "data"],
        
        // Pattern to match widget files (default: "Widget")
        fileMatchPattern: "Widget",
        
        // Other configuration
        manifestPath: "../MyAndroidProject/app/src/main/AndroidManifest.xml",
        resPath: "../MyAndroidProject/app/src/main/res",
      }
    ]
  ]
};
```

## Source Structure

```
MyAndroidProject/
├── app/src/main/java/com/mycompany/
│   ├── widgets/           # ← COPIED (in includeDirectories)
│   │   ├── WeatherWidget.kt
│   │   ├── CalendarWidget.kt
│   │   └── NewsWidget.kt
│   ├── utils/             # ← COPIED (in includeDirectories)
│   │   ├── WidgetUtils.kt
│   │   └── DateUtils.kt
│   ├── data/              # ← COPIED (in includeDirectories)
│   │   ├── WeatherData.kt
│   │   └── CalendarData.kt
│   ├── activities/        # ← SKIPPED (not in includeDirectories)
│   │   └── MainActivity.kt
│   └── services/          # ← SKIPPED (not in includeDirectories)
│       └── SyncService.kt
```

## Result in Expo Project

```
android/app/src/main/java/com/yourexpoapp/
├── widgets/
│   ├── WeatherWidget.kt    # package com.yourexpoapp.widgets
│   ├── CalendarWidget.kt   # package com.yourexpoapp.widgets
│   └── NewsWidget.kt       # package com.yourexpoapp.widgets
├── utils/
│   ├── WidgetUtils.kt      # package com.yourexpoapp.utils
│   └── DateUtils.kt        # package com.yourexpoapp.utils
└── data/
    ├── WeatherData.kt      # package com.yourexpoapp.data
    └── CalendarData.kt     # package com.yourexpoapp.data
```

## Key Features

1. **Selective Copying**: Only copies files from specified directories
2. **Folder Structure Preservation**: Maintains the original directory structure
3. **Automatic Package Updates**: Updates package declarations to match your Expo project
4. **Pattern Matching**: Only copies files matching the specified pattern (default: contains "Widget")

## Options

- `includeDirectories`: Array of directory names to copy from (relative to `widgetFilesPath`)
- `fileMatchPattern`: Pattern to match files (default: "Widget")
- Empty `includeDirectories` array: Falls back to copying all widget files from the source directory

## Use Cases

- **Large Android Projects**: Copy only widget-related directories
- **Modular Architecture**: Separate widget logic from app logic
- **Clean Builds**: Avoid copying unnecessary files
- **Organized Structure**: Maintain clear separation of concerns
