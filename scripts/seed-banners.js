#!/usr/bin/env node
"use strict";
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
require("dotenv").config({ path: ".env.local" });
initializeApp();
const db = getFirestore();
const COLLECTION = "banners";

async function main() {
  const banners = [
    { title: "Welcome", imageUrl: "/placeholder.jpg", position: "top", order: 0, active: true },
  ];
  for (const b of banners) {
    await db.collection(COLLECTION).add(b);
  }
  console.log("Seeded", banners.length, "banners");
}

main().catch(console.error).then(() => process.exit(0));
