import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase/admin";
import * as admin from "firebase-admin";

export const dynamic = "force-dynamic";

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

    return NextResponse.json(images);
  } catch (err) {
    console.error("[api/gallery/women]", err);
    return NextResponse.json(
      { error: "Failed to load gallery" },
      { status: 500 }
    );
  }
}
