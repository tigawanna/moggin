"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// modules/expo-wakatime-glance-widgets/plugins/index.ts
var index_exports = {};
__export(index_exports, {
  withExpoWakatimeGlanceWidgets: () => withPlugins_default
});
module.exports = __toCommonJS(index_exports);

// modules/expo-wakatime-glance-widgets/plugins/withComposeProjectLevelDependancyPlugin.ts
var import_config_plugins = require("expo/config-plugins");
var withComposeProjectLevelDependancyPlugin = (config, options) => {
  return (0, import_config_plugins.withProjectBuildGradle)(config, (config2) => {
    const buildGradleContent = config2.modResults.contents;
    if (!buildGradleContent.includes("compose-compiler-gradle-plugin")) {
      const dependenciesRegex = /(dependencies\s*\{[^}]*)/;
      const match = buildGradleContent.match(dependenciesRegex);
      if (match) {
        const newDependencies = match[1] + "\n    // Add the new Compose compiler plugin for Kotlin 2.0\n    classpath('org.jetbrains.kotlin:compose-compiler-gradle-plugin:2.0.0')";
        config2.modResults.contents = buildGradleContent.replace(
          dependenciesRegex,
          newDependencies
        );
      }
    }
    if (!buildGradleContent.includes("kotlin-serialization")) {
      const dependenciesRegex = /(dependencies\s*\{[^}]*)/;
      const match = config2.modResults.contents.match(dependenciesRegex);
      if (match) {
        const newDependencies = match[1] + "\n    // Add Kotlin serialization plugin\n    classpath('org.jetbrains.kotlin:kotlin-serialization:2.0.0')";
        config2.modResults.contents = config2.modResults.contents.replace(
          dependenciesRegex,
          newDependencies
        );
      }
    }
    if (!buildGradleContent.includes("kotlin-gradle-plugin:2.0.0")) {
      config2.modResults.contents = config2.modResults.contents.replace(
        /classpath\(['"]org\.jetbrains\.kotlin:kotlin-gradle-plugin[^'"]*['"]\)/,
        "classpath('org.jetbrains.kotlin:kotlin-gradle-plugin:2.0.0')"
      );
    }
    return config2;
  });
};
var withComposeProjectLevelDependancyPlugin_default = withComposeProjectLevelDependancyPlugin;

// modules/expo-wakatime-glance-widgets/plugins/withPlugins.ts
var withExpoWakatimeGlanceWidgets = (config, userOptions = {}) => {
  config = withComposeProjectLevelDependancyPlugin_default(config, userOptions);
  return config;
};
var withPlugins_default = withExpoWakatimeGlanceWidgets;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  withExpoWakatimeGlanceWidgets
});
