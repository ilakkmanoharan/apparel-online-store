import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase/admin";
import { getProductsByCategoryPaginated } from "@/lib/firebase/productsByCategory";
import { parsePLPPageFromSearchParams, parsePLPSortFromSearchParams } from "@/lib/config/plp";
import { PLP_DEFAULT_PAGE_SIZE } from "@/lib/config/plp";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
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
    const searchParams = Object.fromEntries(request.nextUrl.searchParams);
    const page = parsePLPPageFromSearchParams(searchParams);
    const sort = parsePLPSortFromSearchParams(searchParams);
    const pageSizeParam = request.nextUrl.searchParams.get("pageSize");
    const pageSize = pageSizeParam
      ? Math.min(48, Math.max(1, parseInt(pageSizeParam, 10)) || PLP_DEFAULT_PAGE_SIZE)
      : PLP_DEFAULT_PAGE_SIZE;

    const result = await getProductsByCategoryPaginated(db, slug, {
      page,
      pageSize,
      sort,
    });

    return NextResponse.json({
      products: result.products,
      total: result.total,
      hasMore: result.hasMore,
      page,
      pageSize,
    });
  } catch (err) {
    console.error("[api/category/[slug]/products]", err);
    return NextResponse.json(
      { error: "Failed to load category products" },
      { status: 500 }
    );
  }
}
