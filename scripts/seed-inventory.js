#!/usr/bin/env node
"use strict";
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
require("dotenv").config({ path: ".env.local" });
initializeApp();
const db = getFirestore();
async function main() {
  const snap = await db.collection("products").limit(5).get();
  for (const d of snap.docs) await d.ref.update({ stock: 100 });
  console.log("Updated", snap.size, "products");
}
main().catch(console.error).then(() => process.exit(0));
