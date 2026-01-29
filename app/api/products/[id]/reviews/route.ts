import { NextRequest, NextResponse } from "next/server";
import { getReviews } from "@/lib/reviews/firebase";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) return NextResponse.json({ error: "Missing product id" }, { status: 400 });
    const { searchParams } = new URL(req.url);
    const limit = Number(searchParams.get("limit")) || 20;
    const orderBy = (searchParams.get("orderBy") as "createdAt" | "rating") || "createdAt";
    const reviews = await getReviews(id, { limit, orderBy });
    return NextResponse.json(reviews);
  } catch (err) {
    console.error("[products reviews GET]", err);
    return NextResponse.json({ error: "Failed to get reviews" }, { status: 500 });
  }
}
