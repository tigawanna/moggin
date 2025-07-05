
# WIP
# Setting Up Expo Glance Widget Project

## 1. Create a New Expo Project

```sh
npx create-expo-app@latest

```

## 2. Add Development Client

```sh
npx expo install expo-dev-client
```


for convenience, add the following script to your `package.json`:

```json
"scripts": {
    //... your existing scripts
    "android": "expo run:android",
    "prebuild:android": "expo prebuild -p android --clean",
    "build:android": "npm run build:plugins && npm run prebuild:android && npm run android",
}


🚧 build to ensure everything is working properly
```sh
npm run build:android
```build:android
```

## 4. Add Native Module

Follow the [native module integration guide](https://docs.expo.dev/modules/get-started/#add-a-new-module-to-an-existing-application)

```sh
pnpx create-expo-module@latest expo-glance-widget --local
```

```sh
npm run build:android
```


convert your `app.json` to `app.config.ts` 
This will be neede in order to define some custom config plugins that in our case will add the jetpack compose compiler plugin to the project level gradle , see the [compatibility map](https://developer.android.com/jetpack/androidx/releases/compose-kotlin#pre-release_kotlin_compatibility)

>[!NOTE]
> Compose compiler plugin is required for suing any jetpack compose features in a kotlin 2.0 + project


> [!TIP]
> You can use a specific kotlin version by using `expo-build-properties` plugin and setting the kotlin version to 2.0.0

> [!NOTE]
> In my expo 53 project kotlin 2.0 is being used by default, disabling it leads to the edge-to-edge config that's mandatory in new android
projects to not work properly





A simple port of pur `app.json` to `app.config.ts` :

```ts
{
  "expo": {
    "name": "moggin",
    "slug": "moggin",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "scheme": "moggin",
    "userInterfaceStyle": "automatic",
    "newArchEnabled": true,
    "ios": {
      "supportsTablet": true
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "edgeToEdgeEnabled": true,
      "package": "com.anonymous.moggin"
    },
    "web": {
      "bundler": "metro",
      "output": "static",
      "favicon": "./assets/images/favicon.png"
    },
    "plugins": [
      "expo-router",
      [
        "expo-splash-screen",
        {
          "image": "./assets/images/splash-icon.png",
          "imageWidth": 200,
          "resizeMode": "contain",
          "backgroundColor": "#ffffff"
        }
      ]
    ],
    "experiments": {
      "typedRoutes": true
    }
  }
}
```

🚧 build to ensure everything is working properly
```sh
npm run build:android
```


6 . Import the config plugin in your `app.config.ts` file

```ts
import { ConfigContext, ExpoConfig } from "expo/config";
import withExpoGlanceWidgets from "./modules/expo-glance-widget/plugins/withPlugins";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "moggin",
  slug: "moggin",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "moggin",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
    edgeToEdgeEnabled: true,
    package: "com.anonymous.moggin",
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/favicon.png",
  },
  plugins: [
    "expo-router",
    [
      "expo-splash-screen",
      {
        image: "./assets/images/splash-icon.png",
        imageWidth: 200,
        resizeMode: "contain",
        backgroundColor: "#ffffff",
      },
    ],
    // Expo Glance Widgets plugin for Android widget support
    [
      withExpoGlanceWidgets as any,
      {
        widgetFilesPath:
          "C:\Users\user\Desktop\code\expo\moggin\widgets\android",
        manifestPath:
          "C:\Users\user\Desktop\code\expo\moggin\widgets\android\AndroidManifest.xml",
        resPath: "C:\Users\user\Desktop\code\expo\moggin\widgets\android\res",
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
});

```


>[!NOTE]
> The steps below are useful if you intend to make a native view that will be imported in the expo project, but widgets never get imported in the expo project, so in our case all the logic will live in config plugins to copy the files into the root `android` folder.
> check under `modules/expo-glance-widget/plugins/README.md` for more details on how to use the config plugin to setup your widget


## The manual steps explaining what the config plugin does

### - Add Jetpack Compose Dependencies
We now need to add the necessary Jetpack Compose dependencies to our project.

[official jetpack compose reference](https://developer.android.com/develop/ui/compose/setup#kotlin_1)
[official jetpack compose glance reference](https://developer.android.com/develop/ui/compose/glance/setup)

These dependencies will be added to the `modules/expo-glance-widget/android/build.gradle` file

```kotlin
    // Other configurations...
android {
    // Other configurations...
  buildFeatures {
    compose true
  }
  //   enable the one below if you're using kotlin version < 2.0
    // composeOptions {
    //     kotlinCompilerExtensionVersion = "1.5.3" 
    // }
}
dependencies {
  // Add Compose BOM to ensure compatible versions
  implementation platform('androidx.compose:compose-bom:2024.02.00')
  
  // Core Compose dependencies
  implementation 'androidx.compose.runtime:runtime'
  implementation 'androidx.compose.ui:ui'
  implementation 'androidx.compose.ui:ui-tooling-preview'
  implementation 'androidx.compose.material3:material3'
  
  // Glance dependencies for widgets
  implementation 'androidx.glance:glance:1.0.0'
  implementation 'androidx.glance:glance-appwidget:1.0.0'
  
  // Activity Compose (if needed)
  implementation 'androidx.activity:activity-compose:1.8.2'
}

apply plugin: "org.jetbrains.kotlin.android"
apply plugin: "org.jetbrains.kotlin.plugin.compose"
```

In a native kotlin project the compose plugin would be added to the project level `build.gradle` file
like so 

```kotlin
buildscript {
  repositories {
    google()
    mavenCentral()
  }
  dependencies {
    classpath('com.android.tools.build:gradle')
    classpath('com.facebook.react:react-native-gradle-plugin')
    classpath('org.jetbrains.kotlin:kotlin-gradle-plugin:2.0.0')
  
    // We need to add this one to enable compose compiler plugin
    classpath('org.jetbrains.kotlin:compose-compiler-gradle-plugin:2.0.0')}
}

```

>[!NOTE]
> adding configs direclty to the project level `build.gradle` file is not advised in an expo project, as it will be overwritten by the expo prebuild process.
> we need to add a custom config plugin to do it for us

### - Add Custom Config Plugin
Create a new file `plugins/withAndroidPlugin.ts` and add the following code:

```ts
import { ConfigPlugin, withProjectBuildGradle } from "expo/config-plugins";

const withAndroidPlugin: ConfigPlugin = (config) => {
  return withProjectBuildGradle(config, (config) => {
    const buildGradleContent = config.modResults.contents;

    // Check if the compose plugin is already added
    if (!buildGradleContent.includes("compose-compiler-gradle-plugin")) {
      // Find the dependencies block and add the compose plugin
      const dependenciesRegex = /(dependencies\s*\{[^}]*)/;
      const match = buildGradleContent.match(dependenciesRegex);

      if (match) {
        const newDependencies =
          match[1] +
          "\n    // Add the new Compose compiler plugin for Kotlin 2.0" +
          "\n    classpath('org.jetbrains.kotlin:compose-compiler-gradle-plugin:2.0.0')";

        config.modResults.contents = buildGradleContent.replace(
          dependenciesRegex,
          newDependencies
        );
      }
    }

    // Also update Kotlin version if needed
    if (!buildGradleContent.includes("kotlin-gradle-plugin:2.0.0")) {
      config.modResults.contents = config.modResults.contents.replace(
        /classpath\(['"]org\.jetbrains\.kotlin:kotlin-gradle-plugin[^'"]*['"]\)/,
        "classpath('org.jetbrains.kotlin:kotlin-gradle-plugin:2.0.0')"
      );
    }

    return config;
  });
};

export default withAndroidPlugin;
```

Then, add this plugin to your `app.config.ts`:

```ts
import { ConfigContext, ExpoConfig } from "expo/config";
import withAndroidPlugin from "./plugins/withAndroidPlugin";



export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "moggin",
  slug: "moggin",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "moggin",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
    edgeToEdgeEnabled: true,
    package: "com.anonymous.moggin",
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/favicon.png",
  },
  plugins: [
    "expo-router",
    [
      "expo-splash-screen",
      {
        image: "./assets/images/splash-icon.png",
        imageWidth: 200,
        resizeMode: "contain",
        backgroundColor: "#ffffff",
      },
    ],
    // Add your custom Android plugin
    withAndroidPlugin as any // the config works just fine ignore the type mismatch
  ],
  experiments: {
    typedRoutes: true,
  },
});
```

🚧 build to ensure everything is working properly
```sh
npm run build:android
```
