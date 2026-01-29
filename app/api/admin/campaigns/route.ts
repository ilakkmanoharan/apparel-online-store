import { NextResponse } from "next/server";
import { listAdminCampaigns, createAdminCampaign } from "@/lib/admin/campaigns";
import type { Campaign } from "@/types/editorial";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Number(searchParams.get("limit")) || 50;
    const campaigns = await listAdminCampaigns(limit);
    return NextResponse.json(campaigns);
  } catch (err) {
    console.error("Admin campaigns list error:", err);
    return NextResponse.json({ error: "Failed to list campaigns" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as Partial<Campaign> & { title: string; slug: string };
    const { title, slug, description, imageUrl, startDate, endDate, blocks, active } = body;
    if (!title || !slug) {
      return NextResponse.json({ error: "Missing title or slug" }, { status: 400 });
    }
    const id = await createAdminCampaign({
      title,
      slug,
      description: description ?? "",
      imageUrl: imageUrl ?? "",
      startDate: startDate ? new Date(startDate) : new Date(),
      endDate: endDate ? new Date(endDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      blocks: blocks ?? [],
      active: active ?? true,
    } as Omit<Campaign, "id" | "createdAt" | "updatedAt">);
    return NextResponse.json({ id });
  } catch (err) {
    console.error("Admin campaign create error:", err);
    return NextResponse.json({ error: "Failed to create campaign" }, { status: 500 });
  }
}
