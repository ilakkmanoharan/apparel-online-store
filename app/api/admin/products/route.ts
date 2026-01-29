import { NextResponse } from "next/server";
import { listAdminProducts, createAdminProduct } from "@/lib/admin/products";
import type { Product } from "@/types";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Number(searchParams.get("limit")) || 50;
    const categoryId = searchParams.get("category") ?? undefined;
    const products = await listAdminProducts({ limit, categoryId });
    return NextResponse.json(products);
  } catch (err) {
    console.error("Admin products list error:", err);
    return NextResponse.json({ error: "Failed to list products" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as Partial<Product> & { name: string; price: number; category: string };
    const { name, description, price, originalPrice, images, category, subcategory, sizes, colors, inStock, stockCount, featured } = body;
    if (!name || price == null || !category) {
      return NextResponse.json({ error: "Missing name, price, or category" }, { status: 400 });
    }
    const id = await createAdminProduct({
      name,
      description: description ?? "",
      price: Number(price),
      originalPrice: originalPrice != null ? Number(originalPrice) : undefined,
      images: images ?? [],
      category,
      subcategory,
      sizes: sizes ?? [],
      colors: colors ?? [],
      inStock: inStock ?? true,
      stockCount: stockCount ?? 0,
      featured: featured ?? false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return NextResponse.json({ id });
  } catch (err) {
    console.error("Admin product create error:", err);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
