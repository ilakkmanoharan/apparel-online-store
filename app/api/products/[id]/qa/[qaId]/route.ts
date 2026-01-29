import { NextRequest, NextResponse } from "next/server";
import { getQAPairById } from "@/lib/qa/firebase";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{ id: string; qaId: string }>;
}

/**
 * GET /api/products/[id]/qa/[qaId] – fetch a single Q&A pair.
 */
export async function GET(
  _request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id: productId, qaId } = await params;
    if (!productId || !qaId) {
      return NextResponse.json(
        { error: "Missing product id or qa id" },
        { status: 400 }
      );
    }
    const item = await getQAPairById(productId, qaId);
    if (!item) {
      return NextResponse.json({ error: "Q&A not found" }, { status: 404 });
    }
    return NextResponse.json(item);
  } catch (err) {
    console.error("[products qa qaId GET]", err);
    return NextResponse.json(
      { error: "Failed to get Q&A" },
      { status: 500 }
    );
  }
}
