# Expo Glance Widget Module

A comprehensive Expo module for creating Android Glance Widgets with shared preferences integration and automatic file synchronization.

## Features

✅ **Complete Android Glance Widget support**  
✅ **SharedPreferences API for data persistence**  
✅ **JavaScript ↔ Kotlin data communication**  
✅ **JSON, string, number, and boolean support**  
✅ **Automatic Kotlin 2.0 & Compose setup**  
✅ **Smart widget file copying with package name updates**  
✅ **External file synchronization for version control**  
✅ **Resource management with conflict detection**  
✅ **Android manifest receiver integration**  
✅ **Web support with localStorage fallback**  

## Installation

```bash
npm install expo-glance-widget
```

## Quick Start

### 1. Configure the Plugin

Add the plugin to your `app.config.ts`:

```typescript
import { withExpoGlanceWidgets } from './modules/expo-glance-widget/plugins';

export default {
  plugins: [
    [
      withExpoGlanceWidgets,
      {
        widgetClassPath: "widgets/android/",
        manifestPath: "widgets/android/AndroidManifest.xml",
        resPath: "widgets/android/res"
      }
    ]
  ]
};
```

### 2. Create Your Widget Files

Create a basic widget structure:

```
widgets/
└── android/
    ├── MyWidget.kt
    ├── AndroidManifest.xml
    └── res/
        └── xml/
            └── my_widget_info.xml
```

### 3. Use SharedPreferences in Your App

```typescript
import { SharedPreferences } from 'expo-glance-widget';

// Set data that widgets can read
await SharedPreferences.set('widget_title', 'Hello World!');
await SharedPreferences.set('user_score', 1250);
await SharedPreferences.set('is_premium', true);

// Complex data as JSON
await SharedPreferences.set('user_profile', {
  name: 'John Doe',
  level: 42,
  achievements: ['first_win', 'speed_demon']
});
```

## SharedPreferences API

### JavaScript/TypeScript API

#### Basic Operations

```typescript
import { SharedPreferences } from 'expo-glance-widget';

// Set values
await SharedPreferences.set('key', 'value');
await SharedPreferences.set('count', 42);
await SharedPreferences.set('enabled', true);

// Get values
const text = await SharedPreferences.get('key'); // string | null
const count = await SharedPreferences.get('count'); // number | null
const enabled = await SharedPreferences.get('enabled'); // boolean | null

// Remove values
await SharedPreferences.remove('key');

// Clear all
await SharedPreferences.clear();

// Get all key-value pairs
const allData = await SharedPreferences.getAll();
console.log(allData); // { key: 'value', count: 42, enabled: true }
```

#### Working with JSON Data

```typescript
// Store complex objects
const userData = {
  id: 123,
  name: 'Alice',
  preferences: {
    theme: 'dark',
    notifications: true
  },
  scores: [100, 85, 92]
};

await SharedPreferences.set('user_data', JSON.stringify(userData));

// Retrieve and parse JSON
const storedData = await SharedPreferences.get('user_data');
if (storedData) {
  const parsed = JSON.parse(storedData as string);
  console.log(parsed.name); // 'Alice'
}
```

#### Convenience Functions

```typescript
import { 
  setSharedPreference,
  getSharedPreference,
  removeSharedPreference,
  clearSharedPreferences,
  getAllSharedPreferences
} from 'expo-glance-widget';

// Direct function calls (same as SharedPreferences methods)
await setSharedPreference('key', 'value');
const value = await getSharedPreference('key');
```

#### Custom Preferences Files

```typescript
// Use different SharedPreferences files
const options = { name: 'widget_settings' };

await SharedPreferences.set('theme', 'dark', options);
const theme = await SharedPreferences.get('theme', options);

// Set default options for all operations
SharedPreferences.setDefaultOptions({ name: 'my_app_widgets' });
```

### Kotlin API (In Widgets)

```kotlin
import expo.modules.glancewidget.SharedPreferencesHelper

class MyWidget : GlanceAppWidget() {
    override suspend fun provideGlance(context: Context, id: GlanceId) {
        val sharedPrefs = SharedPreferencesHelper.create(context)
        
        // Read data set from JavaScript
        val title = sharedPrefs.getString("widget_title", "Default Title")
        val score = sharedPrefs.getInt("user_score", 0)
        val isPremium = sharedPrefs.getBoolean("is_premium", false)
        
        // Parse JSON data
        val userDataJson = sharedPrefs.getString("user_data", "{}")
        // Use Gson to parse JSON (already included in dependencies)
        
        provideContent {
            GlanceTheme {
                Column {
                    Text(text = title ?: "Default Title")
                    Text(text = "Score: $score")
                    if (isPremium) {
                        Text(text = "Premium User ⭐")
                    }
                }
            }
        }
    }
}
```

## Complete Widget Example

### JavaScript Side (App)

```typescript
import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { SharedPreferences } from 'expo-glance-widget';

export default function WidgetControlScreen() {
  const [title, setTitle] = useState('');
  const [count, setCount] = useState(0);

  const updateWidget = async () => {
    // Update widget data
    await SharedPreferences.set('widget_title', title);
    await SharedPreferences.set('widget_count', count);
    await SharedPreferences.set('last_update', new Date().toISOString());
    
    // Complex data example
    await SharedPreferences.set('widget_config', JSON.stringify({
      theme: 'dark',
      showIcon: true,
      refreshInterval: 300000 // 5 minutes
    }));
    
    console.log('Widget data updated!');
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Widget Title:</Text>
      <TextInput 
        value={title}
        onChangeText={setTitle}
        placeholder="Enter widget title"
      />
      
      <Text>Count: {count}</Text>
      <Button title="+" onPress={() => setCount(count + 1)} />
      <Button title="-" onPress={() => setCount(count - 1)} />
      
      <Button title="Update Widget" onPress={updateWidget} />
    </View>
  );
}
```

### Kotlin Side (Widget)

```kotlin
package com.yourpackage.widgets

import android.content.Context
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.glance.*
import androidx.glance.appwidget.*
import androidx.glance.layout.*
import androidx.glance.text.*
import com.google.gson.Gson
import com.google.gson.JsonObject
import expo.modules.glancewidget.SharedPreferencesHelper

data class WidgetConfig(
    val theme: String,
    val showIcon: Boolean,
    val refreshInterval: Long
)

class MyWidget : GlanceAppWidget() {
    override suspend fun provideGlance(context: Context, id: GlanceId) {
        val sharedPrefs = SharedPreferencesHelper.create(context)
        
        // Get simple values
        val title = sharedPrefs.getString("widget_title", "My Widget")
        val count = sharedPrefs.getInt("widget_count", 0)
        val lastUpdate = sharedPrefs.getString("last_update", "Never")
        
        // Parse JSON configuration
        val configJson = sharedPrefs.getString("widget_config", "{}")
        val gson = Gson()
        val config = try {
            gson.fromJson(configJson, WidgetConfig::class.java)
        } catch (e: Exception) {
            WidgetConfig("light", true, 300000)
        }

        provideContent {
            GlanceTheme {
                Column(
                    modifier = GlanceModifier
                        .fillMaxSize()
                        .padding(16.dp),
                    verticalAlignment = Alignment.Vertical.CenterVertically,
                    horizontalAlignment = Alignment.Horizontal.CenterHorizontally
                ) {
                    if (config.showIcon) {
                        Text(
                            text = "📱",
                            style = TextStyle(fontSize = 24.sp)
                        )
                    }
                    
                    Text(
                        text = title ?: "Default Title",
                        style = TextStyle(
                            fontSize = 18.sp,
                            fontWeight = FontWeight.Bold
                        )
                    )
                    
                    Text(
                        text = "Count: $count",
                        style = TextStyle(fontSize = 16.sp)
                    )
                    
                    Text(
                        text = "Updated: ${formatTime(lastUpdate)}",
                        style = TextStyle(
                            fontSize = 12.sp,
                            color = GlanceTheme.colors.onSurface.copy(alpha = 0.7f)
                        )
                    )
                }
            }
        }
    }
    
    private fun formatTime(isoString: String?): String {
        return try {
            // Format ISO string to readable time
            isoString?.substring(11, 16) ?: "Never"
        } catch (e: Exception) {
            "Never"
        }
    }
}

class MyWidgetReceiver : GlanceAppWidgetReceiver() {
    override val glanceAppWidget: GlanceAppWidget = MyWidget()
}
```

## Plugin Configuration

### All Configuration Options

```typescript
export interface GlanceWidgetConfig {
  // Widget class files
  widgetClassPath?: string;           // Path to widget Kotlin files
  
  // Android manifest
  manifestPath?: string;              // Path to widget manifest
  
  // Resources
  resPath?: string;                   // Path to widget resources
  
  // Advanced options
  fileMatchPattern?: string;          // Custom pattern for widget files
  syncDirectory?: string;             // Auto-sync directory name
  
  // Build configuration
  enableCompose?: boolean;            // Enable Compose dependencies
  kotlinVersion?: string;             // Kotlin version (default: 2.0.0)
  composeVersion?: string;            // Compose version
}
```

### Configuration Examples

#### Basic Configuration
```typescript
[
  withExpoGlanceWidgets,
  {
    widgetClassPath: "widgets/android/",
    manifestPath: "widgets/android/AndroidManifest.xml",
    resPath: "widgets/android/res"
  }
]
```

#### Advanced Configuration
```typescript
[
  withExpoGlanceWidgets,
  {
    // Custom widget file pattern
    fileMatchPattern: "*Widget*.kt",
    
    // Custom sync directory
    syncDirectory: "my-widgets",
    
    // External Android Studio project
    widgetClassPath: "C:\\Projects\\MyWidgets\\app\\src\\main\\java\\com\\mycompany\\",
    manifestPath: "C:\\Projects\\MyWidgets\\app\\src\\main\\AndroidManifest.xml",
    resPath: "C:\\Projects\\MyWidgets\\app\\src\\main\\res",
    
    // Build options
    kotlinVersion: "2.0.0",
    enableCompose: true
  }
]
```

#### Multiple Widget Sources
```typescript
[
  withExpoGlanceWidgets,
  {
    // Comma-separated paths for multiple widget sources
    widgetClassPath: "widgets/weather/,widgets/calendar/,widgets/news/",
    resPath: "widgets/weather/res,widgets/calendar/res,widgets/news/res"
  }
]
```

## Path Handling

### Supported Path Types

1. **Relative paths** (from your Expo project root):
   ```typescript
   widgetClassPath: "widgets/android/"
   widgetClassPath: "../external-widgets/"
   ```

2. **Absolute paths** (anywhere on your system):
   ```typescript
   widgetClassPath: "C:\\Users\\user\\AndroidStudioProjects\\MyApp\\widgets\\"
   widgetClassPath: "/home/user/android-projects/widgets/"
   ```

3. **Auto-sync directories** (created automatically):
   ```typescript
   syncDirectory: "widgets/android"  // Creates and uses this directory
   ```

### Smart File Detection

The plugin automatically detects widget files by:
- Looking for files containing `GlanceAppWidget`, `AppWidgetProvider`
- Prioritizing files with "Widget" in the filename
- Recursively searching directories
- Validating actual widget code content

## Data Types Reference

### Supported SharedPreferences Types

| JavaScript Type | Kotlin Type | Example |
|----------------|-------------|---------|
| `string` | `String` | `"Hello World"` |
| `number` (int) | `Int` | `42` |
| `number` (float) | `Float` | `3.14` |
| `boolean` | `Boolean` | `true` |
| `null` | `null` | `null` (removes key) |

### JSON Data Patterns

```typescript
// Simple object
await SharedPreferences.set('settings', JSON.stringify({
  theme: 'dark',
  fontSize: 16
}));

// Array data
await SharedPreferences.set('scores', JSON.stringify([100, 85, 92]));

// Complex nested data
await SharedPreferences.set('user', JSON.stringify({
  profile: {
    name: 'John',
    avatar: 'https://...'
  },
  stats: {
    level: 25,
    xp: 15000
  }
}));
```

## Troubleshooting

### Common Issues

1. **SharedPreferences not working**:
   - Ensure you've run `expo run:android` after adding the plugin
   - Check that the native module is properly installed
   - Verify your package.json includes the module

2. **Widget not updating**:
   - Widgets update on their own schedule
   - Use `AppWidgetManager.updateAppWidget()` to force updates
   - Check widget receiver is properly registered

3. **JSON parsing errors**:
   - Always validate JSON before parsing in Kotlin
   - Use try-catch blocks around JSON operations
   - Provide default values for missing data

### Debug Tips

```typescript
// Check what's stored
const allData = await SharedPreferences.getAll();
console.log('All SharedPreferences data:', allData);

// Verify specific keys
const value = await SharedPreferences.get('your_key');
console.log('Stored value:', value, typeof value);
```

```kotlin
// Kotlin debugging
val sharedPrefs = SharedPreferencesHelper.create(context)
val allData = sharedPrefs.getAll()
Log.d("Widget", "All data: $allData")
```

## Requirements

- Expo SDK 50 or higher
- Android target SDK 24 or higher
- Kotlin 2.0 support (automatically configured)

## License

MIT
