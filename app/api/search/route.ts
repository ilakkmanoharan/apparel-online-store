import { NextRequest, NextResponse } from "next/server";
import { searchProducts } from "@/lib/search/index";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") ?? "";
    const category = searchParams.get("category") ?? undefined;
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const filters = {
      category,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
    };
    const result = await searchProducts(q, filters);
    return NextResponse.json(result);
  } catch (err) {
    console.error("[search]", err);
    return NextResponse.json({ error: "Search failed", products: [] }, { status: 500 });
  }
}
