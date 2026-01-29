#!/usr/bin/env node
/**
 * One-way sync: issues/ → private/issues/
 *
 * Copies everything from issues/ to private/issues/. Changes in issues/ (add, edit, delete)
 * are reflected in private/issues/. Changes in private/issues/ are NOT synced back to issues/.
 *
 * Usage:
 *   node scripts/sync-issues-to-private.js        # run once
 *   node scripts/sync-issues-to-private.js --watch # watch issues/ and sync on change
 */

const fs = require("fs");
const path = require("path");

const PROJECT_ROOT = path.resolve(__dirname, "..");
const SOURCE = path.join(PROJECT_ROOT, "issues");
const DEST = path.join(PROJECT_ROOT, "private", "issues");

function syncDir(srcDir, destDir) {
  if (!fs.existsSync(srcDir)) {
    if (fs.existsSync(destDir)) {
      fs.rmSync(destDir, { recursive: true });
      console.log("[sync] Removed", path.relative(PROJECT_ROOT, destDir));
    }
    return;
  }

  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  const srcEntries = fs.readdirSync(srcDir, { withFileTypes: true });
  const destEntries = fs.readdirSync(destDir, { withFileTypes: true }).map((e) => e.name);
  const srcNames = new Set(srcEntries.map((e) => e.name));

  for (const name of destEntries) {
    if (!srcNames.has(name)) {
      const destPath = path.join(destDir, name);
      fs.rmSync(destPath, { recursive: true });
      console.log("[sync] Removed", path.relative(PROJECT_ROOT, destPath));
    }
  }

  for (const ent of srcEntries) {
    const srcPath = path.join(srcDir, ent.name);
    const destPath = path.join(destDir, ent.name);

    if (ent.isDirectory()) {
      syncDir(srcPath, destPath);
    } else {
      const content = fs.readFileSync(srcPath);
      if (!fs.existsSync(destPath) || !content.equals(fs.readFileSync(destPath))) {
        fs.writeFileSync(destPath, content);
        console.log("[sync] Copied", path.relative(PROJECT_ROOT, srcPath), "→", path.relative(PROJECT_ROOT, destPath));
      }
    }
  }
}

function run() {
  if (!fs.existsSync(SOURCE)) {
    console.log("[sync] No issues/ folder; nothing to sync.");
    return;
  }
  syncDir(SOURCE, DEST);
  console.log("[sync] Done.");
}

function watch() {
  if (!fs.existsSync(SOURCE)) {
    console.log("[sync] No issues/ folder; exiting.");
    process.exit(0);
  }

  let timeout;
  const debounceMs = 300;

  function scheduleSync() {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      run();
    }, debounceMs);
  }

  try {
    const watcher = fs.watch(SOURCE, { recursive: true }, () => scheduleSync());
    console.log("[sync] Watching issues/ (one-way → private/issues). Ctrl+C to stop.");
  } catch (e) {
    console.warn("[sync] Recursive watch not supported, watching top-level only:", e.message);
    fs.watch(SOURCE, () => scheduleSync());
  }
  run();
}

const isWatch = process.argv.includes("--watch");
if (isWatch) {
  watch();
} else {
  run();
}
