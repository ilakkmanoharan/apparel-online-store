import { getProductById, getProductsByCategory } from "@/lib/firebase/products";
import type { ProductRecommendation } from "@/types/recommendation";

const MAX_ITEMS = 8;

/**
 * Returns products similar to the given product: same category, preferring same
 * subcategory, excluding the current product. Results are ordered by subcategory
 * match then by recency (createdAt). Uses ProductRecommendation for consistency
 * with recommendations API.
 */
export async function getSimilarProducts(
  productId: string,
  localeValue?: string
): Promise<ProductRecommendation[]> {
  const product = await getProductById(productId, localeValue);
  if (!product) return [];

  const sameCategory = await getProductsByCategory(product.category, localeValue);
  const others = sameCategory.filter((p) => p.id !== productId);

  // Prefer same subcategory; then by recency (already ordered by createdAt desc from getProductsByCategory)
  const subcategory = product.subcategory?.toLowerCase();
  const sorted = subcategory
    ? [...others].sort((a, b) => {
        const aMatch = a.subcategory?.toLowerCase() === subcategory ? 1 : 0;
        const bMatch = b.subcategory?.toLowerCase() === subcategory ? 1 : 0;
        return bMatch - aMatch;
      })
    : others;

  return sorted.slice(0, MAX_ITEMS).map((p) => ({
    product: p,
    reason: "similar" as const,
  }));
}
