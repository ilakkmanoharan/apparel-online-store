import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase/admin";
import * as admin from "firebase-admin";

export const dynamic = "force-dynamic";

// Fallback sample images from Unsplash (free, publicly accessible)
const FALLBACK_IMAGES = [
  {
    id: "look-1",
    imageUrl: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&q=80",
    storagePath: "",
    category: "women",
    label: "Women fashion look 1",
    order: 1,
  },
  {
    id: "look-2",
    imageUrl: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=800&q=80",
    storagePath: "",
    category: "women",
    label: "Women fashion look 2",
    order: 2,
  },
  {
    id: "look-3",
    imageUrl: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80",
    storagePath: "",
    category: "women",
    label: "Women fashion look 3",
    order: 3,
  },
  {
    id: "look-4",
    imageUrl: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80",
    storagePath: "",
    category: "women",
    label: "Women fashion look 4",
    order: 4,
  },
  {
    id: "look-5",
    imageUrl: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80",
    storagePath: "",
    category: "women",
    label: "Women fashion look 5",
    order: 5,
  },
  {
    id: "look-6",
    imageUrl: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800&q=80",
    storagePath: "",
    category: "women",
    label: "Women fashion look 6",
    order: 6,
  },
  {
    id: "look-7",
    imageUrl: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=800&q=80",
    storagePath: "",
    category: "women",
    label: "Women fashion look 7",
    order: 7,
  },
  {
    id: "look-8",
    imageUrl: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80",
    storagePath: "",
    category: "women",
    label: "Women fashion look 8",
    order: 8,
  },
];

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

        return {
          id: doc.id,
          imageUrl,
          storagePath: data.storagePath,
          category: data.category ?? "women",
          label: data.label,
          order: data.order,
        };
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
