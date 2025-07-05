"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const widgetClassSync_1 = require("../plugins/utils/widgetClassSync");
describe('WidgetClassSync', () => {
    const tempDir = path.join(__dirname, 'temp');
    const projectRoot = tempDir;
    const platformRoot = path.join(tempDir, 'android');
    const widgetFilesPath = path.join(tempDir, 'custom-widgets');
    const packageName = 'com.example.myapp';
    beforeEach(() => {
        // Create a temporary directory structure for testing
        fs.mkdirSync(tempDir, { recursive: true });
        fs.mkdirSync(platformRoot, { recursive: true });
        fs.mkdirSync(widgetFilesPath, { recursive: true });
        // Create some dummy widget files
        fs.writeFileSync(path.join(widgetFilesPath, 'MyWidget.kt'), 'package com.example.oldpackage\n\nclass MyWidget');
        fs.mkdirSync(path.join(widgetFilesPath, 'wakatime'), { recursive: true });
        fs.writeFileSync(path.join(widgetFilesPath, 'wakatime', 'WakaTimeWidget.kt'), 'package com.example.oldpackage.wakatime\n\nclass WakaTimeWidget');
    });
    afterEach(() => {
        // Clean up the temporary directory
        fs.rmSync(tempDir, { recursive: true, force: true });
    });
    it('should copy files from includeDirectories and update package names', () => {
        widgetClassSync_1.WidgetClassSync.copyToBuild(projectRoot, platformRoot, widgetFilesPath, packageName, 'Widget', ['wakatime']);
        const expectedWakaTimeWidgetPath = path.join(platformRoot, 'app/src/main/java/com/example/myapp/wakatime/WakaTimeWidget.kt');
        expect(fs.existsSync(expectedWakaTimeWidgetPath)).toBe(true);
        const wakatimeWidgetContent = fs.readFileSync(expectedWakaTimeWidgetPath, 'utf-8');
        expect(wakatimeWidgetContent).toContain('package com.example.myapp.wakatime');
    });
});
