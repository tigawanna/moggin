import { WidgetClassSync } from "@/modules/expo-glance-widget/plugins/utils/widgetClassSync";

function listFiles(directory: string) {
  try {
    console.log("=== Testing with '.' as projectRoot ===");
    const resolvedPath1 = WidgetClassSync.resolveWidgetPath(
      ".",
      "C:\\Users\\user\\AndroidStudioProjects\\Bidii-kotlin-widget\\app\\src\\main\\java\\com\\tigawanna\\bidii"
    );
    console.log("Resolved Path 1:", resolvedPath1);
    
    console.log("\n=== Testing with full projectRoot path ===");
    const resolvedPath2 = WidgetClassSync.resolveWidgetPath(
      "C:\\Users\\user\\Desktop\\code\\expo\\moggin",
      "C:\\Users\\user\\AndroidStudioProjects\\Bidii-kotlin-widget\\app\\src\\main\\java\\com\\tigawanna\\bidii"
    );
    console.log("Resolved Path 2:", resolvedPath2);
    
    console.log("\n=== Testing with relative path ===");
    const resolvedPath3 = WidgetClassSync.resolveWidgetPath(
      "C:\\Users\\user\\Desktop\\code\\expo\\moggin",
      "widgets/android/MyWidget.kt"
    );
    console.log("Resolved Path 3:", resolvedPath3);
    
    return { resolvedPath1, resolvedPath2, resolvedPath3 };
  } catch (error) {
    console.error(`Error reading directory ${directory}:`, error);
    return [];
  }
}

console.log(
  " ===== files in dir  ============= ",
  listFiles(
    "C:\\Users\\user\\AndroidStudioProjects\\Bidii-kotlin-widget\\app\\src\\main\\java\\com\\tigawanna\\bidii"
  )
);
