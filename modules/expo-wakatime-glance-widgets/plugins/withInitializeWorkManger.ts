import { ConfigPlugin, withMainActivity } from "expo/config-plugins";

export interface WithInitializeWorkManagerProps {
  // Future configuration options can be added here
}

const withInitializeWorkManager: ConfigPlugin<Partial<WithInitializeWorkManagerProps>> = (
  config,
  userOptions = {}
) => {
  return withMainActivity(config, (config) => {
    if (config.modResults.language === "java") {
      config.modResults.contents = addWorkManagerToJavaActivity(config.modResults.contents);
    } else if (config.modResults.language === "kt") {
      config.modResults.contents = addWorkManagerToKotlinActivity(config.modResults.contents);
    }
    return config;
  });
};

function addWorkManagerToJavaActivity(mainActivity: string): string {
  // Add import for WorkManager
  const importToAdd = "import expo.modules.wakatimeglancewidgets.hours_widget.WakatimeWidgetWorker;";
  
  if (!mainActivity.includes(importToAdd)) {
    // Find the last import statement and add our import after it
    const importRegex = /import\s+.*?;/g;
    const matches = [...mainActivity.matchAll(importRegex)];
    
    if (matches.length > 0) {
      const lastImport = matches[matches.length - 1];
      const insertPosition = lastImport.index! + lastImport[0].length;
      mainActivity = mainActivity.slice(0, insertPosition) + "\n" + importToAdd + mainActivity.slice(insertPosition);
    }
  }

  // Add WorkManager initialization in onCreate
  const onCreateCall = "WakatimeWidgetWorker.setupPeriodicWork(this);";
  
  if (!mainActivity.includes(onCreateCall)) {
    // Find the onCreate method and add our initialization
    const onCreateRegex = /(onCreate\([^)]*\)\s*\{[^}]*super\.onCreate[^;]*;)/;
    const match = mainActivity.match(onCreateRegex);
    
    if (match) {
      const insertPosition = match.index! + match[0].length;
      mainActivity = mainActivity.slice(0, insertPosition) + "\n    " + onCreateCall + mainActivity.slice(insertPosition);
    }
  }

  return mainActivity;
}

function addWorkManagerToKotlinActivity(mainActivity: string): string {
  // Add import for WorkManager
  const importToAdd = "import expo.modules.wakatimeglancewidgets.hours_widget.WakatimeWidgetWorker";
  
  if (!mainActivity.includes(importToAdd)) {
    // Find the last import statement and add our import after it
    const importRegex = /import\s+.*$/gm;
    const matches = [...mainActivity.matchAll(importRegex)];
    
    if (matches.length > 0) {
      const lastImport = matches[matches.length - 1];
      const insertPosition = lastImport.index! + lastImport[0].length;
      mainActivity = mainActivity.slice(0, insertPosition) + "\n" + importToAdd + mainActivity.slice(insertPosition);
    }
  }

  // Add WorkManager initialization in onCreate
  const onCreateCall = "WakatimeWidgetWorker.setupPeriodicWork(this)";
  
  if (!mainActivity.includes(onCreateCall)) {
    // Find the onCreate method and add our initialization
    const onCreateRegex = /(override\s+fun\s+onCreate\([^)]*\)\s*\{[^}]*super\.onCreate[^}]*)/;
    const match = mainActivity.match(onCreateRegex);
    
    if (match) {
      const insertPosition = match.index! + match[0].length;
      mainActivity = mainActivity.slice(0, insertPosition) + "\n        " + onCreateCall + mainActivity.slice(insertPosition);
    }
  }

  return mainActivity;
}

export default withInitializeWorkManager;
