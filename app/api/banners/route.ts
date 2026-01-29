import { NextRequest, NextResponse } from "next/server";
import { getBanners } from "@/lib/editorial/banners";

export async function GET(request: NextRequest) {
  try {
    const u = new URL(request.url);
    const position = u.searchParams.get("position") as "top" | "mid" | "bottom" | null;
    const banners = await getBanners(position ?? undefined);
    return NextResponse.json({ banners });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Failed" }, { status: 500 });
  }
}
