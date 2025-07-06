# Migration Guide

This guide helps you migrate from older versions of the Expo Glance Widget module to the latest version.

## Version 2.0.0 Breaking Changes

### 1. Removed SharedPreferences Support

**Old (v1.x):**
```typescript
// These methods no longer exist
await ExpoGlanceWidgetModule.getSharedPrefsValue('key');
await ExpoGlanceWidgetModule.updateSharedPrefsValue('key', 'value');
await ExpoGlanceWidgetModule.getAllSharedPrefsKeys();
```

**New (v2.x):**
```typescript
// Use DataStore methods instead
await ExpoGlanceWidgetModule.getDatastoreValue('key');
await ExpoGlanceWidgetModule.updateDatastoreValue('key', 'value');
await ExpoGlanceWidgetModule.getAllDatastoreKeys();
```

### 2. Simplified Configuration

**Old (v1.x):**
```typescript
[
  withExpoGlanceWidgets,
  {
    widgetFiles: "widgets/android",
    widgetManifest: "widgets/android/AndroidManifest.xml",
    widgetResources: "widgets/android/res",
    targetPackage: "com.yourapp"
  }
]
```

**New (v2.x):**
```typescript
[
  withExpoGlanceWidgets,
  {
    widgetFilesPath: "widgets/android",
    manifestPath: "widgets/android/AndroidManifest.xml",
    resPath: "widgets/android/res",
    destinationPackageName: "com.yourapp"  // Optional - auto-detected
  }
]
```

### 3. New Directory-Based Copying

**Old (v1.x):**
```typescript
// Copied all files from source directory
[
  withExpoGlanceWidgets,
  {
    widgetFiles: "C:\\MyProject\\src\\main\\java\\com\\example"
  }
]
```

**New (v2.x):**
```typescript
// Can specify which directories to copy
[
  withExpoGlanceWidgets,
  {
    widgetFilesPath: "C:\\MyProject\\src\\main\\java\\com\\example",
    includeDirectories: ["wakatime", "ui"]  // Only copy these directories
  }
]
```

## Migration Steps

### Step 1: Update Configuration

1. Open your `app.config.ts`
2. Update the plugin configuration:

```typescript
// Before
[
  withExpoGlanceWidgets,
  {
    widgetFiles: "widgets/android",
    widgetManifest: "widgets/android/AndroidManifest.xml",
    widgetResources: "widgets/android/res"
  }
]

// After
[
  withExpoGlanceWidgets,
  {
    widgetFilesPath: "widgets/android",
    manifestPath: "widgets/android/AndroidManifest.xml",
    resPath: "widgets/android/res"
  }
]
```

### Step 2: Update Code References

Replace all SharedPreferences calls with DataStore calls:

```typescript
// Before
const getValue = async (key: string) => {
  try {
    return await ExpoGlanceWidgetModule.getSharedPrefsValue(key);
  } catch (error) {
    console.error('Error:', error);
  }
};

const setValue = async (key: string, value: string) => {
  try {
    await ExpoGlanceWidgetModule.updateSharedPrefsValue(key, value);
  } catch (error) {
    console.error('Error:', error);
  }
};

// After
const getValue = async (key: string) => {
  try {
    return await ExpoGlanceWidgetModule.getDatastoreValue(key);
  } catch (error) {
    console.error('Error:', error);
  }
};

const setValue = async (key: string, value: string) => {
  try {
    await ExpoGlanceWidgetModule.updateDatastoreValue(key, value);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

### Step 3: Update Kotlin Widget Code

**Before (SharedPreferences):**
```kotlin
val sharedPrefs = context.getSharedPreferences("widget_prefs", Context.MODE_PRIVATE)
val value = sharedPrefs.getString("key", "default")
```

**After (DataStore):**
```kotlin
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.glance.appwidget.state.getAppWidgetState

@Composable
fun MyWidget() {
    val prefs = currentState<Preferences>()
    val value = prefs[stringPreferencesKey("key")] ?: "default"
    
    // Widget UI
}
```

### Step 4: Update Build Configuration

1. Clean your build directory:
```bash
npm run prebuild:android
```

2. If you encounter build errors, try:
```bash
# Remove old build artifacts
rm -rf android/build
rm -rf android/app/build

# Rebuild
npm run prebuild:android
```

## Configuration Changes

### Renamed Properties

| Old Property | New Property | Notes |
|-------------|-------------|-------|
| `widgetFiles` | `widgetFilesPath` | More descriptive name |
| `widgetManifest` | `manifestPath` | Consistent naming |
| `widgetResources` | `resPath` | Shorter, clearer |
| `targetPackage` | `destinationPackageName` | More explicit |

### New Properties

| Property | Description | Example |
|----------|-------------|---------|
| `includeDirectories` | Specify which directories to copy | `["wakatime", "ui"]` |
| `sourcePackageName` | Source package for updates | `"com.example.widgets"` |
| `fileMatchPattern` | Pattern to match widget files | `"Widget|Provider"` |
| `syncDirectory` | Directory for external file sync | `"synced-widgets"` |

## DataStore Migration

### Data Migration

If you were using SharedPreferences in v1.x, you'll need to migrate your data:

1. **Export old data** (if needed):
```typescript
// Run this once before upgrading
const exportData = async () => {
  const keys = await ExpoGlanceWidgetModule.getAllSharedPrefsKeys();
  const data = {};
  for (const key of keys) {
    data[key] = await ExpoGlanceWidgetModule.getSharedPrefsValue(key);
  }
  console.log('Export this data:', JSON.stringify(data));
};
```

2. **Import to DataStore** (after upgrading):
```typescript
// Run this once after upgrading
const importData = async (data: Record<string, string>) => {
  for (const [key, value] of Object.entries(data)) {
    await ExpoGlanceWidgetModule.updateDatastoreValue(key, value);
  }
};
```

### Widget Data Access

**Before (SharedPreferences):**
```kotlin
class MyWidget : GlanceAppWidget() {
    override suspend fun provideGlance(context: Context, id: GlanceId) {
        val prefs = context.getSharedPreferences("widget_prefs", Context.MODE_PRIVATE)
        val data = prefs.getString("key", "default")
        // Use data...
    }
}
```

**After (DataStore):**
```kotlin
class MyWidget : GlanceAppWidget() {
    @Composable
    override fun Content() {
        val prefs = currentState<Preferences>()
        val data = prefs[stringPreferencesKey("key")] ?: "default"
        
        // Widget UI with data
        Text(text = data)
    }
}
```

## Common Issues and Solutions

### Issue: "Method not found" errors

**Solution:** Make sure you've updated all method calls:
- `getSharedPrefsValue` → `getDatastoreValue`
- `updateSharedPrefsValue` → `updateDatastoreValue`
- `getAllSharedPrefsKeys` → `getAllDatastoreKeys`

### Issue: Widget not updating

**Solution:** Ensure your widget is using the new DataStore API:
```kotlin
// Make sure you're using currentState<Preferences>()
val prefs = currentState<Preferences>()
val value = prefs[stringPreferencesKey("key")] ?: "default"
```

### Issue: Build errors after upgrade

**Solution:** Clean and rebuild:
```bash
# Remove old builds
rm -rf android/build android/app/build

# Rebuild with new configuration
npm run prebuild:android
```

### Issue: Configuration property not recognized

**Solution:** Update property names in your `app.config.ts`:
- `widgetFiles` → `widgetFilesPath`
- `widgetManifest` → `manifestPath`
- `widgetResources` → `resPath`

## Testing Your Migration

1. **Verify configuration:**
```bash
npm run prebuild:android
```
Should complete without errors.

2. **Test DataStore operations:**
```typescript
const testDataStore = async () => {
  await ExpoGlanceWidgetModule.updateDatastoreValue('test', 'value');
  const value = await ExpoGlanceWidgetModule.getDatastoreValue('test');
  console.log('DataStore test:', value === 'value' ? 'PASS' : 'FAIL');
};
```

3. **Test widget display:**
Build and run your app, then check if widgets appear correctly in the Android widget picker.

## Need Help?

If you encounter issues during migration:

1. Check the [Troubleshooting](./README.md#troubleshooting) section
2. Review the [API Reference](./API.md)
3. Look at the [Examples](./example/) directory
4. Open an issue with your specific migration problem

## Benefits of v2.0

- **Better Performance**: DataStore is more efficient than SharedPreferences
- **Type Safety**: Better TypeScript support
- **Selective Copying**: Only copy the directories you need
- **Auto-detection**: Automatic package name detection
- **Modern Architecture**: Based on latest Android development practices
