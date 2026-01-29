# Issue 6: Product recommendations API missing — PDP cannot fetch “Frequently bought together”

**Scope:** ~2.5 hours (LLM or developer).

`lib/recommendations/frequentlyBoughtTogether.ts` exists and implements “frequently bought together” logic. There is **no** `app/api/products/[id]/recommendations/route.ts`, so the PDP cannot fetch recommendations via API.

---

## Observed

- PDP or other clients cannot call `GET /api/products/:id/recommendations`; route does not exist (404).
- Logic exists in `getFrequentlyBoughtTogether(productId)` but is not exposed over HTTP.

---

## Context

- **Location**: Missing `app/api/products/[id]/recommendations/route.ts`; lib at `lib/recommendations/frequentlyBoughtTogether.ts`.
- **Effect**: “Frequently bought together” (or recommendation block) cannot be loaded on PDP via API.
- **Cause**: No API route wiring the lib to HTTP.

---

## Expected

- `GET /api/products/[id]/recommendations` returns 200 with a JSON array of recommendations (e.g. `ProductRecommendation[]`), using `getFrequentlyBoughtTogether(id)` (and optionally other sources).

---

## Resolution

1. Add `app/api/products/[id]/recommendations/route.ts`.
2. Export `GET`: read `params.id`, call `getFrequentlyBoughtTogether(params.id)` (and optionally merge with recently viewed / similar if desired for this scope).
3. Return JSON array; handle invalid id with 404.
4. Optionally add query params (e.g. `limit`) and respect them.

---

## Test

- **Gap test:** `__tests__/gaps/recommendations-api.test.ts` — asserts that the route file exists and exports `GET`. Fails until the route is added.

---

## Status

Open.
