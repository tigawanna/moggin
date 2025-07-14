# Widget API Key Update Usage

## Overview

The `updateApiKey` method allows you to directly update the API key in all widget datastores from your React Native app, similar to how you would update it in a native Android app.

## Usage Example

```typescript
import { updateApiKey } from 'expo-wakatime-glance-widgets';

// Update the API key for all widgets
export async function saveWakatimeApiKey(apiKey: string) {
  try {
    await updateApiKey(apiKey);
    console.log('API key updated successfully in all widget datastores');
  } catch (error) {
    console.error('Failed to update API key:', error);
  }
}

// Example usage in a React component
import React, { useState } from 'react';
import { Button, TextInput, View } from 'react-native';

export function ApiKeySettings() {
  const [apiKey, setApiKey] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSaveApiKey = async () => {
    if (!apiKey.trim()) return;
    
    setSaving(true);
    try {
      await updateApiKey(apiKey);
      setApiKey(''); // Clear input after saving
      // Show success message to user
    } catch (error) {
      // Handle error
      console.error('Failed to save API key:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <View>
      <TextInput
        value={apiKey}
        onChangeText={setApiKey}
        placeholder="Enter WakaTime API Key"
        secureTextEntry
      />
      <Button
        title={saving ? "Saving..." : "Save API Key"}
        onPress={handleSaveApiKey}
        disabled={!apiKey.trim() || saving}
      />
    </View>
  );
}
```

## How it Works

The `updateApiKey` function:

1. **Updates All Datastores**: Automatically updates the API key in all available widget datastores
2. **Future-Proof**: New datastores can be added to the native module without changing the TypeScript interface
3. **Async Operation**: Returns a Promise that resolves when all datastores are updated

## Native Implementation

The native implementation iterates through all available datastores:

```kotlin
AsyncFunction("updateApiKey") { apiKey: String ->
  CoroutineScope(Dispatchers.IO).launch {
    try {
      // Update all available datastores with the API key
      // Hours widget datastore
      context.dataStore.edit { preferences ->
        preferences[WidgetConstants.WAKATIME_API_KEY] = apiKey
      }
      
      // Future datastores can be added here by importing them and replicating the logic
      // Example: context.anotherDataStore.edit { preferences ->
      //   preferences[AnotherWidgetConstants.WAKATIME_API_KEY] = apiKey
      // }
      
    } catch (e: Exception) {
      e.printStackTrace()
    }
  }
}
```

## Adding New Datastores

To add support for new widget datastores:

1. **Import the new datastore** in `ExpoWakatimeGlanceWidgetsModule.kt`
2. **Add the update logic** in the `updateApiKey` function
3. **No TypeScript changes needed** - the interface remains the same

Example:
```kotlin
// Add import
import expo.modules.wakatimeglancewidgets.another_widget.anotherDataStore

// Add to updateApiKey function
context.anotherDataStore.edit { preferences ->
  preferences[AnotherWidgetConstants.WAKATIME_API_KEY] = apiKey
}
```
