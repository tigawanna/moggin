/**
 * Example usage of expo-glance-widget with directory-based copying
 */

// app.config.ts
// @ts-ignore
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
        
        // Pattern to match widget files
        fileMatchPattern: "Widget",
        
        // Other configuration
        manifestPath: "../MyAndroidProject/app/src/main/AndroidManifest.xml",
        resPath: "../MyAndroidProject/app/src/main/res",
      }
    ]
  ]
};

/**
 * Example Android project structure:
 * 
 * MyAndroidProject/
 * ├── app/src/main/java/com/mycompany/
 * │   ├── widgets/           # ← COPIED (includeDirectories)
 * │   │   ├── WeatherWidget.kt
 * │   │   ├── CalendarWidget.kt
 * │   │   └── NewsWidget.kt
 * │   ├── utils/             # ← COPIED (includeDirectories)
 * │   │   ├── WidgetUtils.kt
 * │   │   └── DateUtils.kt
 * │   ├── data/              # ← COPIED (includeDirectories)
 * │   │   ├── WeatherData.kt
 * │   │   └── CalendarData.kt
 * │   ├── activities/        # ← SKIPPED (not in includeDirectories)
 * │   │   └── MainActivity.kt
 * │   └── services/          # ← SKIPPED (not in includeDirectories)
 * │       └── SyncService.kt
 * 
 * Result in Expo project:
 * android/app/src/main/java/com/yourexpoapp/
 * ├── widgets/
 * │   ├── WeatherWidget.kt    # package com.yourexpoapp.widgets
 * │   ├── CalendarWidget.kt   # package com.yourexpoapp.widgets
 * │   └── NewsWidget.kt       # package com.yourexpoapp.widgets
 * ├── utils/
 * │   ├── WidgetUtils.kt      # package com.yourexpoapp.utils
 * │   └── DateUtils.kt        # package com.yourexpoapp.utils
 * └── data/
 *     ├── WeatherData.kt      # package com.yourexpoapp.data
 *     └── CalendarData.kt     # package com.yourexpoapp.data
 */
