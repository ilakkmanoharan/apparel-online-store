import { NextRequest, NextResponse } from "next/server";
import { checkStoreAvailability } from "@/lib/bopis/availability";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const storeId = searchParams.get("storeId");
    const productId = searchParams.get("productId");
    const variantKey = searchParams.get("variantKey") ?? "";
    const quantity = Math.max(1, parseInt(searchParams.get("quantity") ?? "1", 10));
    if (!storeId || !productId) {
      return NextResponse.json(
        { error: "storeId and productId are required" },
        { status: 400 }
      );
    }
    const result = await checkStoreAvailability(storeId, productId, variantKey, quantity);
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Availability check failed" },
      { status: 500 }
    );
  }
}
