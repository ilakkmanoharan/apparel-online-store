import { NextResponse } from "next/server";
import { getAdminProduct, updateAdminProduct, deleteAdminProduct } from "@/lib/admin/products";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await getAdminProduct(id);
    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });
    return NextResponse.json(product);
  } catch (err) {
    console.error("Admin product get error:", err);
    return NextResponse.json({ error: "Failed to get product" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    await updateAdminProduct(id, body);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Admin product update error:", err);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await deleteAdminProduct(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Admin product delete error:", err);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
