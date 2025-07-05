# Expo Glance Widget Module

A comprehensive Expo module for creating Android Glance Widgets with shared preferences integration and automatic file synchronization.

## Features

✅ **Complete Android Glance Widget support**  
✅ **DataStore API for modern data persistence (Recommended)**  
✅ **SharedPreferences API for legacy compatibility**  
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

### 3. Use DataStore in Your App (Recommended)

```typescript
import { DataStore } from 'expo-glance-widget';

// Set data that widgets can read using currentState()
await DataStore.set('wakatime_hours', '08:45');
await DataStore.set('widget_title', 'Hello World!');
await DataStore.set('user_score', 1250);
await DataStore.set('is_premium', true);

// Complex data as JSON
await DataStore.set('user_profile', JSON.stringify({
  name: 'John Doe',
  level: 42,
  achievements: ['first_win', 'speed_demon']
}));
```

## DataStore API (Recommended)

DataStore is the modern replacement for SharedPreferences and works seamlessly with Glance widgets using `currentState()`. It provides better performance, type safety, and coroutines support.

### JavaScript/TypeScript API

#### Basic Operations

```typescript
import { DataStore } from 'expo-glance-widget';

// Set values
await DataStore.set('key', 'value');
await DataStore.set('count', 42);
await DataStore.set('enabled', true);

// Get values
const text = await DataStore.get('key'); // string | null
const count = await DataStore.get('count'); // number | null
const enabled = await DataStore.get('enabled'); // boolean | null

// Remove values
await DataStore.remove('key');

// Clear all
await DataStore.clear();

// Get all key-value pairs
const allData = await DataStore.getAll();
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

await DataStore.set('user_data', JSON.stringify(userData));

// Retrieve and parse JSON
const storedData = await DataStore.get('user_data');
if (storedData) {
  const parsed = JSON.parse(storedData as string);
  console.log(parsed.name); // 'Alice'
}
```

#### Updating Widgets Automatically

Jetpack Glance widgets don't automatically update when DataStore changes. You can use the `setAndUpdateWidgets` method to update DataStore and trigger a widget update in one call:

```typescript
// Update DataStore and refresh widget in one call
await DataStore.setAndUpdateWidgets(
  'widget_title',           // key
  'New Title',              // value
  'com.example.MyWidget',   // fully qualified widget class name
  { name: 'custom_store' }  // optional DataStore options
);
```

This is useful when you want to ensure your widget is updated immediately after changing data, rather than waiting for the next scheduled update or user interaction.

#### Convenience Functions

```typescript
import { 
  setDataStore,
  getDataStore,
  removeDataStore,
  clearDataStore,
  getAllDataStore
} from 'expo-glance-widget';

// Direct function calls (same as DataStore methods)
await setDataStore('key', 'value');
const value = await getDataStore('key');
```

#### Custom DataStore Names

```typescript
// Use different DataStore instances
const options = { name: 'widget_settings' };

await DataStore.set('theme', 'dark', options);
const theme = await DataStore.get('theme', options);

// Set default options for all operations
DataStore.setDefaultOptions({ name: 'my_app_widgets' });
```

### Kotlin API (In Widgets)

#### Using currentState() (Recommended)

```kotlin
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.glance.currentState

class MyWidget : GlanceAppWidget() {
    // Define preference keys
    private val wakatimeHoursKey = stringPreferencesKey("wakatime_hours")
    private val userScoreKey = stringPreferencesKey("user_score")
    
    override suspend fun provideGlance(context: Context, id: GlanceId) {
        provideContent {
            // Read data set from JavaScript using currentState
            val hours = currentState(key = wakatimeHoursKey) ?: "--:--"
            val score = currentState(key = userScoreKey) ?: "0"
            
            GlanceTheme {
                Column {
                    Text(text = "Hours: $hours")
                    Text(text = "Score: $score")
                }
            }
        }
    }
}
```

#### Using DataStoreHelper Directly

```kotlin
import expo.modules.glancewidget.DataStoreHelper

class MyWidget : GlanceAppWidget() {
    override suspend fun provideGlance(context: Context, id: GlanceId) {
        val dataStore = DataStoreHelper.create(context)
        
        // Read data set from JavaScript
        val title = dataStore.getString("widget_title", "Default Title")
        val score = dataStore.getInt("user_score", 0)
        val isPremium = dataStore.getBoolean("is_premium", false)
        
        // Parse JSON data
        val userDataJson = dataStore.getString("user_data", "{}")
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

### 4. Use SharedPreferences in Your App (Legacy)

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

## SharedPreferences API (Legacy)

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

## Complete Widget Example (DataStore)

### JavaScript Side (App)

```typescript
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { DataStore } from 'expo-glance-widget';

export default function WidgetControlScreen() {
  const [title, setTitle] = useState('');
  const [count, setCount] = useState(0);
  const [wakatimeHours, setWakatimeHours] = useState('--:--');

  const updateWidget = async () => {
    // Update widget data using DataStore
    await DataStore.set('widget_title', title);
    await DataStore.set('widget_count', count);
    await DataStore.set('wakatime_hours', wakatimeHours);
    await DataStore.set('last_update', new Date().toISOString());
    
    // Complex data example
    await DataStore.set('widget_config', JSON.stringify({
      theme: 'dark',
      showIcon: true,
      refreshInterval: 300000 // 5 minutes
    }));
    
    console.log('Widget data updated with DataStore!');
  };

  const generateRandomHours = () => {
    const hours = Math.floor(Math.random() * 12);
    const minutes = Math.floor(Math.random() * 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>DataStore Widget Control</Text>
      
      <View style={styles.section}>
        <Text style={styles.label}>Widget Title:</Text>
        <TextInput 
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Enter widget title"
        />
      </View>
      
      <View style={styles.section}>
        <Text>Count: {count}</Text>
        <Button title="+" onPress={() => setCount(count + 1)} />
        <Button title="-" onPress={() => setCount(Math.max(0, count - 1))} />
      </View>
      
      <View style={styles.section}>
        <Text>Wakatime Hours: {wakatimeHours}</Text>
        <Button title="Generate Random" onPress={() => setWakatimeHours(generateRandomHours())} />
      </View>
      
      <Button title="Update Widget" onPress={updateWidget} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  section: { marginBottom: 20 },
  label: { fontSize: 16, marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 10, borderRadius: 8 },
});
```

### Kotlin Side (Widget using currentState)

```kotlin
package com.yourpackage.widgets

import android.content.ComponentName
import android.content.Context
import androidx.compose.ui.unit.sp
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.glance.*
import androidx.glance.action.actionStartActivity
import androidx.glance.action.clickable
import androidx.glance.appwidget.*
import androidx.glance.appwidget.components.*
import androidx.glance.layout.*
import androidx.glance.text.*
import com.google.gson.Gson

data class WidgetConfig(
    val theme: String,
    val showIcon: Boolean,
    val refreshInterval: Long
)

class MyDataStoreWidget : GlanceAppWidget() {
    // Define preference keys for DataStore
    private val wakatimeHoursKey = stringPreferencesKey("wakatime_hours")
    private val widgetTitleKey = stringPreferencesKey("widget_title")
    private val widgetCountKey = stringPreferencesKey("widget_count")
    private val lastUpdateKey = stringPreferencesKey("last_update")
    private val widgetConfigKey = stringPreferencesKey("widget_config")

    override suspend fun provideGlance(context: Context, id: GlanceId) {
        provideContent {
            // Get values using currentState (DataStore integration)
            val wakatimeHours = currentState(key = wakatimeHoursKey) ?: "--:--"
            val widgetTitle = currentState(key = widgetTitleKey) ?: "My Widget"
            val widgetCount = currentState(key = widgetCountKey) ?: "0"
            val lastUpdate = currentState(key = lastUpdateKey) ?: "Never"
            val widgetConfigJson = currentState(key = widgetConfigKey) ?: "{}"

            // Parse JSON configuration
            val config = try {
                Gson().fromJson(widgetConfigJson, WidgetConfig::class.java)
            } catch (e: Exception) {
                WidgetConfig("light", true, 300000)
            }

            // Create action to open app
            val componentName = ComponentName(context, MainActivity::class.java)
            val launchAppAction = actionStartActivity(componentName)

            GlanceTheme {
                Scaffold(
                    titleBar = {
                        TitleBar(
                            startIcon = if (config.showIcon) ImageProvider(R.drawable.main_app_icon) else null,
                            title = widgetTitle
                        )
                    },
                    backgroundColor = GlanceTheme.colors.widgetBackground
                ) {
                    Column(
                        modifier = GlanceModifier
                            .fillMaxSize()
                            .clickable(launchAppAction),
                        horizontalAlignment = Alignment.Horizontal.CenterHorizontally,
                        verticalAlignment = Alignment.Vertical.CenterVertically
                    ) {
                        // Main display
                        Text(
                            text = wakatimeHours,
                            style = TextStyle(
                                fontSize = 64.sp,
                                color = GlanceTheme.colors.onSurface,
                                fontWeight = FontWeight.Bold
                            )
                        )
                        
                        Text(
                            text = "Count: $widgetCount",
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
    }
    
    private fun formatTime(isoString: String): String {
        return try {
            if (isoString == "Never") return "Never"
            isoString.substring(11, 16)
        } catch (e: Exception) {
            "Never"
        }
    }
}

class MyDataStoreWidgetReceiver : GlanceAppWidgetReceiver() {
    override val glanceAppWidget: GlanceAppWidget = MyDataStoreWidget()
}
```

## Complete Widget Example (SharedPreferences - Legacy)

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
  includeDirectories?: string[];      // Specific directories to copy from
  
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
    
    // Only copy from specific directories (preserves folder structure)
    includeDirectories: ["widgets", "utils", "models"],
    
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

## Directory-Based File Copying

### Selective Directory Copying

The plugin now supports copying only from specific directories while preserving the folder structure. This is useful when you have a large Android project but only want to copy specific widget-related directories.

#### How it works:

1. **Without `includeDirectories`**: Copies all widget files from the source directory
2. **With `includeDirectories`**: Only copies files from the specified directories

#### Example Structure:
```
MyAndroidProject/
├── src/main/java/com/mycompany/
│   ├── widgets/           # ← Include this
│   │   ├── WeatherWidget.kt
│   │   └── CalendarWidget.kt
│   ├── utils/             # ← Include this
│   │   └── WidgetUtils.kt
│   ├── models/            # ← Include this
│   │   └── WeatherData.kt
│   ├── activities/        # ← Skip this
│   │   └── MainActivity.kt
│   └── services/          # ← Skip this
│       └── MyService.kt
```

#### Configuration:
```typescript
[
  withExpoGlanceWidgets,
  {
    widgetClassPath: "MyAndroidProject/src/main/java/com/mycompany/",
    includeDirectories: ["widgets", "utils", "models"],
    // This will copy:
    // - widgets/WeatherWidget.kt
    // - widgets/CalendarWidget.kt  
    // - utils/WidgetUtils.kt
    // - models/WeatherData.kt
    // But skip activities/ and services/ directories
  }
]
```

#### Result in your Expo project:
```
android/app/src/main/java/com/yourapp/
├── widgets/
│   ├── WeatherWidget.kt    # Package updated to com.yourapp.widgets
│   └── CalendarWidget.kt   # Package updated to com.yourapp.widgets
├── utils/
│   └── WidgetUtils.kt      # Package updated to com.yourapp.utils
└── models/
    └── WeatherData.kt      # Package updated to com.yourapp.models
```

### Package Name Updates

The plugin automatically updates package declarations in copied files to match your Expo project's package structure:

- Source: `package com.mycompany.widgets`
- Target: `package com.yourapp.widgets`

This ensures that all imports and references work correctly in your Expo project.

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
