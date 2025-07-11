# react native friendly android stuidio project setup on linux


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
