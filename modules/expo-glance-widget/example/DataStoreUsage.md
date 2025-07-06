# Generic DataStore Implementation

This implementation provides a generic DataStore interface that allows you to write to and read from Android's DataStore from the Expo side.

## Usage from Expo/React Native

```typescript
import ExpoGlanceWidgetModule from 'expo-glance-widget';

// Update a value in the DataStore
await ExpoGlanceWidgetModule.updateDatastoreValue('user_name', 'John Doe');
await ExpoGlanceWidgetModule.updateDatastoreValue('last_update', new Date().toISOString());
await ExpoGlanceWidgetModule.updateDatastoreValue('counter', '42');

// Get a value from the DataStore
const userName = await ExpoGlanceWidgetModule.getDatastoreValue('user_name');
const lastUpdate = await ExpoGlanceWidgetModule.getDatastoreValue('last_update');
const counter = await ExpoGlanceWidgetModule.getDatastoreValue('counter');

// Delete a value from the DataStore
await ExpoGlanceWidgetModule.deleteDatastoreValue('old_key');

// Get all keys and values (useful for debugging)
const allKeys = await ExpoGlanceWidgetModule.getAllDatastoreKeys();
const allValues = await ExpoGlanceWidgetModule.getAllDatastoreValues();
console.log('All keys:', allKeys);
console.log('All values:', allValues);
```

## Usage from Kotlin Widget

### Option 1: Use the same DataStore instance

```kotlin
// In your widget file
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import kotlinx.coroutines.flow.first

// Use the same DataStore name as the module
private const val DEFAULT_DATASTORE_NAME = "widget_preferences"
val Context.defaultDataStore: DataStore<Preferences> by preferencesDataStore(name = DEFAULT_DATASTORE_NAME)

// In your widget compose function
@Composable
fun MyWidget() {
    val context = LocalContext.current
    var userName by remember { mutableStateOf("Loading...") }
    var counter by remember { mutableStateOf("0") }
    
    LaunchedEffect(Unit) {
        val preferences = context.defaultDataStore.data.first()
        userName = preferences[stringPreferencesKey("user_name")] ?: "Unknown"
        counter = preferences[stringPreferencesKey("counter")] ?: "0"
    }
    
    Column {
        Text("User: $userName")
        Text("Counter: $counter")
        Text("Last updated: ${SimpleDateFormat("HH:mm:ss").format(Date())}")
    }
}
```

### Option 2: Use your existing DataStore (if you have one)

If you already have a DataStore with a different name, you can modify the Kotlin module to use your existing one:

```kotlin
// In ExpoGlanceWidgetModule.kt, replace the DataStore extension with your existing one
object BidiiWidgetConstants {
    const val DATASTORE_NAME = "bidii_widget_preferences"
}

val Context.dataStore: DataStore<Preferences> by preferencesDataStore(name = BidiiWidgetConstants.DATASTORE_NAME)

// Then in the module, replace `context.defaultDataStore` with `context.dataStore`
```

## Key Features

1. **Generic**: Works with any string key-value pairs
2. **Async**: All operations are asynchronous and return Promises
3. **Error Handling**: Proper error handling with meaningful error messages
4. **Compatible**: Works with existing DataStore implementations
5. **Flexible**: Can be used with any DataStore name by modifying the Kotlin module

## DataStore Operations

| Operation | Description | Parameters | Returns |
|-----------|-------------|------------|---------|
| `getDatastoreValue` | Get a value by key | `key: string` | `Promise<string \| null>` |
| `updateDatastoreValue` | Set/update a value | `key: string, value: string` | `Promise<void>` |
| `deleteDatastoreValue` | Delete a value by key | `key: string` | `Promise<void>` |
| `getAllDatastoreKeys` | Get all keys | None | `Promise<string[]>` |
| `getAllDatastoreValues` | Get all key-value pairs | None | `Promise<Record<string, string>>` |

## Error Handling

All operations can throw errors. Wrap them in try-catch blocks:

```typescript
try {
    await ExpoGlanceWidgetModule.updateDatastoreValue('test_key', 'test_value');
    console.log('Value updated successfully');
} catch (error) {
    console.error('Failed to update value:', error);
}
```

## Notes

- All values are stored as strings in DataStore
- The DataStore is persistent across app restarts
- The DataStore is shared between the Expo app and the widget
- The default DataStore name is `"widget_preferences"` but can be customized
