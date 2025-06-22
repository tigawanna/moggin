import { WidgetClassSync } from "@/modules/expo-glance-widget/plugins/utils/widgetClassSync";
import fs from "fs";
import path from "path";

function listFiles(directory: string) {
  try {
    const resolvedPath = WidgetClassSync.resolveWidgetPath(
      ".",
      "C:\\Users\\user\\AndroidStudioProjects\\Bidii-kotlin-widget\\app\\src\\main\\java\\com\\tigawanna\\bidii"
    );
    const resolvedPath = WidgetClassSync.resolveWidgetPath(
      "C:\\Users\\user\\Desktop\\code\\expo\\moggin",
      "C:\\Users\\user\\AndroidStudioProjects\\Bidii-kotlin-widget\\app\\src\\main\\java\\com\\tigawanna\\bidii"
    );
    console.log("Resolved Path:", resolvedPath);
    return resolvedPath;
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
