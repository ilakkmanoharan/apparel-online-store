import { NextRequest, NextResponse } from "next/server";
import { getProductAvailability } from "@/lib/inventory/availability";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/products/[id]/availability – product availability by size.
 */
export async function GET(
  _request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id: productId } = await params;
    if (!productId) {
      return NextResponse.json(
        { error: "Missing product id" },
        { status: 400 }
      );
    }
    const availability = await getProductAvailability(productId);
    if (!availability) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(availability);
  } catch (err) {
    console.error("[products availability GET]", err);
    return NextResponse.json(
      { error: "Failed to get availability" },
      { status: 500 }
    );
  }
}
