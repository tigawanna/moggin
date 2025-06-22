"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const withComposeProjectLevelDependancyPlugin_1 = __importDefault(require("./withComposeProjectLevelDependancyPlugin"));
const DEFAULT_OPTIONS = {
    widgetClassPath: "widgets/android/MyWidget.kt",
    manifestPath: "widgets/android/AndroidManifest.xml",
    resPath: "widgets/android/res",
};
function getDefaultedOptions(options) {
    return {
        ...DEFAULT_OPTIONS,
        ...options,
    };
}
const withExpoGlanceWidgets = (config, userOptions) => {
    const options = getDefaultedOptions(userOptions);
    const sdkVersion = parseInt(config.sdkVersion?.split(".")[0] || "0", 10);
    console.log("withExpoGlanceWidgets options ====  😍", options);
    console.log("withExpoGlanceWidgets sdk version ==== 👌", sdkVersion);
    if (sdkVersion < 50) {
        throw new Error("Expo Glance Widgets requires SDK version 50 or higher.");
    }
    config = (0, withComposeProjectLevelDependancyPlugin_1.default)(config, options);
    return config;
};
exports.default = withExpoGlanceWidgets;
