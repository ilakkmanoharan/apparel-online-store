/**
 * Creates an admin user in Firestore (adminUsers/{uid}) so that user can sign in at /admin/login.
 *
 * Prerequisites:
 * - private/firebase-service-account.json exists (Firebase Admin key).
 * - The user already exists in Firebase Auth (sign up once on the storefront or via Console).
 *
 * Usage:
 *   node scripts/create-admin-user.js your@email.com
 *   node scripts/create-admin-user.js your@email.com super_admin
 *
 * Role defaults to "admin" if not provided (admin | super_admin | support).
 */

const path = require("path");
const fs = require("fs");

async function main() {
  const email = process.argv[2];
  const role = (process.argv[3] || "admin").toLowerCase();
  if (!email) {
    console.error("Usage: node scripts/create-admin-user.js <email> [role]");
    console.error("Example: node scripts/create-admin-user.js you@example.com admin");
    process.exit(1);
  }
  if (!["admin", "super_admin", "support"].includes(role)) {
    console.error("Role must be one of: admin, super_admin, support");
    process.exit(1);
  }

  const projectRoot = path.resolve(__dirname, "..");
  const serviceAccountPath = path.join(projectRoot, "private", "firebase-service-account.json");
  if (!fs.existsSync(serviceAccountPath)) {
    console.error("Missing private/firebase-service-account.json. Add your Firebase Admin service account key there.");
    process.exit(1);
  }

  const admin = require("firebase-admin");
  const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));

  if (admin.apps.length === 0) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }

  const auth = admin.auth();
  const db = admin.firestore();

  let uid;
  try {
    const user = await auth.getUserByEmail(email);
    uid = user.uid;
  } catch (e) {
    console.error("No Firebase Auth user found with email:", email);
    console.error("Have the user sign up once at your storefront (or create the user in Firebase Console), then run this script again.");
    process.exit(1);
  }

  await db.collection("adminUsers").doc(uid).set({
    email,
    role,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  console.log("Admin user created:");
  console.log("  UID:  ", uid);
  console.log("  Email:", email);
  console.log("  Role: ", role);
  console.log("They can now sign in at /admin/login with this email and their password.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
