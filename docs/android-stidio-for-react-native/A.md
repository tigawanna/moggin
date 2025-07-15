# Complete Guide: Setting Up Android Studio on Linux for React Native (Expo) Development

This comprehensive guide will walk you through installing and configuring Android Studio on Linux specifically for React Native and Expo development. By the end of this guide, you'll have a fully functional development environment optimized for mobile app development.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Installing Android Studio](#installing-android-studio)
3. [Initial Android Studio Configuration](#initial-android-studio-configuration)
4. [React Native/Expo Specific Setup](#react-nativeexpo-specific-setup)
5. [Environment Variables Configuration](#environment-variables-configuration)
6. [Debugging and Development Tools](#debugging-and-development-tools)
7. [Common Issues and Solutions](#common-issues-and-solutions)
8. [Best Practices](#best-practices)

## Prerequisites

Before starting, ensure you have:
- Ubuntu/Debian-based Linux distribution
- At least 8GB of RAM (16GB recommended)
- 10GB+ of free disk space
- Terminal access with sudo privileges
- Basic knowledge of command line operations

## Installing Android Studio

### Step 1: Update Your System

First, update your package manager and system packages:

```bash
sudo apt update && sudo apt upgrade -y
```

### Step 2: Install Android Studio

We'll use the official PPA repository for the most up-to-date version:

```bash
# Add the repository for Android Studio
sudo add-apt-repository ppa:maarten-fonville/android-studio -y

# Update package list
sudo apt update

# Install Android Studio
sudo apt install android-studio -y
```

### Step 3: Verify Installation

Launch Android Studio to verify the installation:

```bash
android-studio
```

## Initial Android Studio Configuration

### Step 1: Complete the Setup Wizard

1. **Welcome Screen**: Click "Next" to start the setup wizard
2. **Install Type**: Choose "Standard" for typical development setup
3. **UI Theme**: Select your preferred theme (Darcula or Light)
4. **SDK Components**: The wizard will automatically download:
   - Android SDK
   - Android SDK Platform
   - Android Virtual Device (AVD)
   - Latest Android SDK build-tools

### Step 2: Create a Test Project

To verify everything works correctly:

1. Create a new Kotlin project
2. Select "Empty Activity" template
3. Click "Finish" and wait for Gradle sync
4. Click the "Run" button (green play icon) to test compilation

## React Native/Expo Specific Setup

### Critical: Fix the Launch Script

This is essential for React Native/Expo projects to work properly with Android Studio.

**Why this matters**: The default launch script (`studio.sh`) doesn't load the Node.js environment properly, causing issues with Gradle configurations that use Node.js commands.

#### Method 1: Modify Desktop Entry

Edit the desktop application file:

```bash
sudo nano /usr/share/applications/android-studio.desktop
```

Change the `Exec` line from:
```
Exec=/opt/android-studio-2025.1.1/android-studio/bin/studio.sh
```

To:
```
Exec=/opt/android-studio-2025.1.1/android-studio/bin/studio
```

#### Method 2: Launch from Terminal

Alternatively, always launch Android Studio from the terminal:

```bash
/opt/android-studio-2025.1.1/android-studio/bin/studio
```

> **Note**: Update the path according to your Android Studio version.

### Understanding the Node.js Integration

React Native projects use Gradle configurations that execute Node.js commands:

```gradle
def reactNativeAndroidDir = new File(
  providers.exec {
    workingDir(rootDir)
    commandLine("node", "--print", "require.resolve('react-native/package.json')")
  }.standardOutput.asText.get().trim(),
  "../android"
)
```

Without proper Node.js environment loading, these commands fail, causing build errors.

## Environment Variables Configuration

### Set Up JAVA_HOME and ANDROID_HOME

Add these environment variables to your `~/.bashrc` or `~/.zshrc`:

```bash
# Open your shell configuration file
nano ~/.bashrc

# Add these lines at the end:

# Set JAVA_HOME to the JDK bundled with Android Studio
export JAVA_HOME="/opt/android-studio-2025.1.1/android-studio/jbr"
export PATH="$JAVA_HOME/bin:$PATH"

# Android SDK paths
export ANDROID_HOME="$HOME/Android/Sdk"
export ANDROID_SDK_ROOT="$ANDROID_HOME"
export PATH="$ANDROID_HOME/platform-tools:$ANDROID_HOME/tools:$ANDROID_HOME/tools/bin:$PATH"

# React Native development
export PATH="$PATH:$ANDROID_HOME/emulator"
export PATH="$PATH:$ANDROID_HOME/platform-tools"
```

### Apply the Changes

```bash
# Reload your shell configuration
source ~/.bashrc

# Verify the environment variables
echo $JAVA_HOME
echo $ANDROID_HOME
```

### Verify SDK Installation

In Android Studio, go to:
1. **File → Settings** (or **Android Studio → Preferences** on some systems)
2. **Appearance & Behavior → System Settings → Android SDK**
3. Verify that the SDK path matches your `ANDROID_HOME` variable

## Debugging and Development Tools

### Android Studio's Built-in Tools

Android Studio provides excellent debugging tools for React Native/Expo development:

#### 1. Logcat Tool Window

The Logcat window displays real-time logs from your device/emulator:

![Android Studio Logcat View](https://github.com/tigawanna/moggin/raw/master/docs/android-stidio-for-react-native/images/android-studio-logcat-view.png)

**How to access**:
- **View → Tool Windows → Logcat**
- Filter logs by app package name
- Use different log levels (Verbose, Debug, Info, Warn, Error)

#### 2. App Inspection Tool

For advanced debugging of background tasks, network requests, and databases:

**How to access**:
- **View → Tool Windows → App Inspection**
- Inspect network traffic
- View database contents
- Monitor background tasks

#### 3. Device File Explorer

View and modify files on your device/emulator:

![File Structure Android View](https://github.com/tigawanna/moggin/raw/4c7bf3e94cea4a3eaf91d259342e11a46781ef96/docs/android-stidio-for-react-native/images/file-structure-android-view.png)

**How to access**:
- **View → Tool Windows → Device File Explorer**
- Navigate to `/data/data/[your-app-package]/`
- Useful for debugging storage issues

### Additional Development Tools

1. **ADB (Android Debug Bridge)**:
   ```bash
   # List connected devices
   adb devices
   
   # Install APK
   adb install path/to/your/app.apk
   
   # View device logs
   adb logcat
   ```

2. **Emulator Management**:
   - **Tools → AVD Manager**
   - Create multiple device configurations
   - Test different Android versions

## Common Issues and Solutions

### Issue 1: "Autolinking is not set up in settings.gradle"

This error occurs when Expo modules aren't properly configured in your Android project.

**Solution**:

1. **First, try reopening Android Studio** and reloading the project
2. **Clean and reinstall dependencies**:
   ```bash
   rm -rf node_modules
   npm install
   # or
   yarn install
   ```

3. **Verify your `android/settings.gradle` file**:

```gradle
pluginManagement {
  def reactNativeGradlePlugin = new File(
    providers.exec {
      workingDir(rootDir)
      commandLine("node", "--print", "require.resolve('@react-native/gradle-plugin/package.json', { paths: [require.resolve('react-native/package.json')] })")
    }.standardOutput.asText.get().trim()
  ).getParentFile().absolutePath
  includeBuild(reactNativeGradlePlugin)
  
  def expoPluginsPath = new File(
    providers.exec {
      workingDir(rootDir)
      commandLine("node", "--print", "require.resolve('expo-modules-autolinking/package.json', { paths: [require.resolve('expo/package.json')] })")
    }.standardOutput.asText.get().trim(),
    "../android/expo-gradle-plugin"
  ).absolutePath
  includeBuild(expoPluginsPath)
}

plugins {
  id("com.facebook.react.settings")
  id("expo-autolinking-settings")
}

extensions.configure(com.facebook.react.ReactSettingsExtension) { ex ->
  if (System.getenv('EXPO_USE_COMMUNITY_AUTOLINKING') == '1') {
    ex.autolinkLibrariesFromCommand()
  } else {
    ex.autolinkLibrariesFromCommand(expoAutolinking.rnConfigCommand)
  }
}
expoAutolinking.useExpoModules()

rootProject.name = 'your-app-name'

expoAutolinking.useExpoVersionCatalog()

include ':app'
includeBuild(expoAutolinking.reactNativeGradlePlugin)
```

4. **If the issue persists, regenerate native code**:
   ```bash
   npx expo prebuild --clean
   ```

### Issue 2: Gradle Sync Failures

**Common causes and solutions**:

1. **Node.js not found**: Ensure you're using the correct Android Studio launcher (not `studio.sh`)
2. **JDK version mismatch**: Use the bundled JDK in Android Studio
3. **Network issues**: Configure proxy settings if behind a corporate firewall

### Issue 3: Emulator Performance Issues

**Optimization tips**:

1. **Enable Hardware Acceleration**:
   ```bash
   # Check if KVM is available
   grep -E "(vmx|svm)" /proc/cpuinfo
   
   # Install KVM if not present
   sudo apt install qemu-kvm libvirt-daemon-system libvirt-clients bridge-utils
   ```

2. **AVD Configuration**:
   - Allocate sufficient RAM (2GB minimum)
   - Enable "Use Host GPU" in AVD settings
   - Use x86_64 images for better performance

## Best Practices

### 1. Project Structure

- **Never directly edit the `android/` folder** in Expo projects
- Use **Expo Config Plugins** for native modifications
- Keep custom native modules in separate directories

### 2. Autolinking Configuration

Only modify autolinking settings if you have specific requirements:

```json
{
  "expo": {
    "name": "your-app-name",
    "autolinking": {
      "searchPaths": ["../../packages"],
      "nativeModulesDir": "../../packages"
    }
  }
}
```

### 3. Development Workflow

1. **Use Expo CLI** for project creation and management
2. **Test on real devices** when possible
3. **Use Android Studio** for:
   - Native code debugging
   - Performance profiling
   - Advanced logging
   - Build analysis

### 4. Version Management

- Keep Android Studio updated
- Use specific Android SDK versions for consistency
- Document your environment setup in project README

## Troubleshooting Checklist

Before asking for help, verify:

- [ ] Android Studio launches with the correct script
- [ ] Environment variables are set correctly
- [ ] Node.js is accessible from Android Studio
- [ ] Gradle can execute Node.js commands
- [ ] Expo CLI is up to date
- [ ] Project dependencies are installed

## Conclusion

With Android Studio properly configured on Linux, you now have a powerful development environment for React Native and Expo projects. The key points to remember:

1. **Use the correct launcher** to ensure Node.js integration
2. **Set up environment variables** properly
3. **Leverage Android Studio's debugging tools** for efficient development
4. **Follow Expo best practices** for native code modifications

This setup will provide you with professional-grade tools for mobile app development, from initial coding to debugging and performance optimization.
