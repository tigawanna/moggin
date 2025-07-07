import { ConfigContext, ExpoConfig } from "expo/config";
import {withExpoGlanceWidgets} from "./modules/expo-glance-widget/plugins";

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
    icon: {
      light: "./assets/icons/ios-light.png",
      dark: "./assets/icons/ios-dark.png",
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/icons/adaptive-icon.png",
      monochromeImage: "./assets/icons/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
    edgeToEdgeEnabled: true,
    package: "com.tigawanna.moggin",
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
        image: "./assets/icons/splash-icon-light.png",
        imageWidth: 200,
        resizeMode: "contain",
        backgroundColor: "#ffffff",
        dark: {
          image: "./assets/icons/splash-icon-dark.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#000000",
        },
      },
    ],
    // Expo Glance Widgets plugin for Android widget support
    [
      withExpoGlanceWidgets as any,
      {
        widgetFilesPath:
          "./widgets/android",
        manifestPath:
          "./widgets/android/AndroidManifest.xml",
        resPath: "./widgets/android/res",
        // widgetFilesPath:
        //   "C:\\Users\\user\\AndroidStudioProjects\\Bidii-kotlin-widget\\app\\src\\main\\java\\com\\tigawanna\\bidii",
        // manifestPath:
        //   "C:\\Users\\user\\AndroidStudioProjects\\Bidii-kotlin-widget\\app\\src\\main\\AndroidManifest.xml",
        // resPath: "C:\\Users\\user\\AndroidStudioProjects\\Bidii-kotlin-widget\\app\\src\\main\\res",
        // Only copy from these specific directories
        includeDirectories: ["wakatime"],
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
    extra: {
      eas: {
        projectId: "bef58162-7beb-4614-9e99-06ac846b57e1",
      },
    },
  
});
