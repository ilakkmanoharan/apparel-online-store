/**
 * Upload local women fashion images from:
 *   private/pictures/women-fashion
 * into Firebase Storage, and create matching Firestore docs.
 *
 * This script uses the Firebase Admin SDK and should be run from Node:
 *
 *   npm run seed:women-fashion
 *
 * Requirements:
 * - Create a service account key in Firebase Console:
 *   - Settings (⚙) → Service accounts → Generate new private key
 *   - Save JSON as: private/firebase-service-account.json
 * - Ensure Firestore and Storage are enabled for the project.
 */

/* eslint-disable no-console */

const fs = require("fs");
const path = require("path");
const admin = require("firebase-admin");

async function main() {
  const projectRoot = path.join(__dirname, "..");
  const serviceAccountPath = path.join(
    projectRoot,
    "private",
    "firebase-service-account.json"
  );

  if (!fs.existsSync(serviceAccountPath)) {
    console.error(
      "\n[seed:women-fashion] Missing service account JSON.\n" +
        "Create it in Firebase Console and save as:\n" +
        "  private/firebase-service-account.json\n"
    );
    process.exit(1);
  }

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const serviceAccount = require(serviceAccountPath);

  if (admin.apps.length === 0) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      // Use the same bucket as in firebase config
      storageBucket: "apparel-online-store.firebasestorage.app",
    });
  }

  const bucket = admin.storage().bucket();
  const db = admin.firestore();

  const imagesDir = path.join(
    projectRoot,
    "private",
    "pictures",
    "women-fashion"
  );

  if (!fs.existsSync(imagesDir)) {
    console.error(
      `\n[seed:women-fashion] Images directory not found:\n  ${imagesDir}\n`
    );
    process.exit(1);
  }

  const files = fs
    .readdirSync(imagesDir)
    .filter((file) => /\.(png|jpe?g|webp|gif)$/i.test(file))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  if (files.length === 0) {
    console.error(
      `\n[seed:women-fashion] No image files found in:\n  ${imagesDir}\n`
    );
    process.exit(1);
  }

  console.log(
    `[seed:women-fashion] Found ${files.length} images. Uploading to Storage and creating Firestore docs...`
  );

  const galleryCollection = db
    .collection("categories")
    .doc("women")
    .collection("gallery");

  let index = 0;
  for (const fileName of files) {
    index += 1;
    const localPath = path.join(imagesDir, fileName);
    const storagePath = `women-fashion/${fileName}`;

    console.log(`  → Uploading ${fileName} → ${storagePath}`);

    await bucket.upload(localPath, {
      destination: storagePath,
      metadata: {
        cacheControl: "public,max-age=31536000",
      },
    });

    const encodedPath = encodeURIComponent(storagePath);
    const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodedPath}?alt=media`;

    const docId = path.parse(fileName).name;
    const docRef = galleryCollection.doc(docId);

    await docRef.set(
      {
        imageUrl,
        storagePath,
        category: "women",
        label: `Women fashion look ${index}`,
        order: index,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
  }

  console.log(
    `\n[seed:women-fashion] Done. Uploaded ${files.length} images and updated Firestore.\n`
  );
}

main().catch((err) => {
  console.error("[seed:women-fashion] Error:", err);
  process.exit(1);
});

