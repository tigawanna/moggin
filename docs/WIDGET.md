# Building Android Widgets in Expo with Custom Native Modules

A guide to creating Android home screen widgets using Expo modules, complete with state management, auto-updates, and best practices.

## Table of Contents

1. [Overview](#overview)
2. [High-Level Process](#high-level-process)
3. [Native Modules vs Native Views](#native-modules-vs-native-views)
4. [Development Client Setup](#development-client-setup)
5. [Quick Start (TL;DR)](#quick-start-tldr)
6. [Prerequisites](#prerequisites)
7. [Project Structure](#project-structure)
8. [Step-by-Step Implementation](#step-by-step-implementation)
9. [Advanced Features](#advanced-features)
10. [Best Practices](#best-practices)
11. [Troubleshooting](#troubleshooting)
12. [Examples](#examples)
13. [References](#references)

## Overview

This guide demonstrates how to create Android home screen widgets in Expo applications using custom native modules. Unlike traditional widgets that exist independently, this approach allows seamless integration between your React Native app and Android widgets with shared state management.

### What You'll Learn

- Create custom Expo modules for Android widgets
- Implement widget logic in Kotlin with Jetpack Compose Glance
- Set up state management between app and widget
- Configure auto-updating widgets with WorkManager
- Use config plugins for build-time configurations

## High-Level Process

Before diving into the specifics, here's the overall workflow for creating Android widgets in Expo:

### 1. **Architecture Overview**
```
┌─────────────────────────────────────────────────────────────────┐
│                     Expo React Native App                      │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐    ┌─────────────────┐                   │
│  │  Native Module  │◄──►│  Android Widget │                   │
│  │  (Bridge Layer) │    │  (Glance UI)    │                   │
│  └─────────────────┘    └─────────────────┘                   │
├─────────────────────────────────────────────────────────────────┤
│                   Android System Layer                         │
│  ┌─────────────────┐    ┌─────────────────┐                   │
│  │ App Manifest    │◄──►│ Widget Manifest │                   │
│  │ (Main Entry)    │    │ (Widget Entry)  │                   │
│  └─────────────────┘    └─────────────────┘                   │
└─────────────────────────────────────────────────────────────────┘
```

### 2. **Build Process Flow**
1. **Development**: Write widget code in Kotlin using Jetpack Compose Glance
2. **Native Module**: Create bridge between React Native and Android widget
3. **Config Plugins**: Configure build-time settings and manifest merging
4. **Prebuild**: `expo prebuild` merges widget manifest into main app manifest
5. **Build**: Standard Android build process includes widget in APK
6. **Runtime**: Widget appears in launcher, communicates with app via native module

### 3. **Key Components**
- **Jetpack Compose Glance**: Modern UI framework for widgets
- **Expo Module**: Bridge between React Native and native Android code
- **Config Plugins**: Build-time configuration and manifest manipulation
- **WorkManager**: Background tasks for widget updates
- **DataStore**: Persistent state management for widgets

## Native Modules vs Native Views

Understanding the distinction between native modules and native views is crucial for widget development:

### Native Views
- **Purpose**: Custom UI components rendered within the React Native app
- **Lifecycle**: Managed by React Native's UI thread
- **Entry Point**: React Native component tree
- **Examples**: Custom buttons, charts, camera views
- **Manifest**: No direct manifest entries needed

### Native Modules (Our Choice)
- **Purpose**: Bridge between JavaScript and native platform APIs
- **Lifecycle**: Independent of React Native UI lifecycle
- **Entry Point**: Native Android system (AndroidManifest.xml)
- **Examples**: File system access, device sensors, **widgets**
- **Manifest**: Requires explicit manifest declarations

### Why We Use Native Modules for Widgets

```kotlin
// Widget exists independently of the React Native app
// Entry point is the Android system, not React Native
<receiver android:name="expo.modules.widget.widgets.MyWidgetReceiver">
    <intent-filter>
        <action android:name="android.appwidget.action.APPWIDGET_UPDATE" />
    </intent-filter>
</receiver>
```

**Key Reasons:**

1. **System Integration**: Widgets are launched by the Android system, not React Native
2. **Independent Lifecycle**: Widgets must function even when the main app is closed
3. **Manifest Entry Point**: Widget receiver must be declared in AndroidManifest.xml
4. **Background Operation**: Widgets can update independently of the main app
5. **System Services**: Direct access to Android system services and broadcasts

> **Important**: The widget's AndroidManifest.xml declarations (in the native module) get merged into the main app's manifest during `expo prebuild`, making the widget discoverable by the Android system.

## Development Client Setup

### Prerequisites

Before starting, ensure you have:

- **Expo CLI**: `npm install -g @expo/cli`
- **Android Studio**: Properly configured for React Native development (see [Android Studio with react native Setup Guide](https://dev.to/tigawanna/setting-up-android-studio-on-linux-for-react-native-expo-development-57ee))
- **Node.js**: Version 18 or higher
- **Basic Knowledge**: React Native, Kotlin, and Android development concepts

### Using Expo Dev Client

For widget development, you'll need to use **Expo Dev Client** instead of Expo Go, as widgets require custom native code:

#### 1. Install Development Build Dependencies

```bash
# Install expo-dev-client
npx expo install expo-dev-client

```

#### 2. Configure Development Build

Add to your `app.config.ts`:

```typescript
export default {
  expo: {
    name: "your-app-name",
    plugins: [
      "expo-dev-client",
      // Your widget config plugins
      "./modules/expo-widget-module/plugins/withWidgetConfig",
    ],
    ios: {
      bundleIdentifier: "com.yourcompany.yourapp",
    },
    android: {
      package: "com.yourcompany.yourapp",
    },
  },
};
```

#### 3. Create Development Build

```bash
# For local development
npx expo run:android

# Or create a development build
eas build --profile development --platform android
```

#### 4. Widget Testing Workflow

```bash
# 1. Make changes to widget code
# 2. Rebuild native code (required for native changes)
npx expo run:android

# 3. Test widget functionality
# 4. For JS-only changes, use fast refresh as normal
```

> **Note**: Unlike pure JavaScript changes, widget modifications require a full native rebuild since they involve Kotlin code and manifest changes.

## Quick Start (TL;DR)

1. **Create Expo Module**: Generate a new Expo module for your widget
2. **Implement Widget Logic**: Write Kotlin/Java code using Jetpack Compose Glance
3. **Declare Widget**: Add widget configuration to AndroidManifest.xml
4. **Auto-Integration**: Widget automatically includes when running `expo prebuild`
5. **State Management**: Create native module methods to update widget state
6. **Auto-Updates**: Use WorkManager with config plugins for background updates
7. **Build Configuration**: Use config plugins for project-level dependencies



## Project Structure

```
your-expo-app/
├── modules/
│   └── expo-widget-module/
│       ├── android/
│       │   ├── src/main/java/expo/modules/widget/
│       │   │   ├── ExpoWidgetModule.kt
│       │   │   ├── widgets/
│       │   │   │   ├── MyWidget.kt
│       │   │   │   └── MyWidgetReceiver.kt
│       │   │   └── utils/
│       │   │       └── WidgetConstants.kt
│       │   └── build.gradle
│       ├── src/
│       │   ├── index.ts
│       │   └── ExpoWidgetModule.types.ts
│       ├── plugins/
│       │   └── withWidgetConfig.ts
│       └── expo-module.config.json
├── app.config.ts
└── package.json
```

## Step-by-Step Implementation

### Step 1: Create the Expo Module

```bash
# Create a new Expo module
npx create-expo-module expo-widget-module --local

# Navigate to the module directory
cd modules/expo-widget-module
```

### Step 2: Configure Module Dependencies

Edit `android/build.gradle`:

```gradle
dependencies {
  implementation project(':expo-modules-core')
  
  // Jetpack Compose Glance for widgets
  implementation "androidx.glance:glance-appwidget:1.0.0"
  implementation "androidx.glance:glance-material3:1.0.0"
  
  // WorkManager for background updates
  implementation "androidx.work:work-runtime-ktx:2.8.1"
  
  // DataStore for widget state
  implementation "androidx.datastore:datastore-preferences:1.0.0"
  
  // Coroutines
  implementation "org.jetbrains.kotlinx:kotlinx-coroutines-android:1.6.4"
}
```

### Step 3: Implement the Widget

Create `android/src/main/java/expo/modules/widget/widgets/MyWidget.kt`:

```kotlin
package expo.modules.widget.widgets

import androidx.compose.runtime.Composable
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.glance.GlanceId
import androidx.glance.GlanceModifier
import androidx.glance.appwidget.GlanceAppWidget
import androidx.glance.appwidget.provideContent
import androidx.glance.layout.Alignment
import androidx.glance.layout.Column
import androidx.glance.layout.fillMaxSize
import androidx.glance.layout.padding
import androidx.glance.text.FontWeight
import androidx.glance.text.Text
import androidx.glance.text.TextStyle
import androidx.glance.currentState
import androidx.glance.state.GlanceStateDefinition
import androidx.glance.state.PreferencesGlanceStateDefinition
import android.content.Context

class MyWidget : GlanceAppWidget() {
    
    override val stateDefinition: GlanceStateDefinition<*> = PreferencesGlanceStateDefinition
    
    override suspend fun provideGlance(context: Context, id: GlanceId) {
        provideContent {
            WidgetContent()
        }
    }
    
    @Composable
    private fun WidgetContent() {
        val prefs = currentState<androidx.datastore.preferences.core.Preferences>()
        val title = prefs[stringPreferencesKey("widget_title")] ?: "Default Title"
        val subtitle = prefs[stringPreferencesKey("widget_subtitle")] ?: "Default Subtitle"
        
        Column(
            modifier = GlanceModifier
                .fillMaxSize()
                .padding(16.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(
                text = title,
                style = TextStyle(
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold
                )
            )
            
            Text(
                text = subtitle,
                style = TextStyle(
                    fontSize = 14.sp
                )
            )
        }
    }
}
```

### Step 4: Create Widget Receiver

Create `android/src/main/java/expo/modules/widget/widgets/MyWidgetReceiver.kt`:

```kotlin
package expo.modules.widget.widgets

import androidx.glance.appwidget.GlanceAppWidget
import androidx.glance.appwidget.GlanceAppWidgetReceiver

class MyWidgetReceiver : GlanceAppWidgetReceiver() {
    override val glanceAppWidget: GlanceAppWidget = MyWidget()
}
```

### Step 5: Implement the Native Module

Create `android/src/main/java/expo/modules/widget/ExpoWidgetModule.kt`:

```kotlin
package expo.modules.widget

import android.content.Context
import androidx.glance.appwidget.GlanceAppWidgetManager
import androidx.glance.appwidget.state.updateAppWidgetState
import androidx.glance.appwidget.updateAll
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import expo.modules.kotlin.records.Field
import expo.modules.kotlin.records.Record
import expo.modules.widget.widgets.MyWidget
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import androidx.datastore.preferences.core.stringPreferencesKey

data class WidgetData(
    @Field val title: String,
    @Field val subtitle: String
) : Record

class ExpoWidgetModule : Module() {
    private val context: Context
        get() = requireNotNull(appContext.reactContext)
    
    override fun definition() = ModuleDefinition {
        Name("ExpoWidgetModule")
        
        AsyncFunction("updateWidget") { data: WidgetData ->
            CoroutineScope(Dispatchers.IO).launch {
                try {
                    val glanceIds = GlanceAppWidgetManager(context)
                        .getGlanceIds(MyWidget::class.java)
                    
                    glanceIds.forEach { glanceId ->
                        updateAppWidgetState(context, glanceId) { prefs ->
                            prefs[stringPreferencesKey("widget_title")] = data.title
                            prefs[stringPreferencesKey("widget_subtitle")] = data.subtitle
                        }
                    }
                    
                    MyWidget().updateAll(context)
                } catch (e: Exception) {
                    e.printStackTrace()
                }
            }
        }
        
        AsyncFunction("refreshWidget") {
            CoroutineScope(Dispatchers.IO).launch {
                try {
                    MyWidget().updateAll(context)
                } catch (e: Exception) {
                    e.printStackTrace()
                }
            }
        }
    }
}
```

### Step 6: TypeScript Interface

Create `src/ExpoWidgetModule.types.ts`:

```typescript
export interface WidgetData {
  title: string;
  subtitle: string;
}

export interface ExpoWidgetModuleEvents {
  updateWidget: (data: WidgetData) => void;
  refreshWidget: () => void;
}
```

Create `src/index.ts`:

```typescript
import ExpoWidgetModule from './ExpoWidgetModule';
import type { WidgetData } from './ExpoWidgetModule.types';

export async function updateWidget(data: WidgetData): Promise<void> {
  return ExpoWidgetModule.updateWidget(data);
}

export async function refreshWidget(): Promise<void> {
  return ExpoWidgetModule.refreshWidget();
}

export type { WidgetData };
```

### Step 7: Android Manifest Configuration

The widget needs to be declared in AndroidManifest.xml. Create a config plugin at `plugins/withWidgetConfig.ts`:

```typescript
import { ConfigPlugin, withAndroidManifest } from '@expo/config-plugins';

const withWidgetConfig: ConfigPlugin = (config) => {
  return withAndroidManifest(config, (config) => {
    const { manifest } = config.modResults;
    
    if (!manifest.application) {
      manifest.application = [];
    }
    
    const application = manifest.application[0];
    
    if (!application.receiver) {
      application.receiver = [];
    }
    
    // Add widget receiver
    application.receiver.push({
      $: {
        'android:name': 'expo.modules.widget.widgets.MyWidgetReceiver',
        'android:exported': 'false',
      },
      'intent-filter': [
        {
          action: [
            { $: { 'android:name': 'android.appwidget.action.APPWIDGET_UPDATE' } },
          ],
        },
      ],
      'meta-data': [
        {
          $: {
            'android:name': 'android.appwidget.provider',
            'android:resource': '@xml/my_widget_info',
          },
        },
      ],
    });
    
    return config;
  });
};

export default withWidgetConfig;
```

### Step 8: Widget Info XML

Create `android/src/main/res/xml/my_widget_info.xml`:

```xml
<?xml version="1.0" encoding="utf-8"?>
<appwidget-provider xmlns:android="http://schemas.android.com/apk/res/android"
    android:minWidth="250dp"
    android:minHeight="110dp"
    android:updatePeriodMillis="0"
    android:previewImage="@mipmap/ic_launcher"
    android:initialLayout="@layout/widget_loading"
    android:configure="expo.modules.widget.widgets.MyWidgetReceiver"
    android:widgetCategory="home_screen" />
```

## Advanced Features

### Auto-Updating with WorkManager

For widgets that need regular updates, implement WorkManager:

```kotlin
// In your ExpoWidgetModule.kt
AsyncFunction("scheduleWidgetUpdates") { intervalMinutes: Int ->
    val workRequest = PeriodicWorkRequestBuilder<WidgetUpdateWorker>(
        intervalMinutes.toLong(), TimeUnit.MINUTES
    ).build()
    
    WorkManager.getInstance(context).enqueueUniquePeriodicWork(
        "widget_update_work",
        ExistingPeriodicWorkPolicy.REPLACE,
        workRequest
    )
}
```

### Config Plugin for WorkManager Initialization

Create a config plugin to initialize WorkManager in MainActivity:

```typescript
import { ConfigPlugin, withMainActivity } from '@expo/config-plugins';

const withWorkManagerInit: ConfigPlugin = (config) => {
  return withMainActivity(config, (config) => {
    const { modResults } = config;
    
    // Add WorkManager initialization
    const workManagerInit = `
    import androidx.work.Configuration
    import androidx.work.WorkManager
    
    // In onCreate method
    WorkManager.initialize(this, Configuration.Builder().build())
    `;
    
    // Insert the initialization code
    // (Implementation depends on your specific needs)
    
    return config;
  });
};

export default withWorkManagerInit;
```

## Best Practices

### 1. State Management

- **Use DataStore**: For persistent widget state
- **Minimize Updates**: Only update when necessary to save battery
- **Error Handling**: Always wrap widget operations in try-catch blocks

### 2. Performance Optimization

- **Lazy Loading**: Load data only when widget is visible
- **Caching**: Cache frequently accessed data
- **Background Processing**: Use coroutines for heavy operations

### 3. User Experience

- **Loading States**: Show loading indicators during updates
- **Error States**: Provide meaningful error messages
- **Responsive Design**: Support different widget sizes

### 4. Development Workflow

- **Config Plugins**: Use for build-time configurations
- **Never Edit android/ Directly**: Use Expo prebuild for native changes
- **Version Control**: Include generated files in .gitignore

## Troubleshooting

### Common Issues

1. **Widget Not Appearing**
   - Check AndroidManifest.xml configuration
   - Verify widget receiver is properly declared
   - Ensure widget info XML is correctly configured

2. **State Not Updating**
   - Verify DataStore keys match between update and display
   - Check if widget is properly refreshed after state changes
   - Ensure coroutines are running on correct dispatcher

3. **Build Errors**
   - Check Gradle dependencies are correctly added
   - Verify Kotlin version compatibility
   - Ensure proper plugin configuration

### Debug Tips

```kotlin
// Add logging to debug widget updates
import android.util.Log

Log.d("WidgetDebug", "Updating widget with title: ${data.title}")
```

## Examples

### Basic Usage in React Native

```typescript
import { updateWidget } from 'expo-widget-module';

const handleUpdateWidget = async () => {
  try {
    await updateWidget({
      title: "Hello World",
      subtitle: "Updated from React Native"
    });
  } catch (error) {
    console.error("Failed to update widget:", error);
  }
};
```

### Integration with App State

```typescript
import { useEffect } from 'react';
import { AppState } from 'react-native';
import { refreshWidget } from 'expo-widget-module';

export function useWidgetSync() {
  useEffect(() => {
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === 'active') {
        refreshWidget();
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription?.remove();
  }, []);
}
```

## Conclusion

This guide provides a complete foundation for creating Android widgets in Expo applications. The combination of Jetpack Compose Glance, Expo modules, and config plugins enables powerful widget functionality while maintaining the simplicity of Expo development.

### Key Takeaways

- **Modular Design**: Keep widget logic separate from main app
- **State Management**: Use DataStore for persistent widget state
- **Config Plugins**: Automate build-time configurations
- **Best Practices**: Follow Android widget development guidelines
- **Performance**: Optimize for battery and memory usage

For more advanced use cases, consider exploring WorkManager for background tasks, Room database for complex data storage, and Material3 theming for consistent design.

## References

### Official Documentation & Videos

- **[Official Google I/O Introduction to Jetpack Glance](https://youtu.be/jI1LKN7jBVk?si=_8AhFibmtshXnd5Q)** - Comprehensive overview of Jetpack Glance for building app widgets
- **[How to Build a Widget that Updates using Jetpack Glance and Expo](https://www.youtube.com/watch?v=4ntd94QgL-c&t=1s)** - Practical tutorial on widget development with Expo

### Example Implementation

- **[Moggin - WakaTime Glance Widgets](https://github.com/tigawanna/moggin/tree/master/modules/expo-wakatime-glance-widgets)** - Complete working example of an Expo widget module with:
  - WakaTime API integration
  - Auto-updating widget with WorkManager
  - Config plugins for build automation
  - State management with DataStore
  - Real-world production implementation

### Additional Resources

- **[Expo Modules Documentation](https://docs.expo.dev/modules/overview/)** - Official Expo modules guide
- **[Jetpack Compose Glance Documentation](https://developer.android.com/jetpack/compose/glance)** - Android's official Glance documentation
- **[Android App Widgets Overview](https://developer.android.com/guide/topics/appwidgets)** - Comprehensive Android widget development guide

---

**Repository Structure**: This guide can be implemented as a complete example repository with working code samples, making it easy for developers to fork and customize for their specific needs.
