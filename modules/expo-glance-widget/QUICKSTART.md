# Quick Start Guide

This guide will help you get started with Expo Glance Widget in under 5 minutes.

## Prerequisites

- Expo SDK 53+
- Android development environment
- Node.js and npm/yarn

## Step 1: Install the Module

```bash
# In your Expo project root
npm install ./modules/expo-glance-widget
```

## Step 2: Configure app.config.ts

```typescript
import { withExpoGlanceWidgets } from "./modules/expo-glance-widget/plugins";

export default {
  name: "MyApp",
  slug: "myapp",
  // ... other config
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

## Step 3: Create Your First Widget

Create `widgets/android/MyWidget.kt`:

```kotlin
package com.yourapp.widgets

import androidx.compose.runtime.Composable
import androidx.glance.GlanceModifier
import androidx.glance.appwidget.GlanceAppWidget
import androidx.glance.appwidget.GlanceAppWidgetReceiver
import androidx.glance.layout.Column
import androidx.glance.layout.fillMaxSize
import androidx.glance.layout.padding
import androidx.glance.text.Text
import androidx.glance.unit.dp

class MyWidget : GlanceAppWidget() {
    @Composable
    override fun Content() {
        Column(
            modifier = GlanceModifier
                .fillMaxSize()
                .padding(16.dp)
        ) {
            Text("Hello from Expo Glance Widget!")
        }
    }
}

class MyWidgetReceiver : GlanceAppWidgetReceiver() {
    override val glanceAppWidget: GlanceAppWidget = MyWidget()
}
```

## Step 4: Create Widget Manifest

Create `widgets/android/AndroidManifest.xml`:

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <application>
        <receiver
            android:name=".MyWidgetReceiver"
            android:exported="true">
            <intent-filter>
                <action android:name="android.appwidget.action.APPWIDGET_UPDATE" />
            </intent-filter>
            <meta-data
                android:name="android.appwidget.provider"
                android:resource="@xml/my_widget_info" />
        </receiver>
    </application>
</manifest>
```

## Step 5: Create Widget Configuration

Create `widgets/android/res/xml/my_widget_info.xml`:

```xml
<?xml version="1.0" encoding="utf-8"?>
<appwidget-provider xmlns:android="http://schemas.android.com/apk/res/android"
    android:minWidth="180dp"
    android:minHeight="40dp"
    android:updatePeriodMillis="300000"
    android:previewImage="@drawable/widget_preview"
    android:initialLayout="@layout/widget_loading"
    android:resizeMode="horizontal|vertical"
    android:widgetCategory="home_screen"
    android:description="@string/widget_description">
</appwidget-provider>
```

## Step 6: Build and Test

```bash
# Build the project
npm run prebuild:android

# Run on Android device
npm run android
```

## Step 7: Add DataStore Integration

In your React Native component:

```typescript
import ExpoGlanceWidgetModule from 'expo-glance-widget';

// Update widget data
await ExpoGlanceWidgetModule.updateDatastoreValue('message', 'Hello Widget!');
```

Update your widget to read from DataStore:

```kotlin
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.glance.appwidget.state.getAppWidgetState

@Composable
override fun Content() {
    val prefs = currentState<Preferences>()
    val message = prefs[stringPreferencesKey("message")] ?: "Default message"
    
    Column(
        modifier = GlanceModifier.fillMaxSize().padding(16.dp)
    ) {
        Text(message)
    }
}
```

## You're Done! 🎉

Your widget should now be available in the Android widget picker and can be controlled from your React Native app.

## Next Steps

- Check out the [Complete Examples](./example/) directory
- Read the [DataStore Usage Guide](./example/DataStoreUsage.md)
- Learn about [External Project Integration](./example/DirectoryBasedCopyingExample.md)
