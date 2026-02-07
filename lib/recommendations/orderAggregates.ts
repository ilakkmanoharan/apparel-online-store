/**
 * Server-only: aggregates product popularity and "bought together" pairs from
 * order history. Uses Firebase Admin to read orders. Results are cached in
 * memory for CACHE_MS to avoid scanning orders on every request.
 *
 * For production at scale, consider a materialized collection updated by
 * webhook or a scheduled job.
 */

import { getAdminDb } from "@/lib/firebase/admin";

const CACHE_MS = 5 * 60 * 1000; // 5 minutes
const MAX_ORDERS = 400;

let cachedAt = 0;
let popularityMap: Map<string, number> = new Map();
let pairCountMap: Map<string, Map<string, number>> = new Map();

function cacheKey(a: string, b: string): string {
  return a < b ? `${a}:${b}` : `${b}:${a}`;
}

async function refreshAggregates(): Promise<void> {
  const db = await getAdminDb();
  if (!db) {
    return;
  }

  const snapshot = await db
    .collection("orders")
    .orderBy("createdAt", "desc")
    .limit(MAX_ORDERS)
    .get();

  const newPopularity = new Map<string, number>();
  const newPairs = new Map<string, number>();

  for (const doc of snapshot.docs) {
    const data = doc.data();
    const items = (data.items as Array<{ product?: { id?: string }; productId?: string }>) ?? [];
    const productIds: string[] = [];

    for (const item of items) {
      const id = item.product?.id ?? item.productId;
      if (id) {
        productIds.push(id);
        newPopularity.set(id, (newPopularity.get(id) ?? 0) + 1);
      }
    }

    for (let i = 0; i < productIds.length; i++) {
      for (let j = i + 1; j < productIds.length; j++) {
        const key = cacheKey(productIds[i], productIds[j]);
        newPairs.set(key, (newPairs.get(key) ?? 0) + 1);
      }
    }
  }

  popularityMap = newPopularity;
  pairCountMap = new Map();
  for (const [key, count] of newPairs) {
    const [a, b] = key.split(":");
    if (!pairCountMap.has(a)) pairCountMap.set(a, new Map());
    pairCountMap.get(a)!.set(b, count);
    if (!pairCountMap.has(b)) pairCountMap.set(b, new Map());
    pairCountMap.get(b)!.set(a, count);
  }
  cachedAt = Date.now();
}

async function ensureCache(): Promise<void> {
  if (Date.now() - cachedAt > CACHE_MS) {
    await refreshAggregates();
  }
}

/**
 * Returns a map of productId -> number of times ordered (from recent orders).
 */
export async function getProductPopularity(): Promise<Map<string, number>> {
  await ensureCache();
  return new Map(popularityMap);
}

/**
 * Returns product IDs most frequently bought in the same order as the given
 * product, with counts, sorted by count descending. Excludes productId itself.
 */
export async function getBoughtTogether(
  productId: string,
  limit = 10
): Promise<Array<{ productId: string; count: number }>> {
  await ensureCache();
  const withCounts = pairCountMap.get(productId);
  if (!withCounts) return [];

  const entries = Array.from(withCounts.entries())
    .filter(([id]) => id !== productId)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([productId, count]) => ({ productId, count }));

  return entries;
}
