import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase/admin";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const db = await getAdminDb();
    if (!db) {
      return NextResponse.json(
        { error: "Server not configured (missing service account)" },
        { status: 503 }
      );
    }

    const { slug } = await params;
    const snapshot = await db
      .collection("products")
      .where("category", "==", slug)
      .limit(500)
      .get();

    const sizeCounts: Record<string, number> = {};
    const colorCounts: Record<string, number> = {};

    snapshot.docs.forEach((doc) => {
      const data = doc.data();
      const sizes = Array.isArray(data.sizes) ? data.sizes : [];
      const colors = Array.isArray(data.colors) ? data.colors : [];
      sizes.forEach((s: string) => {
        sizeCounts[s] = (sizeCounts[s] ?? 0) + 1;
      });
      colors.forEach((c: string) => {
        colorCounts[c] = (colorCounts[c] ?? 0) + 1;
      });
    });

    const sizes = Object.entries(sizeCounts)
      .map(([value, count]) => ({ value, count }))
      .sort((a, b) => a.value.localeCompare(b.value));
    const colors = Object.entries(colorCounts)
      .map(([value, count]) => ({ value, count }))
      .sort((a, b) => a.value.localeCompare(b.value));

    return NextResponse.json({ sizes, colors });
  } catch (err) {
    console.error("[api/category/[slug]/filters]", err);
    return NextResponse.json(
      { error: "Failed to load filters" },
      { status: 500 }
    );
  }
}
