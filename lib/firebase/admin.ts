import * as admin from "firebase-admin";
import path from "path";
import fs from "fs";

let adminDb: admin.firestore.Firestore | null = null;

/**
 * Returns Firestore instance from Firebase Admin SDK, or null if the
 * service account file is missing (e.g. in CI or when not configured).
 * Used by API routes that need to read/write Firestore without client rules.
 */
export async function getAdminDb(): Promise<admin.firestore.Firestore | null> {
  if (adminDb) return adminDb;

  const projectRoot = process.cwd();
  const serviceAccountPath = path.join(
    projectRoot,
    "private",
    "firebase-service-account.json"
  );

  if (!fs.existsSync(serviceAccountPath)) {
    return null;
  }

  const serviceAccount = JSON.parse(
    fs.readFileSync(serviceAccountPath, "utf8")
  ) as admin.ServiceAccount;

  if (admin.apps.length === 0) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: "apparel-online-store.firebasestorage.app",
    });
  }

  adminDb = admin.firestore();
  return adminDb;
}

let adminAuth: admin.auth.Auth | null = null;

function initAdminAuth(): admin.auth.Auth | null {
  if (adminAuth) return adminAuth;
  if (admin.apps.length === 0) return null;
  adminAuth = admin.auth();
  return adminAuth;
}

/**
 * Returns Firebase Admin Auth instance for server-side token verification.
 * Call getAdminDb() first to ensure Admin is initialized.
 */
export function getAdminAuth(): admin.auth.Auth | null {
  return initAdminAuth();
}

/**
 * Initialize Admin and return both db and auth. Use in API routes that need auth.
 */
export async function getFirebaseAdmin(): Promise<{
  db: admin.firestore.Firestore;
  auth: admin.auth.Auth;
} | null> {
  const db = await getAdminDb();
  if (!db) return null;
  const auth = initAdminAuth();
  if (!auth) return null;
  return { db, auth };
}
