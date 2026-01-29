#!/usr/bin/env node
"use strict";
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const fs = require("fs");
require("dotenv").config({ path: ".env.local" });
initializeApp();
const db = getFirestore();
async function main() {
  const snap = await db.collection("products").get();
  const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  fs.writeFileSync("firestore-backup.json", JSON.stringify(docs, null, 2));
  console.log("Backup written");
}
main().catch(console.error).then(() => process.exit(0));
