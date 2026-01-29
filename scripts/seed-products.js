/**
 * Seed sample products into Firestore. Run: node scripts/seed-products.js
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
  const products = [
    { name: "Classic Tee", description: "Cotton tee", price: 29.99, category: "men", inStock: true, stockCount: 100, images: [], sizes: ["S", "M", "L"], colors: ["Black", "White"], createdAt: now, updatedAt: now },
    { name: "Summer Dress", description: "Light dress", price: 59.99, category: "women", inStock: true, stockCount: 50, images: [], sizes: ["XS", "S", "M", "L"], colors: ["Blue", "Pink"], createdAt: now, updatedAt: now },
  ];
  const batch = db.batch();
  products.forEach((p) => {
    const ref = db.collection("products").doc();
    batch.set(ref, p);
  });
  await batch.commit();
  console.log("Seeded", products.length, "products.");
}

main().catch((err) => { console.error(err); process.exit(1); });
