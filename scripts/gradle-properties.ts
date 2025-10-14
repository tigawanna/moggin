#!/usr/bin/env tsx
/**
 * fix-gradle-memory.ts
 * Runs from repo root.  If android/gradle.properties contains the default
 * -XX:MaxMetaspaceSize=512m line, it bumps it to 1g (and heap to 4g).
 * Exits 0 on success, 1 on error.
 */

import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

const GRADLE_PROP = resolve("android", "gradle.properties");

try {
  let content = readFileSync(GRADLE_PROP, "utf-8");

  const ORIGINAL = /^(org\.gradle\.jvmargs=.*-XX:MaxMetaspaceSize=)512m(.*)$/gm;
  const REPLACEMENT = "$11g$2"; // 512m -> 3g
  const NEW_ARGS = "org.gradle.jvmargs=-Xmx4g -XX:MaxMetaspaceSize=1g";

  if (ORIGINAL.test(content)) {
    // replace in-place
    content = content.replace(ORIGINAL, REPLACEMENT);
    writeFileSync(GRADLE_PROP, content, "utf-8");
    console.log("✅  Bumped Metaspace to 1g in android/gradle.properties");
  } else if (!content.includes("-XX:MaxMetaspaceSize=1g")) {
    // no recognised line at all – append our own
    const nl = content.endsWith("\n") ? "" : "\n";
    writeFileSync(GRADLE_PROP, `${content}${nl}${NEW_ARGS}\n`, "utf-8");
    console.log("✅  Added memory settings to android/gradle.properties");
  } else {
    console.log("ℹ️   Metaspace already 1g – nothing to do.");
  }
} catch (err: any) {
  console.error("❌  Could not patch gradle.properties:", err.message);
  process.exit(1);
}
