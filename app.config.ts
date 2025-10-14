import "tsx/cjs";

import { ConfigContext, ExpoConfig } from "expo/config";

const IS_DEV = process.env.APP_VARIANT === "development";
const IS_PREVIEW = process.env.APP_VARIANT === "preview";

const getUniqueIdentifier = () => {
  if (IS_DEV) {
    return "com.tigawanna.moggin.dev" as const;
  }

  if (IS_PREVIEW) {
    return "com.tigawanna.moggin.preview" as const;
  }

  return "com.tigawanna.moggin" as const;
};

type UniqueIDT = ReturnType<typeof getUniqueIdentifier>;

const getAppName = () => {
  if (IS_DEV) {
    return { name: "Moggin (Dev)", slug: "moggin" };
  }

  if (IS_PREVIEW) {
    return { name: "Moggin (Preview)", slug: "moggin" };
  }

  return { name: "Moggin", slug: "moggin" };
};

const getPlugins = (idt: UniqueIDT) => {
  const plugins: ConfigContext["config"]["plugins"] = [
    "expo-router",
    "expo-build-properties",
    "expo-font",
    "expo-web-browser",
    [
      "expo-splash-screen",
      {
        image: "./assets/icons/splash-icon-light.png",
        resizeMode: "contain",
        backgroundColor: "#fff",
        dark: {
          image: "./assets/icons/splash-icon-dark.png",
          resizeMode: "contain",
          backgroundColor: "#000",
        },
      },
    ],
    [
      "expo-build-properties",
      {
        android: {
          enableMinifyInReleaseBuilds: idt === "com.tigawanna.moggin" ? true : false,
          allowBackup: false,
        },
      },
    ],
    // "./modules/expo-wakatime-glance-widgets/plugins/withPlugins.ts",
  ];
  return plugins;
};

export default ({ config }: ConfigContext): ExpoConfig => {
  const appIdentifier = getUniqueIdentifier();
  const { name, slug } = getAppName();
  const plugins = getPlugins(appIdentifier);
  const is_production = appIdentifier === "com.tigawanna.moggin";

  if (is_production) {
    plugins.push("@react-native-firebase/app");
    plugins.push("@react-native-firebase/crashlytics");
  }
  return {
    ...config,
    name,
    slug,
    scheme: slug,
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
      package: appIdentifier,
      googleServicesFile:is_production ? "./google-services.json" : undefined,
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins,
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
    updates: {
      url: "https://u.expo.dev/bef58162-7beb-4614-9e99-06ac846b57e1",
    },
    runtimeVersion: {
      policy: "appVersion",
    },
    extra: {
      ...config.extra,
      eas: {
        projectId: "bef58162-7beb-4614-9e99-06ac846b57e1",
      },
    },
  };
};
