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
  const categories = [
    { name: "Men", slug: "men", createdAt: now, updatedAt: now },
    { name: "Women", slug: "women", createdAt: now, updatedAt: now },
    { name: "Kids", slug: "kids", createdAt: now, updatedAt: now },
  ];
  const batch = db.batch();
  categories.forEach((c) => {
    batch.set(db.collection("categories").doc(), c);
  });
  await batch.commit();
  console.log("Seeded", categories.length, "categories.");
}

main().catch((e) => { console.error(e); process.exit(1); });
