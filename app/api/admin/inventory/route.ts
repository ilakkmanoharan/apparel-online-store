import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase/admin";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/inventory?limit=50
 * Returns product inventory summary (id, name, stockCount, inStock).
 */
export async function GET(request: NextRequest) {
  try {
    const db = await getAdminDb();
    if (!db) {
      return NextResponse.json(
        { error: "Server not configured" },
        { status: 503 }
      );
    }

    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get("limit") ?? "100", 10), 500);

    const snap = await db
      .collection("products")
      .orderBy("updatedAt", "desc")
      .limit(limit)
      .get();

    const items = snap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        name: data.name ?? "",
        stockCount: data.stockCount ?? 0,
        inStock: data.inStock ?? false,
      };
    });

    return NextResponse.json({ items });
  } catch (err) {
    console.error("[admin inventory GET]", err);
    return NextResponse.json(
      { error: "Failed to load inventory" },
      { status: 500 }
    );
  }
}
