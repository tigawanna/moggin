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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const manifestSync_1 = require("../plugins/utils/manifestSync");
describe('ManifestSync', () => {
    const tempDir = path.join(__dirname, 'temp');
    const projectRoot = tempDir;
    const manifestPath = path.join(tempDir, 'custom-widgets', 'AndroidManifest.xml');
    beforeEach(() => {
        // Create a temporary directory structure for testing
        fs.mkdirSync(tempDir, { recursive: true });
        fs.mkdirSync(path.join(tempDir, 'custom-widgets'), { recursive: true });
        // Create a dummy widget manifest file
        fs.writeFileSync(manifestPath, `<manifest xmlns:android="http://schemas.android.com/apk/res/android">
        <uses-permission android:name="android.permission.INTERNET" />
        <application>
          <receiver android:name=".MyWidgetReceiver" android:exported="false">
            <intent-filter>
              <action android:name="android.appwidget.action.APPWIDGET_UPDATE" />
            </intent-filter>
            <meta-data android:name="android.appwidget.provider" android:resource="@xml/my_widget_info" />
          </receiver>
        </application>
      </manifest>`);
    });
    afterEach(() => {
        // Clean up the temporary directory
        fs.rmSync(tempDir, { recursive: true, force: true });
    });
    it('should merge receivers and permissions from the widget manifest', () => __awaiter(void 0, void 0, void 0, function* () {
        const config = {
            modResults: {
                manifest: {
                    'uses-permission': [],
                    application: [{
                            receiver: []
                        }],
                },
            },
        };
        yield manifestSync_1.ManifestSync.addReceiversToMainManifest(config, projectRoot, manifestPath);
        const mainApplication = config.modResults.manifest.application[0];
        expect(mainApplication.receiver).toHaveLength(1);
        expect(mainApplication.receiver[0].$['android:name']).toBe('.MyWidgetReceiver');
        const mainManifest = config.modResults.manifest;
        expect(mainManifest['uses-permission']).toHaveLength(1);
        expect(mainManifest['uses-permission'][0].$['android:name']).toBe('android.permission.INTERNET');
    }));
});
