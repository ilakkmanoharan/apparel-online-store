/**
 * Combined recommendations: merges similar products, frequently-bought-together
 * (from order history when available, else same-category fallback), and ranks by
 * popularity from order history. Server-safe (uses order aggregates only on server).
 */

import { getProductById } from "@/lib/firebase/products";
import type { ProductRecommendation } from "@/types/recommendation";
import { getSimilarProducts } from "./similarProducts";
import { getFrequentlyBoughtTogether } from "./frequentlyBoughtTogether";
import { getBoughtTogether, getProductPopularity } from "./orderAggregates";

const MAX_RECOMMENDATIONS = 8;

/**
 * Returns recommendations for a product: merges "frequently bought together"
 * (from order history when available), similar products, and ranks by popularity.
 * Deduplicates by product id and limits to MAX_RECOMMENDATIONS.
 */
export async function getRecommendations(
  productId: string,
  localeValue?: string
): Promise<ProductRecommendation[]> {
  const [similar, fbtFallback, boughtTogetherIds, popularityMap] = await Promise.all([
    getSimilarProducts(productId, localeValue),
    getFrequentlyBoughtTogether(productId, localeValue),
    (async () => {
      try {
        return await getBoughtTogether(productId, 6);
      } catch {
        return [];
      }
    })(),
    (async () => {
      try {
        return await getProductPopularity();
      } catch {
        return new Map<string, number>();
      }
    })(),
  ]);

  const seen = new Set<string>([productId]);
  const result: ProductRecommendation[] = [];

  // 1. Add order-based "frequently bought together" (with full product)
  for (const { productId: otherId } of boughtTogetherIds) {
    if (seen.has(otherId)) continue;
    const product = await getProductById(otherId, localeValue);
    if (product) {
      seen.add(otherId);
      const score = popularityMap.get(otherId) ?? 0;
      result.push({
        product,
        reason: "frequently_bought_together",
        score,
      });
    }
  }

  // 2. Fill with category-based FBT fallback
  for (const rec of fbtFallback) {
    if (seen.has(rec.product.id)) continue;
    seen.add(rec.product.id);
    result.push({
      ...rec,
      score: rec.score ?? popularityMap.get(rec.product.id) ?? 0,
    });
  }

  // 3. Fill with similar
  for (const rec of similar) {
    if (seen.has(rec.product.id)) continue;
    seen.add(rec.product.id);
    result.push({
      ...rec,
      score: rec.score ?? popularityMap.get(rec.product.id) ?? 0,
    });
  }

  // Sort by score descending, then by reason (frequently_bought_together first)
  const reasonOrder = { frequently_bought_together: 0, similar: 1 } as const;
  result.sort((a, b) => {
    const scoreDiff = (b.score ?? 0) - (a.score ?? 0);
    if (scoreDiff !== 0) return scoreDiff;
    return (reasonOrder[a.reason] ?? 2) - (reasonOrder[b.reason] ?? 2);
  });

  return result.slice(0, MAX_RECOMMENDATIONS);
}
