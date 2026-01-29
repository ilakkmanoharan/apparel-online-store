import { NextResponse } from "next/server";
import { listAdminPromos, createAdminPromo } from "@/lib/admin/promos";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Number(searchParams.get("limit")) || 50;
    const promos = await listAdminPromos(limit);
    return NextResponse.json(promos);
  } catch (err) {
    console.error("Admin promos list error:", err);
    return NextResponse.json({ error: "Failed to list promos" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code, discountPercent, minOrder, active } = body;
    if (!code || discountPercent == null) {
      return NextResponse.json({ error: "Missing code or discountPercent" }, { status: 400 });
    }
    const id = await createAdminPromo({
      code: String(code).trim().toUpperCase(),
      discountPercent: Number(discountPercent),
      minOrder: minOrder != null ? Number(minOrder) : undefined,
      active: active ?? true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return NextResponse.json({ id });
  } catch (err) {
    console.error("Admin promo create error:", err);
    return NextResponse.json({ error: "Failed to create promo" }, { status: 500 });
  }
}
