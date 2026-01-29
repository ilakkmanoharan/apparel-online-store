#!/usr/bin/env node
"use strict";
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
require("dotenv").config({ path: ".env.local" });
initializeApp();
const db = getFirestore();
const COLLECTION = "productQA";

async function main() {
  console.log("Seed product Q&A: add productId to a product, then run add() with question/answer");
  const snapshot = await db.collection(COLLECTION).limit(1).get();
  console.log("productQA collection exists, doc count:", snapshot.size);
}

main().catch(console.error).then(() => process.exit(0));
