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
