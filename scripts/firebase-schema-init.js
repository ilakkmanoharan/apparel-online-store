/**
 * Initialize Firestore collections with empty or schema docs.
 * Run: node scripts/firebase-schema-init.js
 * Requires: private/firebase-service-account.json
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

  const collections = [
    "products",
    "orders",
    "users",
    "adminUsers",
    "addresses",
    "returns",
    "campaigns",
    "banners",
    "promos",
    "productReviews",
    "userCoupons",
    "userPreferences",
    "userSpend",
    "loyaltyBalances",
    "loyaltyTransactions",
    "giftCards",
    "stores",
    "bopisReservations",
  ];

  console.log("Firestore collections (ensure these exist when you first write):");
  collections.forEach((c) => console.log("  -", c));
  console.log("Firestore creates collections on first write. No schema init required.");
  console.log("To seed data, run: npm run seed:products, seed:categories, etc.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
