import { Product } from "@/types";
import { getProductsByCategory } from "@/lib/firebase/products";

const MAX_RECENT = 10;
const MAX_RELATED = 4;

/**
 * "Recently viewed" – in a real app this would be stored per-user (e.g. Firestore or localStorage).
 * Here we return a stub; the component can use localStorage for anonymous users.
 */
export function getRecentlyViewedIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("recently-viewed");
    if (!raw) return [];
    const parsed = JSON.parse(raw) as string[];
    return Array.isArray(parsed) ? parsed.slice(0, MAX_RECENT) : [];
  } catch {
    return [];
  }
}

export function addRecentlyViewed(productId: string): void {
  if (typeof window === "undefined") return;
  try {
    const ids = getRecentlyViewedIds().filter((id) => id !== productId);
    ids.unshift(productId);
    localStorage.setItem(
      "recently-viewed",
      JSON.stringify(ids.slice(0, MAX_RECENT))
    );
  } catch {
    // ignore
  }
}

/**
 * Related products: same category, excluding current product. Limit to MAX_RELATED.
 */
export async function getRelatedProducts(
  productId: string,
  category: string
): Promise<Product[]> {
  const all = await getProductsByCategory(category);
  const filtered = all.filter((p) => p.id !== productId);
  return filtered.slice(0, MAX_RELATED);
}
