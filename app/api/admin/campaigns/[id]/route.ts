import { NextResponse } from "next/server";
import { getAdminCampaign, updateAdminCampaign } from "@/lib/admin/campaigns";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const campaign = await getAdminCampaign(id);
    if (!campaign) return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    return NextResponse.json(campaign);
  } catch (err) {
    console.error("Admin campaign get error:", err);
    return NextResponse.json({ error: "Failed to get campaign" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    await updateAdminCampaign(id, body);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Admin campaign update error:", err);
    return NextResponse.json({ error: "Failed to update campaign" }, { status: 500 });
  }
}
