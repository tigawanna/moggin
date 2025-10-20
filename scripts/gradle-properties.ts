#!/usr/bin/env tsx
/**
 * fix-gradle-memory.ts
 * Runs from repo root. Increases Gradle memory settings to fix Metaspace OOM errors.
 * Exits 0 on success, 1 on error.
 */

import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

const GRADLE_PROP = resolve("android", "gradle.properties");

// Memory settings
const xmxSize = "4g";
const metaspaceSize = "1g";

// Performance settings to add
const performanceSettings = [
  "org.gradle.parallel=true",
  "org.gradle.daemon=true",
  "org.gradle.caching=true",
];

try {
  let content = readFileSync(GRADLE_PROP, "utf-8");
  let changesMade = false;

  // Update memory settings
  const jvmArgsPattern =
    /^org\.gradle\.jvmargs=-Xmx\d+[kmg] -XX:MaxMetaspaceSize=\d+[kmg]m?$/m;
  const newJvmArgs = `org.gradle.jvmargs=-Xmx${xmxSize} -XX:MaxMetaspaceSize=${metaspaceSize}`;

  if (jvmArgsPattern.test(content)) {
    content = content.replace(jvmArgsPattern, newJvmArgs);
    changesMade = true;
    console.log(
      `\n✅ Updated Gradle memory: Heap=${xmxSize}, Metaspace=${metaspaceSize}`,
    );
  } else {
    const flexiblePattern = /^org\.gradle\.jvmargs=.*$/m;
    if (flexiblePattern.test(content)) {
      content = content.replace(flexiblePattern, newJvmArgs);
      changesMade = true;
      console.log(
        `\n✅ Updated Gradle memory: Heap=${xmxSize}, Metaspace=${metaspaceSize}`,
      );
    } else {
      const lines = content.split("\n");
      let insertIndex = lines.findIndex(
        (line) => line.startsWith("#") && line.includes("org.gradle.jvmargs"),
      );

      if (insertIndex === -1) {
        insertIndex = lines.findIndex((line) => line.startsWith("org.gradle."));
        if (insertIndex === -1) insertIndex = lines.length;
      } else {
        insertIndex++;
      }

      lines.splice(insertIndex, 0, newJvmArgs);
      content = lines.join("\n");
      changesMade = true;
      console.log(
        `\n✅ Added Gradle memory settings: Heap=${xmxSize}, Metaspace=${metaspaceSize}`,
      );
    }
  }

  // Add performance settings if they don't exist
  performanceSettings.forEach((setting) => {
    const key = setting.split("=")[0];
    const pattern = new RegExp(`^${key}=.*$`, "m");

    if (!pattern.test(content)) {
      // Find a good place to insert - after other org.gradle settings
      const lines = content.split("\n");
      let insertIndex = lines.findIndex((line) =>
        line.startsWith("org.gradle."),
      );

      if (insertIndex === -1) {
        // If no org.gradle settings, insert after memory settings
        insertIndex = lines.findIndex((line) =>
          line.startsWith("org.gradle.jvmargs"),
        );
      }

      if (insertIndex !== -1) {
        // Insert after the last org.gradle setting
        while (
          insertIndex + 1 < lines.length &&
          lines[insertIndex + 1].startsWith("org.gradle.")
        ) {
          insertIndex++;
        }
        insertIndex++;
      } else {
        insertIndex = lines.length;
      }

      lines.splice(insertIndex, 0, setting);
      content = lines.join("\n");
      changesMade = true;
      console.log(`✅ Added performance setting: ${setting}`);
    } else {
      console.log(`ℹ️  Setting already exists: ${setting}`);
    }
  });

  if (changesMade) {
    writeFileSync(GRADLE_PROP, content, "utf-8");

    // Display the final result
    const updatedContent = readFileSync(GRADLE_PROP, "utf-8");
    console.log("\n📋 Updated gradle.properties:");
    console.log("────────────────────────────────────");

    const relevantLines = updatedContent
      .split("\n")
      .filter(
        (line) =>
          line.includes("org.gradle.jvmargs") ||
          line.includes("org.gradle.parallel") ||
          line.includes("org.gradle.daemon") ||
          line.includes("org.gradle.caching"),
      );

    relevantLines.forEach((line) => console.log(line));
    console.log("────────────────────────────────────\n");
  } else {
    console.log(
      "\nℹ️  No changes needed - all settings are already configured.\n",
    );
  }
} catch (err: any) {
  console.error("\n❌ Could not patch gradle.properties:", err.message, "\n");
  process.exit(1);
}
