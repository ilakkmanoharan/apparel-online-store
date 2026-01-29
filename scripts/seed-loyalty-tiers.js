/**
 * Seed loyalty tier config into Firestore (optional; app uses lib/loyalty/constants for spend tiers).
 * Run: node scripts/seed-loyalty-tiers.js
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

  const configRef = db.collection("loyaltyConfig").doc("spendTiers");
  await configRef.set({
    tiers: [
      { id: "bronze", minSpend: 0, freeShipping: false },
      { id: "silver", minSpend: 500, freeShipping: false },
      { id: "gold", minSpend: 2000, freeShipping: true },
      { id: "platinum", minSpend: 5000, freeShipping: true },
    ],
    updatedAt: now,
  });
  console.log("Seeded loyalty spend tiers config.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
