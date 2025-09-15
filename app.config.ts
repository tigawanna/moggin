import { ConfigContext, ExpoConfig } from "expo/config";
import { withExpoWakatimeGlanceWidgets } from "./modules/expo-wakatime-glance-widgets/plugins/index";

const IS_DEV = process.env.APP_VARIANT === "development";
const IS_PREVIEW = process.env.APP_VARIANT === "preview";

const getUniqueIdentifier = () => {
  if (IS_DEV) {
    return "com.tigawanna.moggin.dev";
  }

  if (IS_PREVIEW) {
    return "com.tigawanna.moggin.preview";
  }

  return "com.tigawanna.moggin";
};

const getAppName = () => {
  if (IS_DEV) {
    return { name: "Moggin (Dev)", slug: "moggin-dev" };
  }

  if (IS_PREVIEW) {
    return { name: "Moggin (Preview)", slug: "moggin-preview" };
  }

  return { name: "Moggin", slug: "moggin" };
};

export default ({ config }: ConfigContext): ExpoConfig => {
  const { name, slug } = getAppName();
  return {
    ...config,
    name,
    slug,
    scheme:slug,
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/splash-icon.png",
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
      package: getUniqueIdentifier(),
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
      reactCompiler: true,
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
  };
};
