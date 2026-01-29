# Issue 7: Similar products API and lib missing — no “Similar items” / “You may also like” API

**Scope:** ~2.5 hours (LLM or developer).

There is **no** `lib/recommendations/similarProducts.ts` and **no** `app/api/products/[id]/similar/route.ts`. PDP cannot fetch “Similar items” or “You may also like” via API.

---

## Observed

- `GET /api/products/:id/similar` does not exist (404).
- No lib function to compute similar products by category, attributes, or other signals.

---

## Context

- **Location**: Missing `lib/recommendations/similarProducts.ts` and `app/api/products/[id]/similar/route.ts`.
- **Effect**: “Similar products” block on PDP cannot be implemented via API.
- **Cause**: Neither the lib nor the route was implemented.

---

## Expected

- `lib/recommendations/similarProducts.ts` exports a function (e.g. `getSimilarProducts(productId: string): Promise<ProductRecommendation[]>`), using category, subcategory, or other product fields to find similar items.
- `GET /api/products/[id]/similar` returns 200 with a JSON array of similar product recommendations.

---

## Resolution

1. **Lib:** Add `lib/recommendations/similarProducts.ts`. Implement `getSimilarProducts(productId)` (e.g. load product, then query by same category/subcategory, exclude self, limit to N).
2. **Route:** Add `app/api/products/[id]/similar/route.ts`, export `GET`, call `getSimilarProducts(params.id)`, return JSON array; 404 for invalid id.
3. Reuse types from `@/types/recommendation` (e.g. `ProductRecommendation`).

---

## Test

- **Gap test:** `__tests__/gaps/similar-products-api.test.ts` — asserts that `lib/recommendations/similarProducts.ts` and `app/api/products/[id]/similar/route.ts` exist and the route exports `GET`. Fails until both are added.

---

## Status

Open.
