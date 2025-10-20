#!/usr/bin/env tsx
/**
 * disable-android-lint.ts
 * Disables only the problematic PrivateApiDetector lint checks that cause OOM errors
 */

import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

const BUILD_GRADLE = resolve("android", "app", "build.gradle");

const LINT_CONFIG = `
    lint {
        disable 'BlockedPrivateApi', 'DiscouragedPrivateApi', 'PrivateApi', 'SoonBlockedPrivateApi'
    }
`;

try {
  let content = readFileSync(BUILD_GRADLE, "utf-8");

  if (
    content.includes("disable 'BlockedPrivateApi'") ||
    content.includes('disable "BlockedPrivateApi"')
  ) {
    console.log("\nℹ️  PrivateApi lint checks already disabled\n");
  } else {
    // Find the android block
    const androidBlockMatch = content.match(/android\s*{/);
    if (!androidBlockMatch) {
      throw new Error("Could not find 'android {' block in build.gradle");
    }

    const insertPos = androidBlockMatch.index! + androidBlockMatch[0].length;
    content = content.slice(0, insertPos) + LINT_CONFIG + content.slice(insertPos);

    writeFileSync(BUILD_GRADLE, content, "utf-8");
    console.log("\n✅ Disabled PrivateApi lint checks (keeps other lint checks active)\n");
  }
} catch (err: any) {
  console.error("\n❌ Could not modify build.gradle:", err.message, "\n");
  process.exit(1);
}
