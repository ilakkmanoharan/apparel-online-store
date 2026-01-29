import type { Product } from "@/types";

export interface ProductVariant {
  id: string;
  size: string;
  color: string;
  sku?: string;
  stockCount: number;
  priceOverride?: number;
}

export type VariantKey = string; // e.g. "M-Black" or "size-color"

/**
 * Build a variant key from size and color.
 */
export function getVariantKey(size: string, color: string): VariantKey {
  return `${size}-${color}`;
}

/**
 * Parse variant key into size and color (assumes format "size-color").
 */
export function parseVariantKey(key: VariantKey): { size: string; color: string } {
  const idx = key.lastIndexOf("-");
  if (idx <= 0) return { size: key, color: "" };
  return { size: key.slice(0, idx), color: key.slice(idx + 1) };
}

/**
 * Build all variant combinations from product sizes and colors.
 */
export function buildVariantsFromProduct(product: Product): ProductVariant[] {
  const variants: ProductVariant[] = [];
  for (const size of product.sizes) {
    for (const color of product.colors) {
      variants.push({
        id: getVariantKey(size, color),
        size,
        color,
        stockCount: product.stockCount,
        priceOverride: undefined,
      });
    }
  }
  return variants;
}

/**
 * Get stock for a variant (placeholder: use product-level stock if no variant-level data).
 */
export function getVariantStock(
  _productId: string,
  variantKey: VariantKey,
  productFallbackStock: number
): number {
  // In a full implementation, look up variant stock from Firestore/inventory.
  return productFallbackStock;
}
