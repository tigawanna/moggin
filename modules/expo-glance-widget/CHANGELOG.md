# Changelog

All notable changes to the Expo Glance Widget module will be documented in this file.

## [2.0.0] - 2024-01-XX

### 🚀 Major Features

- **DataStore Integration**: Complete migration from SharedPreferences to Android DataStore
- **Directory-Based Copying**: Selective copying with `includeDirectories` option
- **Auto Package Detection**: Automatically detects and updates package names
- **External Project Support**: Seamless integration with external Android Studio projects
- **Modern Build System**: Full Kotlin 2.0 and Compose support

### 💥 Breaking Changes

- **Removed SharedPreferences API**: All `SharedPrefs` methods have been removed
  - `getSharedPrefsValue()` → `getDatastoreValue()`
  - `updateSharedPrefsValue()` → `updateDatastoreValue()`
  - `getAllSharedPrefsKeys()` → `getAllDatastoreKeys()`
- **Configuration Property Renames**:
  - `widgetFiles` → `widgetFilesPath`
  - `widgetManifest` → `manifestPath`
  - `widgetResources` → `resPath`
  - `targetPackage` → `destinationPackageName`
- **Minimum SDK Requirement**: Now requires Expo SDK 53+

### ✨ New Features

- **Generic DataStore CRUD**: Complete CRUD operations for widget data
- **Directory Filtering**: `includeDirectories` option for selective copying
- **File Pattern Matching**: `fileMatchPattern` for custom file selection
- **Sync Directory**: Configurable directory for external file synchronization
- **Package Name Management**: Automatic source/destination package handling
- **Enhanced Error Handling**: Better error messages and debugging
- **Build System Integration**: Automatic Gradle configuration

### 🔧 Improvements

- **Performance**: DataStore is more efficient than SharedPreferences
- **Type Safety**: Better TypeScript definitions and error handling
- **Documentation**: Comprehensive README, API reference, and examples
- **File Management**: Preserves directory structure during copying
- **Debugging**: Added debug logging and introspection methods

### 🐛 Bug Fixes

- Fixed package name updates not applying to nested directories
- Resolved manifest merging issues with complex widget configurations
- Fixed resource copying for widgets with custom layouts
- Improved error handling for missing widget files

### 📚 Documentation

- **Complete README**: Comprehensive setup and usage guide
- **API Reference**: Detailed method documentation
- **Migration Guide**: Step-by-step upgrade instructions
- **Quick Start**: 5-minute setup guide
- **Examples**: Real-world usage examples

### 🏗️ Technical Changes

- **Kotlin 2.0 Support**: Full compatibility with latest Kotlin
- **Compose Integration**: Modern UI framework support
- **Gradle Plugin Updates**: Automatic dependency management
- **Build Performance**: Optimized build process

## [1.2.0] - 2023-12-XX

### ✨ Features

- Added support for external Android Studio projects
- Improved resource copying mechanism
- Enhanced manifest merging

### 🐛 Bug Fixes

- Fixed widget receiver registration
- Resolved package name conflicts
- Improved error messages

## [1.1.0] - 2023-11-XX

### ✨ Features

- Added SharedPreferences integration
- Widget update mechanisms
- Basic file synchronization

### 🐛 Bug Fixes

- Fixed widget display issues
- Resolved build configuration problems

## [1.0.0] - 2023-10-XX

### 🚀 Initial Release

- Basic Android widget support
- File copying functionality
- Manifest integration
- Resource management

---

## Migration Notes

### From v1.x to v2.0

**Required Changes:**
1. Update configuration properties in `app.config.ts`
2. Replace all SharedPreferences calls with DataStore calls
3. Update Kotlin widget code to use DataStore
4. Clean and rebuild your project

**See [MIGRATION.md](./MIGRATION.md) for detailed instructions.**

### Compatibility

| Version | Expo SDK | Android API | Kotlin |
|---------|----------|-------------|--------|
| 2.0.x   | 53+      | 31+         | 2.0+   |
| 1.x     | 50+      | 28+         | 1.8+   |

## Development

### Building

```bash
# Build TypeScript plugins
npm run plugins:build

# Bundle for distribution
npm run plugins:bundle

# Clean generated files
npm run remove-js-files
```

### Testing

```bash
# Test in development project
npm run prebuild:android
npm run build:android
```

## Contributors

Thanks to all contributors who helped make this project better!

## License

MIT License - see [LICENSE](./LICENSE) for details.

---

**Note**: This changelog follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) format and uses [Semantic Versioning](https://semver.org/).
