i want to buld a util for the config plugin that will copy 
all files including Widget wnd ending with .kt to the root android folder  

const DEFAULT_OPTIONS: WithExpoGlanceWidgetsProps = {
  widgetClassPath: "widgets/android/MyWidget.kt",
  manifestPath: "widgets/android/AndroidManifest.xml",
  resPath: "widgets/android/res",
};

using the widgetClssPath
android\app\src\main\java\com\anonymous\moggin but anonymous  is the package name if one is defined
 as for the manifests the user can point to an xml file and we'll remove every <reciever> andadd it to our root android manifets
example reciever snippet
        <receiver android:name=".BidiiHoursWidgetReceiver"  android:exported="true">
            <intent-filter>
                <action android:name="android.appwidget.action.APPWIDGET_UPDATE" />
            </intent-filter>
            <meta-data
                android:name="android.appwidget.provider"
                android:resource="@xml/bidii_hours_widget" />
        </receiver>

        and lets also copy the res files and copy all the assets the user points to in that path inot our root android folder and copy over th eones that don't exist no overwriting existing filesand print a little warning about a file that already exits with the same name in the destination 


        try and makes things readable with jsdoc comments wre necessary

        
 




here,s a sample application
import path from 'path';
import { WithExpoAndroidWidgetsProps } from '..';
import { Logging } from '../utils/logger';
import fs from 'fs-extra';
import {
  ConfigPlugin,
  withDangerousMod,
  AndroidConfig,
} from '@expo/config-plugins';

export const withSourceFiles: ConfigPlugin<WithExpoAndroidWidgetsProps> = (
  config,
  options
) => {
  return withDangerousMod(config, [
    'android',
    async (newConfig) => {
      const { modRequest } = newConfig;

      const projectRoot = modRequest.projectRoot;
      const platformRoot = modRequest.platformProjectRoot;
      const widgetFolderPath = path.join(projectRoot, options.src);
      const packageName = AndroidConfig.Package.getPackage(config);

      if (!packageName) {
        throw new Error(
          `ExpoWidgets:: app.(ts/json) must provide a value for android.package.`
        );
      }

      copyResourceFiles(widgetFolderPath, platformRoot);

      const sourceFiles = copySourceFiles(
        widgetFolderPath,
        platformRoot,
        packageName
      );

      modifySourceFiles(options.distPlaceholder, sourceFiles, packageName);

      return newConfig;
    },
  ]);
};

function copyResourceFiles(widgetFolderPath: string, platformRoot: string) {
  const resourcesFolder = path.join(widgetFolderPath, 'src/res');
  const destinationFolder = path.join(platformRoot, 'app/src/main/res');

  if (!fs.existsSync(resourcesFolder)) {
    Logging.logger.debug(
      `No resource "res" folder found in the widget source directory ${widgetFolderPath}. No resource files copied over.`
    );
    return;
  }

  Logging.logger.debug(
    `Copying resources from ${resourcesFolder} to ${destinationFolder}`
  );

  safeCopy(resourcesFolder, destinationFolder);
}

function safeCopy(sourcePath: string, destinationPath: string) {
  try {
    if (!fs.existsSync(destinationPath)) {
      fs.mkdirSync(destinationPath);
    }

    fs.copySync(sourcePath, destinationPath);
  } catch (e) {
    Logging.logger.warn(e);
  }
}

function getSourceFileDestinationFolder(
  packageName: string,
  widgetFolderPath: string,
  platformRoot: string
) {
  const packageNameAsPath = packageName?.replace(/\./g, '/');

  return path.join(platformRoot, 'app/src/main/java', packageNameAsPath);
}

function copySourceFiles(
  widgetFolderPath: string,
  platformRoot: string,
  packageName: string
) {
  const originalSourceFolder = path.join(
    widgetFolderPath,
    'src/main/java/package_name'
  );
  const destinationFolder = getSourceFileDestinationFolder(
    packageName,
    widgetFolderPath,
    platformRoot
  );

  if (!fs.existsSync(destinationFolder)) {
    fs.mkdirSync(destinationFolder);
  }

  Logging.logger.debug(
    `Copying source files from ${originalSourceFolder} to ${destinationFolder}`
  );

  const paths = fs.readdirSync(originalSourceFolder);

  const sourceFiles: string[] = [];

  for (const relativePath of paths) {
    const sourcePath = path.join(originalSourceFolder, relativePath);
    const destinationPath = path.join(destinationFolder, relativePath);

    if (fs.lstatSync(sourcePath).isDirectory()) {
      // If src is a directory it will copy everything inside of this directory, not the entire directory itself
      fs.emptyDirSync(destinationPath);
    }

    const file = path.basename(relativePath);

    if (file === 'Module.kt') {
      Logging.logger.debug('Module file skipped during source file copy.');
      continue;
    }

    Logging.logger.debug(`Copying file ${sourcePath} to ${destinationPath}`);
    fs.copySync(sourcePath, destinationPath);
    sourceFiles.push(destinationPath);
  }

  return sourceFiles;
}

function escapeRegExp(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function replaceAll(source: string, find: string, replace: string) {
  return source.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

function modifySourceFiles(
  distPlaceholder: string,
  sourceFiles: string[],
  packageName: string
) {
  if (!distPlaceholder?.length) {
    Logging.logger.debug(
      'No distPlaceholder set. Modification of source files not required.'
    );
    return;
  } else if (sourceFiles.length == 0) {
    Logging.logger.debug('No source files provided for modification.');
    return;
  }

  Logging.logger.debug(
    `Modifying source files with placeholder ${distPlaceholder} to package ${packageName}`
  );

  const packageSearchStr = `package ${distPlaceholder}`;
  const packageReplaceStr = `package ${packageName}`;

  const importSearchStr = `import ${distPlaceholder}`;
  const importReplaceStr = `import ${packageName}`;

  for (const filePath of sourceFiles) {
    const contents = fs.readFileSync(filePath, { encoding: 'utf-8' });
    Logging.logger.debug(contents);

    const withModulesFixed = replaceAll(
      contents,
      packageSearchStr,
      packageReplaceStr
    );
    const withImportsFixed = replaceAll(
      withModulesFixed,
      importSearchStr,
      importReplaceStr
    );

    fs.writeFileSync(filePath, withImportsFixed);
  }
}
