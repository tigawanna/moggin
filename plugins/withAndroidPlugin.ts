import { ConfigPlugin, withAndroidManifest } from "expo/config-plugins";
// TODO now figure out how to add the compose plugin in the project levelgradle file with this
// plugins {
//   alias(libs.plugins.android.application) apply false
//   alias(libs.plugins.kotlin.android) apply false
//   alias(libs.plugins.kotlin.compose) apply false
// }
const withAndroidPlugin: ConfigPlugin = (config) => {
  // Define a custom message
  const message = "Hello world, from Expo plugin!";

  return withAndroidManifest(config, (config) => {
    const mainApplication = config?.modResults?.manifest?.application?.[0];

    if (mainApplication) {
      // Ensure meta-data array exists
      if (!mainApplication["meta-data"]) {
        mainApplication["meta-data"] = [];
      }

      // Add the custom message as a meta-data entry
      mainApplication["meta-data"].push({
        $: {
          "android:name": "HelloWorldMessage",
          "android:value": message,
        },
      });
    }

    return config;
  });
};

export default withAndroidPlugin;
