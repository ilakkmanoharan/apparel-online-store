import { NextResponse } from "next/server";
import { getAdminPromo, updateAdminPromo } from "@/lib/admin/promos";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const promo = await getAdminPromo(id);
    if (!promo) return NextResponse.json({ error: "Promo not found" }, { status: 404 });
    return NextResponse.json(promo);
  } catch (err) {
    console.error("Admin promo get error:", err);
    return NextResponse.json({ error: "Failed to get promo" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    await updateAdminPromo(id, body);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Admin promo update error:", err);
    return NextResponse.json({ error: "Failed to update promo" }, { status: 500 });
  }
}
