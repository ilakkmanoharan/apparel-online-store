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

export async function GET() {
  try {
    const db = await getAdminDb();
    if (!db) {
      return NextResponse.json(
        { error: "Server not configured for gallery (missing service account)" },
        { status: 503 }
      );
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

    return NextResponse.json(images);
  } catch (err) {
    console.error("[api/gallery/women]", err);
    return NextResponse.json(
      { error: "Failed to load gallery" },
      { status: 500 }
    );
  }
}
