import { ConfigContext, ExpoConfig } from "expo/config";
import {withExpoGlanceWidgets} from "./.1-old-widgets/expo-glance-widget/plugins";
import {withExpoWakatimeGlanceWidgets} from "./modules/expo-wakatime-glance-widgets/plugins/index"
const defaultWidgetSources = {
  widgetFilesPath:
    "widgets/android",
  manifestPath:
    "widgets/android/AndroidManifest.xml",
  resPath: "widgets/android/res",
};
const externalWidgetSources = {
  widgetFilesPath:
    "/home/dennis/AndroidStudioProjects/Bidii-kotlin-widget/app/src/main/java/com/tigawanna/bidii",
  manifestPath: "/home/dennis/AndroidStudioProjects/Bidii-kotlin-widget/app/src/main/AndroidManifest.xml",
  resPath: "/home/dennis/AndroidStudioProjects/Bidii-kotlin-widget/app/src/main/res",
};
const isDev = process.env.NODE_ENV === "development"

const widgetSources = isDev ? externalWidgetSources : defaultWidgetSources;

export default ({ config }: ConfigContext): ExpoConfig => {
  return {
    ...config,
    name: "moggin",
    slug: "moggin",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/splash-icon.png",
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
      "expo-background-task",
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
      [withExpoWakatimeGlanceWidgets as any],
      //Expo Glance Widgets plugin for Android widget support
      // [
      //   withExpoGlanceWidgets as any,
      //   {
      //     ...widgetSources,
      //     // Only copy from these specific directories
      //     includeDirectories: ["wakatime"],
      //     enableWorkManager: true, // Enable WorkManager for background updates
      //   },
      // ],
    ],
    experiments: {
      typedRoutes: true,
      // reactCompiler: true,
    },
    extra: {
      ...config.extra,
      router: {
        routeConvention: "expo-router",
        root: "./app",
      },
      eas: {
        projectId: "bef58162-7beb-4614-9e99-06ac846b57e1",
      },
    },
  };};
