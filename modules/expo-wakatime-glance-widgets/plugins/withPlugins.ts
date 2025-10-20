import { ConfigPlugin } from "expo/config-plugins";
import withComposeProjectLevelDependancyPlugin from "./withComposeProjectLevelDependancyPlugin";
import withInitializeWorkManager from "./withInitializeWorkManger";

export interface WithExpoWakatimeGlanceWidgetsProps {
  // Configuration options can be added here
}

const withExpoWakatimeGlanceWidgets: ConfigPlugin<Partial<WithExpoWakatimeGlanceWidgetsProps>> = (
  config,
  userOptions = {}
) => {
  // Apply Jetpack Compose dependencies
  config = withComposeProjectLevelDependancyPlugin(config, userOptions);
  
  // Initialize WorkManager in MainActivity
  config = withInitializeWorkManager(config, userOptions);
  
  return config;
};

export default withExpoWakatimeGlanceWidgets;
