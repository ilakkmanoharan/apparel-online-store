import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase/admin";

export const dynamic = "force-dynamic";

const STORAGE_BUCKET = "apparel-online-store.firebasestorage.app";

/** Build Firebase Storage download URL when imageUrl is missing in Firestore. */
function getImageUrl(imageUrl: string | undefined, storagePath: string | undefined): string | null {
  if (imageUrl && imageUrl.startsWith("http")) return imageUrl;
  if (storagePath && storagePath.trim()) {
    const encoded = encodeURIComponent(storagePath.trim());
    return `https://firebasestorage.googleapis.com/v0/b/${STORAGE_BUCKET}/o/${encoded}?alt=media`;
  }
  return null;
}

/** Fallback sample images used when Firestore/Storage has no gallery data. */
const FALLBACK_IMAGES = [
  { id: "fallback-1", imageUrl: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80", storagePath: "", category: "women", label: "Women fashion look 1", order: 1 },
  { id: "fallback-2", imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80", storagePath: "", category: "women", label: "Women fashion look 2", order: 2 },
  { id: "fallback-3", imageUrl: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80", storagePath: "", category: "women", label: "Women fashion look 3", order: 3 },
  { id: "fallback-4", imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80", storagePath: "", category: "women", label: "Women fashion look 4", order: 4 },
  { id: "fallback-5", imageUrl: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&q=80", storagePath: "", category: "women", label: "Women fashion look 5", order: 5 },
];

export async function GET() {
  try {
    const db = await getAdminDb();
    if (!db) {
      return NextResponse.json(FALLBACK_IMAGES);
    }

    const snapshot = await db
      .collection("categories")
      .doc("women")
      .collection("gallery")
      .orderBy("order", "asc")
      .get();

    const images = snapshot.docs
      .map((doc) => {
        const data = doc.data();
        const imageUrl = getImageUrl(data.imageUrl, data.storagePath);
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

    return NextResponse.json(images.length > 0 ? images : FALLBACK_IMAGES);
  } catch (err) {
    console.error("[api/gallery/women]", err);
    return NextResponse.json(
      { error: "Failed to load gallery" },
      { status: 500 }
    );
  }
}
