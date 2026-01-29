/**
 * Seed fashion products: upload private/pictures/{women,men,kids}-fashion to
 * Firebase Storage, optionally use OpenAI Vision to generate name/description/price,
 * then populate Firestore "products" collection so the app PLP/PDP show the data.
 *
 * 1. Deletes existing files in Storage under products/, women-fashion/, men-fashion/, kids-fashion/
 * 2. Uploads private/pictures/women-fashion, men-fashion, kids-fashion to Storage (products/*)
 * 3. For each image: if OPENAI_API_KEY is set, calls OpenAI Vision to generate name, description, price
 * 4. Writes each product to Firestore "products" with images, category, and required fields
 *
 * Run: node scripts/seed-fashion-products.js
 *   (or: npm run seed:fashion-products)
 * Optional: OPENAI_API_KEY in .env or .env.local for AI-generated content
 * Optional: CLEAR_PRODUCTS=false to keep existing products (default: clear then seed)
 *
 * Deploy Firestore indexes so category/sort queries work:
 *   npx firebase deploy --only firestore:indexes
 */

/* eslint-disable no-console */

const fs = require("fs");
const path = require("path");

// Load env (optional)
try {
  require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
  require("dotenv").config({ path: path.join(__dirname, "..", ".env.local") });
} catch {
  // dotenv not required
}

const PROJECT_ROOT = path.resolve(__dirname, "..");
const PICTURES = path.join(PROJECT_ROOT, "private", "pictures");
const BUCKET_NAME = "apparel-online-store.firebasestorage.app";

const FOLDERS = [
  { dir: "women-fashion", category: "women" },
  { dir: "men-fashion", category: "men" },
  { dir: "kids-fashion", category: "kids" },
];

async function deleteStoragePrefix(bucket, prefix) {
  const [files] = await bucket.getFiles({ prefix });
  if (files.length === 0) return 0;
  await Promise.all(files.map((f) => f.delete()));
  return files.length;
}

function getPublicUrl(bucket, storagePath) {
  const encoded = encodeURIComponent(storagePath);
  return `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encoded}?alt=media`;
}

/**
 * Call OpenAI Vision API to get product name, description, and price from image URL.
 * Returns { name, description, price } or null on failure.
 */
async function generateProductWithAI(imageUrl) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      max_tokens: 300,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text:
                "Look at this fashion product image. Reply with exactly 3 lines. " +
                "Line 1: Short product name (e.g. 'Floral Summer Dress'). " +
                "Line 2: One sentence product description for an online store. " +
                "Line 3: Suggested retail price in USD, number only (e.g. 49.99).",
            },
            {
              type: "image_url",
              image_url: { url: imageUrl },
            },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    console.warn("[OpenAI] Request failed:", response.status, err);
    return null;
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content?.trim();
  if (!text) return null;

  const lines = text.split("\n").map((s) => s.trim()).filter(Boolean);
  const name = lines[0] || "Fashion Item";
  const description = lines[1] || "Stylish apparel.";
  let price = 29.99;
  if (lines[2]) {
    const num = parseFloat(lines[2].replace(/[^0-9.]/g, ""));
    if (!Number.isNaN(num) && num > 0) price = Math.min(500, Math.max(5, num));
  }

  return { name, description, price };
}

function fallbackProduct(category, index, fileName) {
  const names = {
    women: ["Summer Dress", "Elegant Blouse", "Casual Top", "Slim Trousers", "Skirt", "Jacket", "Blazer", "Jumpsuit"],
    men: ["Classic Shirt", "Chinos", "Polo Shirt", "Sweater", "Jacket", "Trousers", "Hoodie"],
    kids: ["Kids Tee", "Kids Dress", "Kids Shorts", "Kids Jacket", "Kids Sweater", "Kids Pants"],
  };
  const list = names[category] || names.women;
  const name = list[index % list.length] + " " + (index + 1);
  const description = `Stylish ${category} fashion item. Quality materials, comfortable fit.`;
  const price = 19.99 + (index % 15) * 3.5;
  return { name, description, price: Math.round(price * 100) / 100 };
}

async function main() {
  const serviceAccountPath = path.join(PROJECT_ROOT, "private", "firebase-service-account.json");
  if (!fs.existsSync(serviceAccountPath)) {
    console.error("Missing private/firebase-service-account.json");
    process.exit(1);
  }

  const admin = require("firebase-admin");
  const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));

  if (admin.apps.length === 0) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: BUCKET_NAME,
    });
  }

  const db = admin.firestore();
  const bucket = admin.storage().bucket();

  // ---- 0. Optional: clear existing products in Firestore (avoid duplicates on re-run) ----
  const clearProducts = process.env.CLEAR_PRODUCTS !== "false";
  if (clearProducts) {
    console.log("Clearing existing products in Firestore...");
    const snap = await db.collection("products").get();
    const batch = db.batch();
    snap.docs.forEach((d) => batch.delete(d.ref));
    if (snap.size > 0) {
      await batch.commit();
      console.log("  Deleted", snap.size, "product(s).");
    } else {
      console.log("  No existing products.");
    }
  }

  // ---- 1. Delete existing files in Storage ----
  console.log("Cleaning Firebase Storage...");
  const prefixes = ["products/", "women-fashion/", "men-fashion/", "kids-fashion/"];
  let deleted = 0;
  for (const prefix of prefixes) {
    const n = await deleteStoragePrefix(bucket, prefix);
    if (n > 0) {
      console.log("  Deleted", n, "files under", prefix);
      deleted += n;
    }
  }
  if (deleted === 0) console.log("  No existing files to delete.");

  // ---- 2. Upload images and build product list ----
  const useAI = !!process.env.OPENAI_API_KEY;
  if (useAI) console.log("Using OpenAI for product name/description/price.");
  else console.log("Using fallback names (set OPENAI_API_KEY for AI-generated content).");

  const now = admin.firestore.Timestamp.now();
  const defaultSizes = ["XS", "S", "M", "L", "XL"];
  const defaultColors = ["Black", "White", "Navy", "Gray"];

  for (const { dir, category } of FOLDERS) {
    const dirPath = path.join(PICTURES, dir);
    if (!fs.existsSync(dirPath)) {
      console.warn("Skipping missing folder:", dirPath);
      continue;
    }

    const files = fs
      .readdirSync(dirPath)
      .filter((f) => /\.(png|jpe?g|webp|gif)$/i.test(f))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

    console.log("\nUploading", dir, "(" + files.length + " images)...");

    for (let i = 0; i < files.length; i++) {
      const fileName = files[i];
      const localPath = path.join(dirPath, fileName);
      const storagePath = `products/${dir}/${fileName}`;

      await bucket.upload(localPath, {
        destination: storagePath,
        metadata: { cacheControl: "public,max-age=31536000" },
      });

      const imageUrl = getPublicUrl(bucket, storagePath);
      let name, description, price;

      if (useAI) {
        const ai = await generateProductWithAI(imageUrl);
        if (ai) {
          name = ai.name;
          description = ai.description;
          price = ai.price;
        } else {
          const fallback = fallbackProduct(category, i, fileName);
          name = fallback.name;
          description = fallback.description;
          price = fallback.price;
        }
      } else {
        const fallback = fallbackProduct(category, i, fileName);
        name = fallback.name;
        description = fallback.description;
        price = fallback.price;
      }

      const product = {
        name,
        description,
        price: Number(price),
        images: [imageUrl],
        category,
        sizes: defaultSizes,
        colors: defaultColors,
        inStock: true,
        stockCount: 50,
        featured: i < 3,
        createdAt: now,
        updatedAt: now,
      };

      await db.collection("products").add(product);
      console.log("  ", fileName, "->", name, "$" + price);
    }
  }

  console.log("\nDone. Products are in Firestore 'products' and images in Storage under products/.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
