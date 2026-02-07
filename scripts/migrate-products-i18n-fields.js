#!/usr/bin/env node
/* eslint-disable no-console */

const fs = require("fs");
const path = require("path");

const SUPPORTED_LOCALES = ["en", "es", "fr", "de"];
const dryRun = process.argv.includes("--dry-run");
const copyDefaultToAllLocales = process.argv.includes("--copy-default-to-all-locales");

async function initAdmin() {
  const projectRoot = path.resolve(__dirname, "..");
  const serviceAccountPath = path.join(projectRoot, "private", "firebase-service-account.json");
  if (!fs.existsSync(serviceAccountPath)) {
    throw new Error("Missing private/firebase-service-account.json");
  }

  const admin = require("firebase-admin");
  const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));
  if (admin.apps.length === 0) {
    admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
  }
  return admin.firestore();
}

function buildLocalizedFieldUpdates(data, baseField) {
  const updates = {};
  const baseValue = typeof data[baseField] === "string" ? data[baseField] : "";
  if (!baseValue) {
    return updates;
  }

  const defaultKey = `${baseField}_en`;
  if (typeof data[defaultKey] !== "string" || data[defaultKey].trim().length === 0) {
    updates[defaultKey] = baseValue;
  }

  if (copyDefaultToAllLocales) {
    for (const locale of SUPPORTED_LOCALES) {
      const localeKey = `${baseField}_${locale}`;
      if (typeof data[localeKey] !== "string" || data[localeKey].trim().length === 0) {
        updates[localeKey] = baseValue;
      }
    }
  }

  return updates;
}

async function migrateCollection(db, collectionName) {
  const snapshot = await db.collection(collectionName).get();
  let changed = 0;

  for (const doc of snapshot.docs) {
    const data = doc.data();
    const updates = {
      ...buildLocalizedFieldUpdates(data, "name"),
      ...buildLocalizedFieldUpdates(data, "description"),
    };
    if (Object.keys(updates).length === 0) {
      continue;
    }

    changed += 1;
    if (dryRun) {
      console.log(`[dry-run] ${collectionName}/${doc.id}`, updates);
      continue;
    }

    await doc.ref.update(updates);
    console.log(`[updated] ${collectionName}/${doc.id}`);
  }

  return changed;
}

async function main() {
  const db = await initAdmin();
  console.log("Starting i18n field migration...");
  console.log(`Dry run: ${dryRun ? "yes" : "no"}`);
  console.log(`Copy default EN to all locales: ${copyDefaultToAllLocales ? "yes" : "no"}`);

  const productsChanged = await migrateCollection(db, "products");
  const categoriesChanged = await migrateCollection(db, "categories");

  console.log(`Products changed: ${productsChanged}`);
  console.log(`Categories changed: ${categoriesChanged}`);
  console.log("Done.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
