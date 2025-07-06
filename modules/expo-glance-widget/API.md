# API Reference

Complete API documentation for the Expo Glance Widget module.

## JavaScript/TypeScript API

### ExpoGlanceWidgetModule

The main module providing DataStore integration between React Native and Android widgets.

#### Methods

##### `getDatastoreValue(key: string): Promise<string | null>`

Retrieves a value from the Android DataStore.

**Parameters:**
- `key` (string): The key to retrieve

**Returns:** 
- `Promise<string | null>`: The stored value or null if not found

**Example:**
```typescript
const value = await ExpoGlanceWidgetModule.getDatastoreValue('user_name');
console.log(value); // "John Doe" or null
```

##### `updateDatastoreValue(key: string, value: string): Promise<void>`

Updates or creates a value in the Android DataStore.

**Parameters:**
- `key` (string): The key to update
- `value` (string): The value to store

**Returns:** 
- `Promise<void>`: Resolves when the operation completes

**Example:**
```typescript
await ExpoGlanceWidgetModule.updateDatastoreValue('user_name', 'John Doe');
```

##### `deleteDatastoreValue(key: string): Promise<void>`

Deletes a value from the Android DataStore.

**Parameters:**
- `key` (string): The key to delete

**Returns:** 
- `Promise<void>`: Resolves when the operation completes

**Example:**
```typescript
await ExpoGlanceWidgetModule.deleteDatastoreValue('user_name');
```

##### `getAllDatastoreKeys(): Promise<string[]>`

Returns all keys stored in the DataStore. Useful for debugging.

**Returns:** 
- `Promise<string[]>`: Array of all keys

**Example:**
```typescript
const keys = await ExpoGlanceWidgetModule.getAllDatastoreKeys();
console.log(keys); // ["user_name", "last_update", "theme"]
```

##### `getAllDatastoreValues(): Promise<Record<string, string>>`

Returns all key-value pairs from the DataStore. Useful for debugging.

**Returns:** 
- `Promise<Record<string, string>>`: Object containing all key-value pairs

**Example:**
```typescript
const values = await ExpoGlanceWidgetModule.getAllDatastoreValues();
console.log(values); // { "user_name": "John", "theme": "dark" }
```

## Plugin Configuration API

### withExpoGlanceWidgets

Main configuration plugin for integrating Android widgets.

#### Configuration Options

##### `widgetFilesPath: string`
Path to widget Kotlin source files.

**Default:** `"widgets/android"`
**Example:** `"C:\\MyProject\\app\\src\\main\\java\\com\\example"`

##### `manifestPath: string`
Path to the Android manifest file containing widget receivers.

**Default:** `"widgets/android/AndroidManifest.xml"`
**Example:** `"C:\\MyProject\\app\\src\\main\\AndroidManifest.xml"`

##### `resPath: string`
Path to widget resources directory.

**Default:** `"widgets/android/res"`
**Example:** `"C:\\MyProject\\app\\src\\main\\res"`

##### `fileMatchPattern?: string`
Pattern to match widget files (regex or simple string).

**Default:** `"Widget"`
**Example:** `"Widget|Provider|Receiver"`

##### `syncDirectory?: string`
Directory for syncing external widget files.

**Default:** `"widgets/android"`
**Example:** `"synced-widgets"`

##### `includeDirectories?: string[]`
Specific directories to copy from the source.

**Default:** `undefined` (copies all)
**Example:** `["wakatime", "ui", "utils"]`

##### `sourcePackageName?: string`
Source package name for package updates.

**Default:** Auto-detected from source files
**Example:** `"com.example.widgets"`

##### `destinationPackageName?: string`
Target package name for your Expo project.

**Default:** Auto-detected from app.config
**Example:** `"com.yourapp.widgets"`

## Kotlin API

### DataStore Access

Widgets can access the same DataStore used by the React Native module.

#### Reading Values

```kotlin
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.glance.appwidget.state.getAppWidgetState

@Composable
fun MyWidget() {
    val prefs = currentState<Preferences>()
    val value = prefs[stringPreferencesKey("myKey")] ?: "default"
    
    Text(text = value)
}
```

#### Common DataStore Keys

Use `stringPreferencesKey()` for all string values:

```kotlin
val titleKey = stringPreferencesKey("widget_title")
val subtitleKey = stringPreferencesKey("widget_subtitle")
val themeKey = stringPreferencesKey("theme")
```

### Widget Base Classes

#### GlanceAppWidget

Base class for all widgets:

```kotlin
class MyWidget : GlanceAppWidget() {
    @Composable
    override fun Content() {
        // Widget UI content
    }
}
```

#### GlanceAppWidgetReceiver

Receiver class for widget events:

```kotlin
class MyWidgetReceiver : GlanceAppWidgetReceiver() {
    override val glanceAppWidget: GlanceAppWidget = MyWidget()
}
```

## Error Handling

### JavaScript Errors

All async methods can throw errors. Always use try-catch:

```typescript
try {
    const value = await ExpoGlanceWidgetModule.getDatastoreValue('key');
    console.log(value);
} catch (error) {
    console.error('DataStore error:', error);
}
```

### Common Error Types

- `DATASTORE_ERROR`: DataStore operation failed
- `FILE_NOT_FOUND`: Widget files not found during build
- `MANIFEST_ERROR`: Invalid widget manifest configuration

## Type Definitions

### ExpoGlanceWidgetModuleEvents

```typescript
export type ExpoGlanceWidgetModuleEvents = {
    // Currently no events - reserved for future use
};
```

### WithExpoGlanceWidgetsProps

```typescript
export interface WithExpoGlanceWidgetsProps {
    widgetFilesPath: string;
    manifestPath: string;
    resPath: string;
    fileMatchPattern?: string;
    syncDirectory?: string;
    includeDirectories?: string[];
    destinationPackageName?: string;
    sourcePackageName?: string;
}
```

## Constants

### DataStore Configuration

The module uses a predefined DataStore name:

```kotlin
const val DATASTORE_NAME = "bidii_widget_preferences"
```

This ensures consistency between React Native and widget access.

## Best Practices

### Key Naming

Use descriptive, consistent key names:

```typescript
// Good
await ExpoGlanceWidgetModule.updateDatastoreValue('user_display_name', 'John');
await ExpoGlanceWidgetModule.updateDatastoreValue('last_sync_timestamp', '2024-01-01');

// Avoid
await ExpoGlanceWidgetModule.updateDatastoreValue('n', 'John');
await ExpoGlanceWidgetModule.updateDatastoreValue('ts', '2024-01-01');
```

### Error Handling

Always handle async operations:

```typescript
const updateWidget = async (key: string, value: string) => {
    try {
        await ExpoGlanceWidgetModule.updateDatastoreValue(key, value);
        console.log('Widget updated successfully');
    } catch (error) {
        console.error('Failed to update widget:', error);
        // Handle error (show toast, retry, etc.)
    }
};
```

### Performance

For multiple operations, consider batching:

```typescript
// Instead of multiple separate calls
await ExpoGlanceWidgetModule.updateDatastoreValue('title', 'New Title');
await ExpoGlanceWidgetModule.updateDatastoreValue('subtitle', 'New Subtitle');
await ExpoGlanceWidgetModule.updateDatastoreValue('theme', 'dark');

// Consider updating related data together in your app logic
const updateWidgetData = async (data: WidgetData) => {
    await ExpoGlanceWidgetModule.updateDatastoreValue('title', data.title);
    await ExpoGlanceWidgetModule.updateDatastoreValue('subtitle', data.subtitle);
    await ExpoGlanceWidgetModule.updateDatastoreValue('theme', data.theme);
};
```
