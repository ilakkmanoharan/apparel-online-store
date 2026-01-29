import { NextRequest, NextResponse } from "next/server";
import { validateCart } from "@/lib/cart/validation";
import type { CartItem } from "@/types";
import type { CartValidationResult } from "@/types/cart";

function parseItems(body: unknown): CartItem[] {
  if (!body || typeof body !== "object" || !Array.isArray((body as { items?: unknown }).items)) {
    return [];
  }
  const raw = (body as { items: unknown[] }).items;
  return raw.map((item: unknown) => {
    if (!item || typeof item !== "object") return null;
    const o = item as Record<string, unknown>;
    const product = o.product as Record<string, unknown> | undefined;
    if (!product) return null;
    return {
      product: {
        id: String(product.id ?? ""),
        name: String(product.name ?? ""),
        description: String(product.description ?? ""),
        price: Number(product.price) ?? 0,
        originalPrice: product.originalPrice != null ? Number(product.originalPrice) : undefined,
        images: Array.isArray(product.images) ? product.images as string[] : [],
        category: String(product.category ?? ""),
        subcategory: product.subcategory != null ? String(product.subcategory) : undefined,
        sizes: Array.isArray(product.sizes) ? product.sizes as string[] : [],
        colors: Array.isArray(product.colors) ? product.colors as string[] : [],
        inStock: Boolean(product.inStock),
        stockCount: Number(product.stockCount) ?? 0,
        rating: product.rating != null ? Number(product.rating) : undefined,
        reviewCount: product.reviewCount != null ? Number(product.reviewCount) : undefined,
        featured: Boolean(product.featured),
        createdAt: product.createdAt ? new Date(product.createdAt as string) : new Date(),
        updatedAt: product.updatedAt ? new Date(product.updatedAt as string) : new Date(),
      },
      quantity: Number(o.quantity) ?? 1,
      selectedSize: String(o.selectedSize ?? ""),
      selectedColor: String(o.selectedColor ?? ""),
    } as CartItem;
  }).filter(Boolean) as CartItem[];
}

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const items = parseItems(body);
    const result: CartValidationResult = validateCart(items);
    return NextResponse.json(result);
  } catch (err) {
    console.error("[api/cart/validate]", err);
    return NextResponse.json(
      { valid: false, items: [], errors: ["Validation failed"] },
      { status: 500 }
    );
  }
}
