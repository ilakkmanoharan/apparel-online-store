#!/usr/bin/env node
"use strict";
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
require("dotenv").config({ path: ".env.local" });
initializeApp();
const db = getFirestore();
async function main() {
  const cols = await db.listCollections();
  console.log("Collections:", cols.map((c) => c.id).join(", "));
}
main().catch(console.error).then(() => process.exit(0));
