import { NextResponse } from "next/server";
import {
  SHOWCASE_DETAILS_BY_ID,
  SHOWCASE_DETAILS_BY_ORDER,
  WOMEN_GALLERY_SHOWCASE,
} from "@/lib/data/womenGalleryShowcase";
import { getAdminDb } from "@/lib/firebase/admin";
import type { WomenFashionImage } from "@/lib/firebase/womenFashion";
import * as admin from "firebase-admin";

export const dynamic = "force-dynamic";

const FALLBACK_IMAGES: WomenFashionImage[] = WOMEN_GALLERY_SHOWCASE;

function enrichGalleryBase(base: WomenFashionImage): WomenFashionImage {
  const byId = SHOWCASE_DETAILS_BY_ID[base.id];
  const ord = base.order;
  const byOrder =
    typeof ord === "number" ? SHOWCASE_DETAILS_BY_ORDER[ord] : undefined;
  const extra = byId ?? byOrder;
  return extra ? { ...base, ...extra } : base;
}

export async function GET() {
  try {
    const db = await getAdminDb();

    // If admin DB is not configured, return fallback images
    if (!db) {
      console.log("[api/gallery/women] No admin DB, using fallback images");
      return NextResponse.json(FALLBACK_IMAGES);
    }

    const snapshot = await db
      .collection("categories")
      .doc("women")
      .collection("gallery")
      .orderBy("order", "asc")
      .get();

    // If no data in Firestore, return fallback images
    if (snapshot.empty) {
      console.log("[api/gallery/women] No gallery data in Firestore, using fallback images");
      return NextResponse.json(FALLBACK_IMAGES);
    }

    // Get bucket name once after admin is initialized
    const bucketName = admin.storage().bucket().name;

    const images = snapshot.docs
      .map((doc) => {
        const data = doc.data();
        let imageUrl = data.imageUrl;

        // If imageUrl is missing or invalid, construct it from storagePath
        if ((!imageUrl || !imageUrl.startsWith("http")) && data.storagePath) {
          const encoded = encodeURIComponent(data.storagePath.trim());
          imageUrl = `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encoded}?alt=media`;
        }

        if (!imageUrl) return null;

        const base: WomenFashionImage = {
          id: doc.id,
          imageUrl,
          storagePath: typeof data.storagePath === "string" ? data.storagePath : "",
          category: data.category ?? "women",
          label: data.label,
          order: typeof data.order === "number" ? data.order : undefined,
        };

        return enrichGalleryBase(base);
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);

    // If all items were filtered out, return fallback
    if (images.length === 0) {
      console.log("[api/gallery/women] All images filtered out, using fallback images");
      return NextResponse.json(FALLBACK_IMAGES);
    }

    return NextResponse.json(images);
  } catch (err) {
    console.error("[api/gallery/women]", err);
    // On error, return fallback images instead of failing
    console.log("[api/gallery/women] Error occurred, using fallback images");
    return NextResponse.json(FALLBACK_IMAGES);
  }
}
