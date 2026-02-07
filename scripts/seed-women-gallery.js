#!/usr/bin/env node
"use strict";

/**
 * Seed the women fashion gallery with publicly accessible images.
 * This creates Firestore documents under categories/women/gallery
 * with direct image URLs that can be loaded without Firebase Storage.
 *
 * Run with: node scripts/seed-women-gallery.js
 */

const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
require("dotenv").config({ path: ".env.local" });

initializeApp();
const db = getFirestore();

async function main() {
  console.log("[seed-women-gallery] Starting gallery seed...");

  // Using Unsplash free images with specific fashion-related photos
  // These URLs are publicly accessible and work without authentication
  const galleryImages = [
    {
      imageUrl: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&q=80",
      label: "Women fashion look 1",
      order: 1,
    },
    {
      imageUrl: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=800&q=80",
      label: "Women fashion look 2",
      order: 2,
    },
    {
      imageUrl: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80",
      label: "Women fashion look 3",
      order: 3,
    },
    {
      imageUrl: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80",
      label: "Women fashion look 4",
      order: 4,
    },
    {
      imageUrl: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80",
      label: "Women fashion look 5",
      order: 5,
    },
    {
      imageUrl: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800&q=80",
      label: "Women fashion look 6",
      order: 6,
    },
    {
      imageUrl: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=800&q=80",
      label: "Women fashion look 7",
      order: 7,
    },
    {
      imageUrl: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80",
      label: "Women fashion look 8",
      order: 8,
    },
  ];

  const galleryRef = db.collection("categories").doc("women").collection("gallery");

  // Clear existing gallery items first
  const existing = await galleryRef.get();
  console.log(`[seed-women-gallery] Found ${existing.size} existing items, clearing...`);

  const batch = db.batch();
  existing.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });
  await batch.commit();

  // Add new gallery items
  console.log(`[seed-women-gallery] Adding ${galleryImages.length} new gallery items...`);

  for (const image of galleryImages) {
    const docRef = galleryRef.doc(`look-${image.order}`);
    await docRef.set({
      id: `look-${image.order}`,
      imageUrl: image.imageUrl,
      storagePath: "", // Not using Firebase Storage for these images
      category: "women",
      label: image.label,
      order: image.order,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log(`  ✓ Added: ${image.label}`);
  }

  console.log(`\n[seed-women-gallery] ✓ Successfully seeded ${galleryImages.length} gallery images!\n`);
  console.log("The Women's Fashion Gallery should now display images at:");
  console.log("  http://localhost:3000/en/category/women\n");
}

main()
  .catch((err) => {
    console.error("[seed-women-gallery] Error:", err);
    process.exit(1);
  })
  .then(() => process.exit(0));
