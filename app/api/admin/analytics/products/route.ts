import { NextResponse } from "next/server";
import { getTopProducts } from "@/lib/admin/analytics";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Number(searchParams.get("limit")) || 10;
    const products = await getTopProducts(limit);
    return NextResponse.json(products);
  } catch (err) {
    console.error("Admin analytics products error:", err);
    return NextResponse.json({ error: "Failed to get top products" }, { status: 500 });
  }
}
