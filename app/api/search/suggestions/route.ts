import { NextRequest, NextResponse } from "next/server";
import { buildSuggestions, POPULAR_QUERIES } from "@/lib/search/suggestions";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") ?? "";
    const sources = POPULAR_QUERIES.map((text) => ({
      type: "query" as const,
      text,
      href: `/search?q=${encodeURIComponent(text)}`,
    }));
    const suggestions = buildSuggestions(q, sources, 8);
    return NextResponse.json({ suggestions });
  } catch (err) {
    console.error("[search suggestions]", err);
    return NextResponse.json({ suggestions: [] }, { status: 500 });
  }
}
