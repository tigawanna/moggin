# 🔧 Technical Documentation

## 📋 Table of Contents

- [Custom Native Modules](#-custom-native-modules)
- [Material Dynamic Colors Module](#-material-dynamic-colors-module)
- [WakaTime Glance Widgets Module](#-wakatime-glance-widgets-module)
- [State Management Architecture](#-state-management-architecture)
- [Data Fetching Strategy](#-data-fetching-strategy)
- [Error Handling System](#-error-handling-system)
- [Performance Optimizations](#-performance-optimizations)
- [Build System](#-build-system)

## 🧩 Custom Native Modules

### Overview
Moggin includes two custom native modules that provide deep Android integration and enhanced user experience:

1. **expo-material-dynamic-colors**: Dynamic theming based on Android wallpaper
2. **expo-wakatime-glance-widgets**: Native Android widgets for coding statistics

Both modules are built using the Expo Modules API and include TypeScript definitions for type safety.

## 🎨 Material Dynamic Colors Module

### Architecture
The Material Dynamic Colors module is based on the [expo-material3-theme](https://github.com/pchmn/expo-material3-theme) package but has been customized and embedded directly into the project due to dependency compatibility issues with newer Expo SDK versions.

### Key Features
- **Android 12+ Dynamic Colors**: Extracts Material You colors from user wallpaper
- **Fallback Support**: Generates Material 3 themes for unsupported devices
- **Real-time Updates**: Responds to system theme changes
- **React Native Paper Integration**: Seamless integration with UI components

### Implementation

#### Module Structure
```
modules/expo-material-dynamic-colors/
├── android/                        # Native Android implementation
│   ├── src/main/java/
│   │   └── expo/modules/materialdynamiccolors/
│   │       ├── ExpoMaterialDynamicColorsModule.kt
│   │       └── MaterialDynamicColorsModule.kt
│   └── build.gradle
├── src/                           # TypeScript interface
│   ├── index.ts                   # Main exports
│   ├── ExpoMaterialDynamicColors.types.ts
│   └── ExpoMaterialDynamicColorsModule.ts
└── expo-module.config.json        # Module configuration
```

#### Android Implementation
The Android module uses the Material Color Utilities library to extract and generate color schemes:

```kotlin
// ExpoMaterialDynamicColorsModule.kt
@ExpoMethod
fun getMaterial3Theme(sourceColor: String?, promise: Promise) {
  try {
    val context = appContext.reactContext
    val colorScheme = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
      // Extract dynamic colors from system
      getDynamicColorScheme(context)
    } else {
      // Generate fallback theme
      generateFallbackScheme(sourceColor)
    }
    
    val theme = Material3Theme(
      light = colorScheme.light,
      dark = colorScheme.dark
    )
    
    promise.resolve(theme.toBundle())
  } catch (e: Exception) {
    promise.reject("THEME_ERROR", "Failed to generate theme", e)
  }
}
```

#### TypeScript Integration
```typescript
// Hook for consuming dynamic colors
export function useMaterial3Theme(options?: {
  sourceColor?: string;
  fallbackSourceColor?: string;
}) {
  const [theme, setTheme] = useState<Material3Theme | null>(null);
  
  useEffect(() => {
    ExpoMaterialDynamicColorsModule.getMaterial3Theme(options?.sourceColor)
      .then(setTheme)
      .catch(console.error);
  }, [options?.sourceColor]);
  
  return {
    theme,
    updateTheme: (sourceColor: string) => {
      ExpoMaterialDynamicColorsModule.getMaterial3Theme(sourceColor)
        .then(setTheme);
    },
    resetTheme: () => {
      ExpoMaterialDynamicColorsModule.getMaterial3Theme()
        .then(setTheme);
    }
  };
}
```

#### React Native Paper Integration
```typescript
// Theme provider component
export function Material3ThemeProvider({ children }: { children: React.ReactNode }) {
  const colorScheme = useColorScheme();
  const { theme } = useMaterial3Theme();
  
  const paperTheme = useMemo(() => {
    if (!theme) return colorScheme === 'dark' ? MD3DarkTheme : MD3LightTheme;
    
    return colorScheme === 'dark' 
      ? { ...MD3DarkTheme, colors: theme.dark }
      : { ...MD3LightTheme, colors: theme.light };
  }, [colorScheme, theme]);
  
  return (
    <PaperProvider theme={paperTheme}>
      {children}
    </PaperProvider>
  );
}
```

## 📱 WakaTime Glance Widgets Module

### Architecture
The WakaTime Glance Widgets module provides native Android widgets that display coding statistics directly on the user's home screen. It uses Android's modern Glance API built on Jetpack Compose.

### Key Features
- **Native Android Widgets**: Built with Jetpack Compose Glance
- **Background Updates**: Automatic data refresh using Expo Background Tasks
- **Material Design 3**: Consistent styling with app theme
- **Real-time Data**: Shows current day coding statistics

### Module Structure
```
modules/expo-wakatime-glance-widgets/
├── android/                       # Native Android implementation
│   └── src/main/java/expo/modules/wakatimeglancewidgets/
│       ├── ExpoWakatimeGlanceWidgetsModule.kt
│       ├── WakatimeHoursWidget.kt
│       └── WidgetData.kt
├── plugins/                       # Expo config plugin
│   ├── index.ts
│   └── withJetpackCompose.ts
├── src/                          # TypeScript interface
│   ├── index.ts
│   ├── ExpoWakatimeGlanceWidgets.types.ts
│   └── ExpoWakatimeGlanceWidgetsModule.ts
└── expo-module.config.json
```

### Android Widget Implementation

#### Glance Widget (Jetpack Compose)
```kotlin
// WakatimeHoursWidget.kt
class WakatimeHoursWidget : GlanceAppWidget() {
    override suspend fun provideGlance(context: Context, id: GlanceId) {
        provideContent {
            WakatimeWidgetContent()
        }
    }
}

@Composable
private fun WakatimeWidgetContent() {
    val widgetData = currentState<WidgetData>()
    
    Column(
        modifier = GlanceModifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.surface)
            .padding(16.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(
            text = "Today's Coding",
            style = TextStyle(
                fontSize = 14.sp,
                fontWeight = FontWeight.Medium,
                color = MaterialTheme.colorScheme.onSurface
            )
        )
        
        Spacer(modifier = GlanceModifier.height(8.dp))
        
        Text(
            text = widgetData.totalTime,
            style = TextStyle(
                fontSize = 24.sp,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.primary
            )
        )
        
        Spacer(modifier = GlanceModifier.height(4.dp))
        
        Text(
            text = widgetData.currentProject,
            style = TextStyle(
                fontSize = 12.sp,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        )
    }
}
```

#### Widget Data Management
```kotlin
// ExpoWakatimeGlanceWidgetsModule.kt
@Entity(tableName = "widget_data")
data class WidgetData(
    @PrimaryKey val id: String = "wakatime_widget",
    val totalTime: String,
    val currentProject: String,
    val lastSync: String
) {
    fun toBundle(): Bundle {
        return Bundle().apply {
            putString("totalTime", totalTime)
            putString("currentProject", currentProject)
            putString("lastSync", lastSync)
        }
    }
}

AsyncFunction("updateApiKey") { apiKey: String ->
  CoroutineScope(Dispatchers.IO).launch {
    try {
      // Update all available datastores with the API key
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

#### Module Interface
```kotlin
// ExpoWakatimeGlanceWidgetsModule.kt
class ExpoWakatimeGlanceWidgetsModule : Module() {
    override fun definition() = ModuleDefinition {
        Name("ExpoWakatimeGlanceWidgets")
        
        AsyncFunction("updateWakatimeDailyDurationWidget") { payload: Map<String, String> ->
            val widgetData = WidgetData(
                totalTime = payload["totalTime"] ?: "0h 0m",
                currentProject = payload["currentProject"] ?: "Unknown",
                lastSync = payload["lastSync"] ?: ""
            )
            
            updateWidget(widgetData)
        }
    }
    
    private suspend fun updateWidget(data: WidgetData) {
        val context = appContext.reactContext
        val glanceId = GlanceAppWidgetManager(context)
            .getGlanceIds(WakatimeHoursWidget::class.java)
            .firstOrNull()
            
        glanceId?.let { id ->
            updateAppWidgetState(context, id) { prefs ->
                prefs[stringPreferencesKey("totalTime")] = data.totalTime
                prefs[stringPreferencesKey("currentProject")] = data.currentProject
                prefs[stringPreferencesKey("lastSync")] = data.lastSync
            }
            WakatimeHoursWidget().update(context, id)
        }
    }
}
```

#### Expo Config Plugin for WorkManager
The module includes a custom config plugin that automatically initializes WorkManager in the MainActivity:

```typescript
// plugins/withInitializeWorkManager.ts
const withInitializeWorkManager: ConfigPlugin = (config) => {
  return withMainActivity(config, (config) => {
    if (config.modResults.language === "java") {
      config.modResults.contents = addWorkManagerToJavaActivity(config.modResults.contents);
    } else if (config.modResults.language === "kt") {
      config.modResults.contents = addWorkManagerToKotlinActivity(config.modResults.contents);
    }
    return config;
  });
};
```

The plugin automatically adds:
- Import statement: `import expo.modules.wakatimeglancewidgets.hours_widget.WakatimeWidgetWorker`
- Initialization call: `WakatimeWidgetWorker.setupPeriodicWork(this)` in onCreate

### Expo Config Plugin
The module includes a custom Expo config plugin to configure Gradle for Jetpack Compose:

```typescript
// plugins/withJetpackCompose.ts
export function withJetpackCompose(config: ExpoConfig): ExpoConfig {
  return withGradleProperties(config, (config) => {
    config.modResults.push({
      type: 'property',
      key: 'android.useAndroidX',
      value: 'true',
    });
    return config;
  });
}

export function withJetpackComposeFeature(config: ExpoConfig): ExpoConfig {
  return withAndroidManifest(config, (config) => {
    const mainApplication = getMainApplicationOrThrow(config.modResults);
    
    if (!mainApplication.$['android:theme']) {
      mainApplication.$['android:theme'] = '@style/AppTheme';
    }
    
    return config;
  });
}
```

### Background Updates
Widgets are updated using Expo Background Tasks:

```typescript
// Background task registration
const BACKGROUND_FETCH_TASK = 'wakatime-widget-update';

TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  try {
    // Fetch latest WakaTime data
    const data = await fetchTodayWakatimeData();
    
    // Update widget
    await updateWakatimeDailyDurationWidget({
      totalTime: data.todayHours,
      currentProject: data.currentProject,
      lastSync: new Date().toISOString()
    });
    
    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (error) {
    console.error('Background fetch failed:', error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

// Register background task
export async function registerBackgroundFetch() {
  await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
    minimumInterval: 15 * 60, // 15 minutes
    stopOnTerminate: false,
    startOnBoot: true,
  });
}
```

## 🏪 State Management Architecture

### Legend State Integration
The app uses Legend State for reactive state management with optimal performance:

```typescript
// stores/use-app-settings.tsx
export const appSettings$ = observable({
  wakatimeApiKey: null as string | null,
  dynamicColorsEnabled: true,
  selectedTheme: 'system' as 'light' | 'dark' | 'system',
  
  // Computed values
  get isConfigured() {
    return !!this.wakatimeApiKey.get();
  }
});

// Persistence middleware
persistObservable(appSettings$, {
  local: 'appSettings',
  transform: {
    save: (value) => JSON.stringify(value),
    load: (value) => JSON.parse(value)
  }
});

// React hook integration
export function useApiKeysStore() {
  const wakatimeApiKey = appSettings$.wakatimeApiKey.use();
  
  const setWakatimeApiKey = useCallback((key: string | null) => {
    appSettings$.wakatimeApiKey.set(key);
  }, []);
  
  return { wakatimeApiKey, setWakatimeApiKey };
}
```

### TanStack Query Integration
Data fetching is handled by TanStack Query with intelligent caching:

```typescript
// lib/api/wakatime/use-wakatime-durations.ts
export function useWakatimeDailyDuration({
  selectedDate,
  wakatimeApiKey,
}: UseWakatimeDailyDurationProps) {
  return useQuery({
    queryKey: ["wakatime-durations", selectedDate, wakatimeApiKey],
    queryFn: async () => {
      const result = await wakatimeUserTimeQueryFetcher({
        selectedDate,
        wakatimeApiKey
      });
      
      // Handle different response types
      if (result.type === "unauthorized") {
        throw new Error("Unauthorized");
      }
      
      if (result.type === "rate_limit_exceeded") {
        throw new Error("Rate limit exceeded");
      }
      
      return result;
    },
    enabled: !!wakatimeApiKey,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: (failureCount, error) => {
      // Don't retry on auth errors
      if (error.message === "Unauthorized") return false;
      return failureCount < 3;
    }
  });
}
```

## 🎭 Error Handling System

### Comprehensive Error States
The app includes beautiful, animated error screens for all scenarios:

```typescript
// Error type definitions
type WakatimeError = 
  | { type: "unauthorized"; message: string }
  | { type: "rate_limit_exceeded"; message: string }
  | { type: "no_data"; message: string }
  | { type: "network_error"; message: string };

// Error boundary component
export function WakatimeErrorBoundary({ 
  error, 
  children 
}: { 
  error: WakatimeError | null;
  children: React.ReactNode;
}) {
  if (error?.type === "unauthorized") {
    return <UnAuthorizedScreen />;
  }
  
  if (error?.type === "rate_limit_exceeded") {
    return <TooManyRequestsScreen />;
  }
  
  if (error?.type === "no_data") {
    return <NoDataScreen />;
  }
  
  return <>{children}</>;
}
```

### Animated Error Screens
All error screens include smooth animations using React Native Reanimated:

```typescript
// components/shared/state-screens/UnAuthorizedScreen.tsx
export function UnAuthorizedScreen() {
  const shakeValue = useSharedValue(0);
  const fadeValue = useSharedValue(0.8);
  
  useEffect(() => {
    // Subtle shake animation for attention
    shakeValue.value = withRepeat(
      withSequence(
        withTiming(-2, { duration: 100 }),
        withTiming(2, { duration: 100 }),
        withTiming(0, { duration: 100 })
      ),
      -1,
      false
    );
    
    // Fade animation for text
    fadeValue.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2000 }),
        withTiming(0.8, { duration: 2000 })
      ),
      -1,
      false
    );
  }, []);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeValue.value }],
    opacity: fadeValue.value,
  }));
  
  // ... render UI with animations
}
```

## 📊 Performance Optimizations

### Component Memoization
```typescript
// Memoized expensive components
const MemoizedChart = memo(function WakatimeChart({ data }: { data: ChartData[] }) {
  return (
    <VictoryChart>
      <VictoryLine data={data} />
    </VictoryChart>
  );
});

// Memoized date calculations
const memoizedDates = useMemo(() => 
  generateLastFiveDates(5), 
  []
);
```

### Query Optimization
```typescript
// Parallel queries for better performance
export function useWakatimeWeeklyStats(apiKey: string | null) {
  const dates = useMemo(() => generateLastFiveDates(7), []);
  
  return useQueries({
    queries: dates.map(date => ({
      queryKey: ['wakatime-daily', date, apiKey],
      queryFn: () => fetchWakatimeDay(date, apiKey),
      enabled: !!apiKey,
      staleTime: 1000 * 60 * 60, // 1 hour
    }))
  });
}
```

### Native Performance
- **React Native Reanimated**: All animations run on the UI thread
- **Native Modules**: Performance-critical features implemented in native code
- **Lazy Loading**: Components loaded only when needed
- **Image Optimization**: Compressed assets and proper caching

## 🏗️ Build System

### Custom Scripts
```json
{
  "scripts": {
    "plugins:bundle": "tsup modules/expo-wakatime-glance-widgets/plugins/index.ts --format cjs --out-dir modules/expo-wakatime-glance-widgets/plugins",
    "module:bundle": "tsup modules/expo-material-dynamic-colors/src/index.ts --format cjs --out-dir modules/expo-material-dynamic-colors/src/",
    "prebuild:android": "npm run plugins:bundle && expo prebuild -p android --clean",
    "build:android": "expo run:android"
  }
}
```

### Expo Config
```typescript
// app.config.ts
export default {
  expo: {
    name: "moggin",
    slug: "moggin",
    version: "1.0.0",
    platforms: ["ios", "android"],
    plugins: [
      "expo-dev-client",
      ["expo-background-fetch", {
        backgroundModes: ["background-fetch"]
      }],
      "./modules/expo-wakatime-glance-widgets/plugins"
    ],
    android: {
      package: "com.moggin.app",
      compileSdkVersion: 34,
      targetSdkVersion: 34,
      buildToolsVersion: "34.0.0"
    }
  }
};
```

This technical documentation provides a comprehensive overview of the custom native modules, architecture decisions, and implementation details that make Moggin a powerful and performant WakaTime analytics dashboard.
