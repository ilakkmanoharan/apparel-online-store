import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase/admin";
import { getReviewSummaryForProduct } from "@/lib/reviews/summary";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = await getAdminDb();
    if (!db) {
      return NextResponse.json(
        { error: "Server not configured" },
        { status: 503 }
      );
    }
    const { id } = await params;
    if (!id) return NextResponse.json({ error: "Missing product id" }, { status: 400 });
    const summary = await getReviewSummaryForProduct(db, id);
    return NextResponse.json(summary ?? { productId: id, averageRating: 0, totalCount: 0, distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } });
  } catch (err) {
    console.error("[products reviews summary GET]", err);
    return NextResponse.json({ error: "Failed to get review summary" }, { status: 500 });
  }
}
