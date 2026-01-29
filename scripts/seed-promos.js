/**
 * Seed sample promos into Firestore (promos collection for admin).
 * Run: node scripts/seed-promos.js
 */

const path = require("path");
const fs = require("fs");

async function main() {
  const projectRoot = path.resolve(__dirname, "..");
  const serviceAccountPath = path.join(projectRoot, "private", "firebase-service-account.json");
  if (!fs.existsSync(serviceAccountPath)) {
    console.error("Missing private/firebase-service-account.json");
    process.exit(1);
  }

  const admin = require("firebase-admin");
  const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));

  if (admin.apps.length === 0) {
    admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
  }

  const db = admin.firestore();
  const now = admin.firestore.Timestamp.now();

  const promos = [
    { code: "SAVE10", discountPercent: 10, minOrder: null, active: true, createdAt: now, updatedAt: now },
    { code: "SAVE20", discountPercent: 20, minOrder: 50, active: true, createdAt: now, updatedAt: now },
    { code: "WELCOME", discountPercent: 15, minOrder: null, active: true, createdAt: now, updatedAt: now },
  ];

  const batch = db.batch();
  promos.forEach((p) => {
    const ref = db.collection("promos").doc();
    batch.set(ref, p);
  });
  await batch.commit();
  console.log("Seeded", promos.length, "promos.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
