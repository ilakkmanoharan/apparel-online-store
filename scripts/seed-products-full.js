#!/usr/bin/env node
"use strict";
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
require("dotenv").config({ path: ".env.local" });
initializeApp();
const db = getFirestore();

async function main() {
  const categories = await db.collection("categories").limit(3).get();
  const catIds = categories.docs.map((d) => d.id);
  for (let i = 0; i < 20; i++) {
    await db.collection("products").add({
      name: "Product Full " + i,
      slug: "product-full-" + i,
      categoryId: catIds[i % catIds.length],
      price: 29.99 + i,
      stock: 50,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
  console.log("Added 20 products");
}

main().catch(console.error).then(() => process.exit(0));
