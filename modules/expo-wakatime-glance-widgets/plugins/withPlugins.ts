import { ConfigPlugin } from "expo/config-plugins";
import withComposeProjectLevelDependancyPlugin from "./withComposeProjectLevelDependancyPlugin";

export interface WithExpoWakatimeGlanceWidgetsProps{

}

 const withExpoWakatimeGlanceWidgets: ConfigPlugin<Partial<WithExpoWakatimeGlanceWidgetsProps>> = (
  config,
  userOptions = {}
) => {
    config = withComposeProjectLevelDependancyPlugin(config, userOptions);
  return config;
};

export default withExpoWakatimeGlanceWidgets;
