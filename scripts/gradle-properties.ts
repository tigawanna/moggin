#!/usr/bin/env tsx
/**
 * fix-gradle-memory.ts
 * Runs from repo root. Increases Gradle memory settings to fix Metaspace OOM errors.
 * Exits 0 on success, 1 on error.
 */

import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

const GRADLE_PROP = resolve("android", "gradle.properties");
const xmxSize = "4g";
const metaspaceSize = "2g";

try {
  let content = readFileSync(GRADLE_PROP, "utf-8");

  // Match existing jvmargs line
  const jvmArgsPattern = /^org\.gradle\.jvmargs=.*$/m;
  const newJvmArgs = `org.gradle.jvmargs=-Xmx${xmxSize} -XX:MaxMetaspaceSize=${metaspaceSize}`;

  if (jvmArgsPattern.test(content)) {
    // Replace existing line
    content = content.replace(jvmArgsPattern, newJvmArgs);
    writeFileSync(GRADLE_PROP, content, "utf-8");
    console.log(`\n✅ Updated Gradle memory: Heap=${xmxSize}, Metaspace=${metaspaceSize}\n`);
  } else {
    // Append new line
    const nl = content.endsWith("\n") ? "" : "\n";
    writeFileSync(GRADLE_PROP, `${content}${nl}${newJvmArgs}\n`, "utf-8");
    console.log(`\n✅ Added Gradle memory settings: Heap=${xmxSize}, Metaspace=${metaspaceSize}\n`);
  }
} catch (err: any) {
  console.error("\n❌ Could not patch gradle.properties:", err.message, "\n");
  process.exit(1);
}
