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
        widgetClassPath:
          "C:\\Users\\user\\AndroidStudioProjects\\Bidii-kotlin-widget\\app\\src\\main\\java\\com\\tigawanna\\bidii",
        manifestPath:
          "C:\\Users\\user\\AndroidStudioProjects\\Bidii-kotlin-widget\\app\\src\\main\\AndroidManifest.xml",
        resPath: "C:\\Users\\user\\AndroidStudioProjects\\Bidii-kotlin-widget\\app\\src\\main\\res",
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
});
