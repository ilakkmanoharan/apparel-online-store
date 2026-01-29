# Issue 9: No GET /api/orders for current user’s orders

**Scope:** ~2.5 hours (LLM or developer).

`useOrders` (or equivalent) reads orders directly from Firestore via `getOrdersForUser(userId)`. There is **no** `app/api/orders/route.ts` (GET) for listing the current user’s orders. Backend-for-frontend or API consistency requires a REST endpoint.

---

## Observed

- Frontend fetches orders via Firestore client or direct lib call, not via `GET /api/orders`.
- No single API contract for “my orders” that could be used by multiple clients or server-side.

---

## Context

- **Location**: Missing `app/api/orders/route.ts`; existing logic in `lib/firebase/orders.ts` (`getOrdersForUser`).
- **Effect**: No REST API for orders; harder to add server-side rendering, BFF, or third-party consumers.
- **Cause**: Route was never added.

---

## Expected

- `GET /api/orders` returns 200 with a JSON array of the **current user’s** orders when authenticated.
- Returns 401 when unauthenticated; optionally 200 with empty array for “guest” if desired.
- Response shape matches or is derived from existing `Order` type.

---

## Resolution

1. Add `app/api/orders/route.ts`.
2. Export `GET`: resolve current user (e.g. Firebase auth or session); if unauthenticated, return 401 (or empty array per product decision).
3. Call `getOrdersForUser(userId)` and return JSON array of orders.
4. Optionally support query params (e.g. `limit`, `status`) and filter in the handler or in the lib.

---

## Test

- **Gap test:** `__tests__/gaps/orders-api.test.ts` — asserts that `app/api/orders/route.ts` exists and exports `GET`. Fails until the route is added.

---

## Status

Open.
