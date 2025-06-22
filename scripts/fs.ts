import fs from 'fs';
import path from 'path';
function listFiles(directory: string): string[] {

  try {
    return fs.readdirSync(directory).map(file => path.join(directory, file));
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

