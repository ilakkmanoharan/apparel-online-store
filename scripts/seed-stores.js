/**
 * Seed sample store locations into Firestore. Run: node scripts/seed-stores.js
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
  if (admin.apps.length === 0) admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
  const db = admin.firestore();
  const now = admin.firestore.Timestamp.now();
  const stores = [
    { name: "Downtown Store", address: "123 Main St", city: "New York", state: "NY", zipCode: "10001", country: "USA", active: true, hours: [], services: ["pickup", "returns"], createdAt: now, updatedAt: now },
    { name: "Mall Location", address: "456 Mall Dr", city: "Los Angeles", state: "CA", zipCode: "90001", country: "USA", active: true, hours: [], services: ["pickup"], createdAt: now, updatedAt: now },
  ];
  const batch = db.batch();
  stores.forEach((s) => {
    const ref = db.collection("stores").doc();
    batch.set(ref, s);
  });
  await batch.commit();
  console.log("Seeded", stores.length, "stores.");
}

main().catch((err) => { console.error(err); process.exit(1); });
