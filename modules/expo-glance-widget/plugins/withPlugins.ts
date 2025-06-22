import { ConfigPlugin } from "expo/config-plugins";
import withComposeProjectLevelDependancyPlugin from "./withComposeProjectLevelDependancyPlugin";

export interface WithExpoGlanceWidgetsProps {
  widgetClassPath: string;
  manifestPath: string;
  resPath: string;
}

const DEFAULT_OPTIONS: WithExpoGlanceWidgetsProps = {
  widgetClassPath: "widgets/android/MyWidget.kt",
  manifestPath: "widgets/android/AndroidManifest.xml",
  resPath: "widgets/android/res",
};

function getDefaultedOptions(options: WithExpoGlanceWidgetsProps) {
  return {
    ...DEFAULT_OPTIONS,
    ...options,
  };
}

const withExpoGlanceWidgets: ConfigPlugin<WithExpoGlanceWidgetsProps> = (config, userOptions) => {
  const options = getDefaultedOptions(userOptions);
  const sdkVersion = parseInt(config.sdkVersion?.split(".")[0] || "0", 10);
  console.log("withExpoGlanceWidgets options ====  😍", options);
  console.log("withExpoGlanceWidgets sdk version ==== 👌", sdkVersion);
   if (sdkVersion < 50) {
      throw new Error("Expo Glance Widgets requires SDK version 50 or higher.");
   }
  config = withComposeProjectLevelDependancyPlugin(config, options);

  return config;
};

export default withExpoGlanceWidgets;
