import { getProductById } from "@/lib/firebase/products";
import type { ProductAvailability, SizeAvailability } from "@/types/inventory";

export async function getProductAvailability(productId: string): Promise<ProductAvailability | null> {
  const product = await getProductById(productId);
  if (!product) return null;
  const bySize: SizeAvailability[] = (product.sizes ?? []).map((size) => ({
    size,
    inStock: product.inStock,
    quantity: product.stockCount ?? 0,
  }));
  return {
    productId: product.id,
    inStock: product.inStock,
    totalQuantity: product.stockCount ?? 0,
    bySize,
  };
}

export function isLowStock(quantity: number, threshold: number = 5): boolean {
  return quantity > 0 && quantity <= threshold;
}
