# Examples Index

This directory contains comprehensive examples for using the Expo Glance Widget module.

## Available Examples

### Configuration Examples

#### [DirectoryBasedCopyingExample.md](./DirectoryBasedCopyingExample.md)
Learn how to selectively copy directories from external Android Studio projects.

**Key Features:**
- `includeDirectories` configuration
- External project integration
- Package name handling
- File structure preservation

### Code Examples

#### [WidgetControlScreen.tsx](./WidgetControlScreen.tsx)
A complete React Native screen for controlling widget data.

**Features:**
- DataStore CRUD operations
- Error handling
- User interface for widget management
- Real-time data updates

#### [ExampleWidget.kt](./ExampleWidget.kt)
A comprehensive Kotlin widget implementation.

**Features:**
- DataStore integration
- Modern Compose UI
- State management
- Error handling

### Usage Guides

#### [DataStoreUsage.md](./DataStoreUsage.md)
Detailed guide on using the DataStore API.

**Topics:**
- JavaScript/TypeScript usage
- Kotlin widget integration
- Best practices
- Error handling

#### [CustomDataStoreConfiguration.kt](./CustomDataStoreConfiguration.kt)
Advanced DataStore configuration examples.

**Features:**
- Custom DataStore setup
- Type-safe preferences
- Advanced state management

### Implementation References

#### [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)
Technical summary of the implementation approach.

**Content:**
- Architecture overview
- Design decisions
- Performance considerations

## Getting Started

### 1. Basic Setup

Start with the [Quick Start Guide](../QUICKSTART.md) for a 5-minute setup.

### 2. Configuration

Review [DirectoryBasedCopyingExample.md](./DirectoryBasedCopyingExample.md) for configuration options.

### 3. React Native Integration

Use [WidgetControlScreen.tsx](./WidgetControlScreen.tsx) as a starting point for your React Native code.

### 4. Widget Development

Reference [ExampleWidget.kt](./ExampleWidget.kt) for Kotlin widget implementation.

## Example Use Cases

### Simple Text Widget

**Goal:** Display text from React Native in a widget

**Files to Reference:**
- [WidgetControlScreen.tsx](./WidgetControlScreen.tsx) - React Native side
- [ExampleWidget.kt](./ExampleWidget.kt) - Widget implementation

### External Project Integration

**Goal:** Use existing Android Studio widget project

**Files to Reference:**
- [DirectoryBasedCopyingExample.md](./DirectoryBasedCopyingExample.md) - Configuration
- [CustomDataStoreConfiguration.kt](./CustomDataStoreConfiguration.kt) - Advanced setup

### Multi-Widget App

**Goal:** Multiple widgets with shared data

**Files to Reference:**
- [DataStoreUsage.md](./DataStoreUsage.md) - Data management
- [WidgetControlScreen.tsx](./WidgetControlScreen.tsx) - Control interface

## Code Patterns

### React Native DataStore Operations

```typescript
// From WidgetControlScreen.tsx
const updateWidget = async (key: string, value: string) => {
  try {
    await ExpoGlanceWidgetModule.updateDatastoreValue(key, value);
    console.log('Widget updated');
  } catch (error) {
    console.error('Update failed:', error);
  }
};
```

### Kotlin Widget State Management

```kotlin
// From ExampleWidget.kt
@Composable
override fun Content() {
    val prefs = currentState<Preferences>()
    val data = prefs[stringPreferencesKey("key")] ?: "default"
    
    Text(text = data)
}
```

### Configuration Patterns

```typescript
// From DirectoryBasedCopyingExample
[
  withExpoGlanceWidgets,
  {
    widgetFilesPath: "external/path",
    includeDirectories: ["specific", "directories"],
    syncDirectory: "widgets/android"
  }
]
```

## Testing Your Implementation

### 1. Verify Configuration

```bash
npm run prebuild:android
```

### 2. Test DataStore Operations

```typescript
const testDataStore = async () => {
  await ExpoGlanceWidgetModule.updateDatastoreValue('test', 'value');
  const result = await ExpoGlanceWidgetModule.getDatastoreValue('test');
  console.log('Test result:', result);
};
```

### 3. Check Widget Display

Build and run your app, then check the Android widget picker.

## Common Modifications

### Custom Widget Styling

Modify the Compose UI in [ExampleWidget.kt](./ExampleWidget.kt):

```kotlin
Column(
    modifier = GlanceModifier
        .fillMaxSize()
        .background(Color.Blue)  // Custom background
        .padding(16.dp)
) {
    // Your content
}
```

### Advanced Data Management

Extend the control screen pattern from [WidgetControlScreen.tsx](./WidgetControlScreen.tsx):

```typescript
const [multipleValues, setMultipleValues] = useState({
  title: '',
  subtitle: '',
  theme: 'light'
});

const updateMultipleValues = async () => {
  for (const [key, value] of Object.entries(multipleValues)) {
    await ExpoGlanceWidgetModule.updateDatastoreValue(key, value);
  }
};
```

## Next Steps

1. **Start with Basic Example**: Use [WidgetControlScreen.tsx](./WidgetControlScreen.tsx) and [ExampleWidget.kt](./ExampleWidget.kt)
2. **Customize Configuration**: Adapt patterns from [DirectoryBasedCopyingExample.md](./DirectoryBasedCopyingExample.md)
3. **Add Advanced Features**: Reference [CustomDataStoreConfiguration.kt](./CustomDataStoreConfiguration.kt)
4. **Handle Edge Cases**: Review [DataStoreUsage.md](./DataStoreUsage.md) for best practices

## Need Help?

- Check the [Troubleshooting Guide](../TROUBLESHOOTING.md)
- Review the [API Reference](../API.md)
- Look at the [Migration Guide](../MIGRATION.md) if upgrading
- Read the main [README](../README.md) for overview

---

**Note**: All examples are ready to use - just copy the relevant code and adapt it to your specific needs.
