#!/usr/bin/env tsx
/**
 * enable-gradle-caching.ts
 * Enables Gradle build caching by setting org.gradle.caching=true in gradle.properties.
 * Exits 0 on success (whether changed or not), 1 on error.
 */

import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

const GRADLE_PROP = resolve("android", "gradle.properties");
const CACHING_LINE = "org.gradle.caching=true";

try {
  let content = readFileSync(GRADLE_PROP, "utf-8");

  // Check if the exact setting already exists (ignoring comments or other values)
  const cachingPattern = /^org\.gradle\.caching\s*=\s*(true|false)$/m;
  if (cachingPattern.test(content)) {
    // Already present — ensure it's `true`
    const currentLine = content.match(cachingPattern)?.[0] ?? "";
    if (currentLine.includes("=true")) {
      console.log("✅ Gradle caching is already enabled.");
      process.exit(0);
    } else {
      // Replace false with true
      content = content.replace(cachingPattern, CACHING_LINE);
      console.log("✅ Updated: enabled Gradle caching.");
    }
  } else {
    // Not present — add it
    const lines = content.split("\n");

    // Try to insert after existing org.gradle.* lines for cleanliness
    let insertIndex = lines.findIndex((line) => line.startsWith("org.gradle."));
    if (insertIndex !== -1) {
      // Find the last consecutive org.gradle line
      while (insertIndex + 1 < lines.length && lines[insertIndex + 1].startsWith("org.gradle.")) {
        insertIndex++;
      }
      insertIndex++; // insert after the block
    } else {
      // Otherwise, just append at the end
      insertIndex = lines.length;
    }

    lines.splice(insertIndex, 0, CACHING_LINE);
    content = lines.join("\n");
    console.log("✅ Added: enabled Gradle caching.");
  }

  writeFileSync(GRADLE_PROP, content, "utf-8");
  console.log("✔️ gradle.properties updated successfully.");
} catch (err: any) {
  console.error("\n❌ Failed to enable Gradle caching:", err.message);
  process.exit(1);
}
