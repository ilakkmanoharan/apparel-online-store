import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase/admin";

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

    const images = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        imageUrl: data.imageUrl,
        storagePath: data.storagePath,
        category: data.category ?? "women",
        label: data.label,
        order: data.order,
      };
    });

    return NextResponse.json(images);
  } catch (err) {
    console.error("[api/gallery/women]", err);
    return NextResponse.json(
      { error: "Failed to load gallery" },
      { status: 500 }
    );
  }
}
