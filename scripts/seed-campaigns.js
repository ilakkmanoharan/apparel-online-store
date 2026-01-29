#!/usr/bin/env node
"use strict";
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
require("dotenv").config({ path: ".env.local" });
initializeApp();
const db = getFirestore();
async function main() {
  await db.collection("campaigns").add({ slug: "summer", title: "Summer Sale", active: true, startDate: new Date(), endDate: new Date(), blocks: [], createdAt: new Date(), updatedAt: new Date() });
  console.log("Seeded campaigns");
}
main().catch(console.error).then(() => process.exit(0));
