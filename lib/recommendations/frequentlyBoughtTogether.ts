import { getProductById, getProductsByCategory } from "@/lib/firebase/products";
import type { ProductRecommendation } from "@/types/recommendation";

const MAX_ITEMS = 4;

export async function getFrequentlyBoughtTogether(productId: string): Promise<ProductRecommendation[]> {
  const product = await getProductById(productId);
  if (!product) return [];
  const sameCategory = await getProductsByCategory(product.category);
  const others = sameCategory.filter((p) => p.id !== productId).slice(0, MAX_ITEMS);
  return others.map((p) => ({ product: p, reason: "frequently_bought_together" as const }));
}
