# react native friendly android stuidio setup on linux


1 . Install Android Studio on Linux

```bash
sudo apt update
# add the repository for Android Studio
sudo add-apt-repository ppa:maarten-fonville/android-studio -y
# install Android Studio
sudo apt install android-studio -y
sudo apt upgrade
```

2 Configure Android Studio

- Open Android Studio and follow the setup wizard to install the necessary SDK components.
- Ensure you have the latest Android SDK and build tools installed.
- Create a new native Kotlin app and hit the run button to verify that everything is working correctly.

 
## Configure the react native stuff
>[!TIP]
> Change the launch script to the more native one as recommended by android studio

Open `/usr/share/applications/android-studio.desktop` and change

`Exec=/opt/android-studio-2025.1.1/android-studio/bin/studio.sh`

to

`Exec=/opt/android-studio-2025.1.1/android-studio/bin/studio`

This is important because opening a react native/expo project with the fomer way will not load the nodejs environment and will have issues resolving `File` symbols that react native ses in thier gradle configs

Example:
```gradle
def reactNativeAndroidDir = new File(
  providers.exec {
    workingDir(rootDir)
    commandLine("node", "--print", "require.resolve('react-native/package.json')")
  }.standardOutput.asText.get().trim(),
  "../android"
)
```
If you're still experiencing issues, you can also try opening vscode directly form the terminal with the command:

```bash
/opt/android-studio-2025.1.1/android-studio/bin/studio

```

>[!TIP]
> If you are using a different version of Android Studio, make sure to update the paths accordingly.



> Alias your `JAVA_HOME` and `ANDROID_HOME` to the default android studio java location

You can add these to your `~/.bashrc`

```bash
# Set JAVA_HOME to the JDK bundled with Android Studio
export JAVA_HOME="/opt/android-studio-2025.1.1/android-studio/jbr"
export PATH="$JAVA_HOME/bin:$PATH"

# Android SDK
export ANDROID_HOME="$HOME/Android/Sdk"
export PATH="$ANDROID_HOME/platform-tools:$ANDROID_HOME/tools:$ANDROID_HOME/tools/bin:$PATH"
```
>[!NOTE]
> Remember to confirm your `ANDROID_SDK` and `JAVA_HOME` exist in nadroid stuio open tools >

>[!TIP]
> use the app inspection tool for debugging background tasks, network requests and built-in databases

In Android Studio, select `View > Tool Windows > App Inspection` from the menu bar

Right below it is the `Logcat` tool window, which is useful for viewing logs and debugging output from your React Native app.

if you encounter the issue `Autolinking is not set up in settings.gradle: expo modules won't be autolinked.`, you can try the following steps:

1. Try reopening android studio and reloading the project.
2. Try deldeleting the node_modules and reinstalling them:

3. Open the `android/settings.gradle` file in your React Native project.
4. Ensure that the `include` statements for the Expo modules are present and correctly configured.

```kotlin
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

rootProject.name = 'moggin'

expoAutolinking.useExpoVersionCatalog()

include ':app'
includeBuild(expoAutolinking.reactNativeGradlePlugin)

```
>[!NOTE]
> You shouldn't directly edit the android folder in an expo project and if it's necessary, you should use `expo config plugins` with the `expo prebuild` command to regenerate the native code.

5. If anything seems off consider doing a fresh prebuild to regenerate the native code:
6. A config option that can affect this folder is the `autolinking` configuration in your `app.json` or `app.config.js` file. It is recommended to leave the default settings unless you have specific requirements.


```json
{  "expo": {
    "name": "moggin",
    //..... rest of the config file
    "autolinking": {
      "searchPaths": [
        "../../packages"
      ],
      "nativeModulesDir": "../../packages"
    }
  }
}
```
