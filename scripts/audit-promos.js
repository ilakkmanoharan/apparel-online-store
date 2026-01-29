#!/usr/bin/env node
"use strict";
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
require("dotenv").config({ path: ".env.local" });
initializeApp();
const db = getFirestore();

async function main() {
  const snap = await db.collection("promos").get();
  console.log("Promos count:", snap.size);
  snap.docs.forEach((d) => {
    const data = d.data();
    console.log("-", d.id, data.code ?? data.name ?? "unnamed");
  });
}

main().catch(console.error).then(() => process.exit(0));
