#!/usr/bin/env node
"use strict";
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const fs = require("fs");
require("dotenv").config({ path: ".env.local" });
initializeApp();
const db = getFirestore();
async function main() {
  const snap = await db.collection("orders").get();
  const rows = snap.docs.map((d) => d.id + "," + (d.data().userId ?? ""));
  fs.writeFileSync("orders-export.csv", "id,userId\n" + rows.join("\n"));
  console.log("Exported", snap.size, "orders");
}
main().catch(console.error).then(() => process.exit(0));
