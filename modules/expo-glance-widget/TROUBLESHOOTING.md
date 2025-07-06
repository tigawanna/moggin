# Troubleshooting Guide

This guide covers common issues and solutions when using the Expo Glance Widget module.

## Common Issues

### 1. Widget Not Appearing in Widget Picker

**Symptoms:**
- Widget doesn't show up in Android widget picker
- No error messages during build

**Possible Causes:**
- Widget receiver not properly registered in manifest
- Missing widget provider XML
- Package name mismatch

**Solutions:**

1. **Check Widget Receiver Registration:**
```xml
<!-- widgets/android/AndroidManifest.xml -->
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
```

2. **Verify Widget Provider XML:**
```xml
<!-- widgets/android/res/xml/my_widget_info.xml -->
<appwidget-provider xmlns:android="http://schemas.android.com/apk/res/android"
    android:minWidth="180dp"
    android:minHeight="40dp"
    android:updatePeriodMillis="300000"
    android:widgetCategory="home_screen"
    android:description="@string/widget_description">
</appwidget-provider>
```

3. **Check Package Names:**
```bash
# Check if package names match
grep -r "package " widgets/android/
```

### 2. Build Errors

**Symptoms:**
- Build fails with Kotlin compilation errors
- Missing dependencies errors
- Package resolution issues

**Solutions:**

1. **Clean Build:**
```bash
# Remove all build artifacts
rm -rf android/build
rm -rf android/app/build
npm run prebuild:android
```

2. **Check Expo SDK Version:**
```json
// package.json
{
  "dependencies": {
    "expo": "~53.0.0"  // Must be 53 or higher
  }
}
```

3. **Verify Plugin Configuration:**
```typescript
// app.config.ts
[
  withExpoGlanceWidgets,
  {
    widgetFilesPath: "widgets/android",  // Path must exist
    manifestPath: "widgets/android/AndroidManifest.xml",
    resPath: "widgets/android/res"
  }
]
```

### 3. DataStore Errors

**Symptoms:**
- "DATASTORE_ERROR" when calling module methods
- Widget showing default values instead of stored data

**Solutions:**

1. **Check DataStore Access:**
```typescript
// Test DataStore connectivity
const testDataStore = async () => {
  try {
    await ExpoGlanceWidgetModule.updateDatastoreValue('test', 'value');
    const result = await ExpoGlanceWidgetModule.getDatastoreValue('test');
    console.log('DataStore test:', result === 'value' ? 'PASS' : 'FAIL');
  } catch (error) {
    console.error('DataStore error:', error);
  }
};
```

2. **Verify Widget DataStore Usage:**
```kotlin
// Make sure widget is using currentState<Preferences>()
@Composable
override fun Content() {
    val prefs = currentState<Preferences>()
    val value = prefs[stringPreferencesKey("key")] ?: "default"
    
    Text(text = value)
}
```

3. **Check Context Access:**
```kotlin
// Ensure proper context in native module
private val context
    get() = requireNotNull(appContext.reactContext)
```

### 4. File Copying Issues

**Symptoms:**
- Widget files not found during build
- Package names not updated correctly
- Missing resources

**Solutions:**

1. **Verify File Paths:**
```bash
# Check if files exist
ls -la widgets/android/
ls -la widgets/android/res/
```

2. **Check Include Directories:**
```typescript
// If using includeDirectories, ensure they exist
[
  withExpoGlanceWidgets,
  {
    widgetFilesPath: "C:\\MyProject\\src\\main\\java\\com\\example",
    includeDirectories: ["wakatime", "ui"],  // These must exist
  }
]
```

3. **Verify External Paths:**
```typescript
// For external projects, use absolute paths
{
  widgetFilesPath: "C:\\Users\\user\\MyProject\\app\\src\\main\\java\\com\\example",
  manifestPath: "C:\\Users\\user\\MyProject\\app\\src\\main\\AndroidManifest.xml",
  resPath: "C:\\Users\\user\\MyProject\\app\\src\\main\\res"
}
```

### 5. Widget Update Issues

**Symptoms:**
- Widget shows old data after updating from React Native
- Changes not reflected in widget UI

**Solutions:**

1. **Force Widget Update:**
```typescript
// After updating DataStore, you might need to trigger widget update
await ExpoGlanceWidgetModule.updateDatastoreValue('key', 'value');
// Widget should update automatically, but may take time
```

2. **Check Widget Update Period:**
```xml
<!-- Reduce update interval for testing -->
<appwidget-provider
    android:updatePeriodMillis="30000">  <!-- 30 seconds -->
</appwidget-provider>
```

3. **Verify Widget State Management:**
```kotlin
// Ensure widget is reading from DataStore correctly
@Composable
override fun Content() {
    val prefs = currentState<Preferences>()
    val data = prefs[stringPreferencesKey("key")] ?: "default"
    
    // Add debug logging
    Log.d("MyWidget", "Widget data: $data")
    
    Text(text = data)
}
```

## Debug Techniques

### 1. Enable Debug Logging

Check console output during build for plugin debug information:

```bash
npm run prebuild:android 2>&1 | grep -i "ExpoGlanceWidgets\|Widget"
```

### 2. Verify DataStore Contents

```typescript
const debugDataStore = async () => {
  const keys = await ExpoGlanceWidgetModule.getAllDatastoreKeys();
  const values = await ExpoGlanceWidgetModule.getAllDatastoreValues();
  
  console.log('DataStore keys:', keys);
  console.log('DataStore values:', values);
};
```

### 3. Check Widget State

```kotlin
@Composable
override fun Content() {
    val prefs = currentState<Preferences>()
    
    // Debug all preferences
    prefs.asMap().forEach { (key, value) ->
        Log.d("MyWidget", "Key: ${key.name}, Value: $value")
    }
    
    // Your widget UI
}
```

### 4. Validate File Structure

```bash
# Check generated files
find android/app/src/main/java -name "*.kt" -type f
find android/app/src/main/res -name "*.xml" -type f
```

## Platform-Specific Issues

### Windows

**Issue:** Path separators in configuration
```typescript
// Use forward slashes or double backslashes
widgetFilesPath: "C:\\MyProject\\src\\main\\java\\com\\example"
// or
widgetFilesPath: "C:/MyProject/src/main/java/com/example"
```

### macOS/Linux

**Issue:** Permission errors when copying files
```bash
# Check file permissions
ls -la widgets/android/
chmod -R 755 widgets/android/
```

## Performance Issues

### 1. Slow Build Times

**Solutions:**
- Use `includeDirectories` to copy only necessary files
- Minimize external project dependencies
- Use local widget files when possible

### 2. Widget Update Lag

**Solutions:**
- Reduce widget update period for testing
- Use efficient DataStore operations
- Minimize widget UI complexity

## Getting Help

### Before Asking for Help

1. **Check the logs:**
```bash
# Build logs
npm run prebuild:android 2>&1 | tee build.log

# Runtime logs
npx react-native log-android
```

2. **Verify your setup:**
```bash
# Check versions
expo --version
node --version
npm list expo
```

3. **Test with minimal example:**
Create a simple widget following the [Quick Start](./QUICKSTART.md) guide.

### When Reporting Issues

Include the following information:

1. **Environment:**
   - Expo SDK version
   - Node.js version
   - Operating system
   - Android API level

2. **Configuration:**
   - Your `app.config.ts` plugin configuration
   - File structure (`tree widgets/` or `ls -la widgets/`)

3. **Error Details:**
   - Complete error messages
   - Build logs
   - Stack traces

4. **Code Samples:**
   - Minimal reproducible example
   - Widget Kotlin code
   - React Native usage code

### Support Channels

1. **GitHub Issues**: For bugs and feature requests
2. **Documentation**: Check README, API reference, and examples
3. **Community**: Expo forums and Discord

## Common Solutions Summary

| Problem | Quick Fix |
|---------|-----------|
| Widget not appearing | Check manifest registration |
| Build errors | Clean build and check SDK version |
| DataStore errors | Verify context and method calls |
| File copying issues | Check paths and permissions |
| Widget not updating | Verify DataStore usage in widget |
| Performance issues | Use selective copying with `includeDirectories` |

## Prevention Tips

1. **Always test locally first** before using external projects
2. **Use version control** for your widget files
3. **Keep dependencies updated** (Expo SDK, plugins)
4. **Test on different devices** and Android versions
5. **Monitor build logs** for warnings and errors
6. **Use TypeScript** for better error catching
7. **Follow naming conventions** for consistency
