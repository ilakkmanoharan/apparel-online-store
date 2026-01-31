# Issue 3: Stripe checkout session metadata not set — orders created as guest with empty items

**Scope:** ~2.5 hours (LLM or developer).

Checkout `POST /api/checkout/stripe` accepts `items` (and optionally `userId`, `shippingAddress`) but does **not** pass them in the Stripe Checkout Session `metadata`. The webhook expects `session.metadata.userId`, `metadata.items`, and `metadata.shippingAddress` to create the order. As a result, orders are created with `userId: "guest"` and empty `items`.

---

## Observed

- Client calls `POST /api/checkout/stripe` with `{ items, userId?, shippingAddress? }`.
- Stripe session is created **without** `metadata`.
- On `checkout.session.completed`, the webhook creates an order with `userId: "guest"` and `items: []`.

---

## Context

- **Location**: `app/api/checkout/stripe/route.ts` — `stripe.checkout.sessions.create()` call.
- **Effect**: Orders cannot be attributed to users; line items and shipping are lost.
- **Cause**: No `metadata` (or equivalent) passed when creating the session.

---

## Expected

- When creating the Checkout Session, set `metadata: { userId, items: JSON.stringify(items), shippingAddress: JSON.stringify(shippingAddress) }` (respect Stripe metadata size limits).
- Webhook already reads these; no webhook change required for this issue.

---

## Resolution

1. Extend the request body type to accept `userId?: string` and `shippingAddress?: Address`.
2. In `stripe.checkout.sessions.create()`, add `metadata` with `userId` (or `"guest"`), `items` (stringified), and `shippingAddress` (stringified) when provided.
3. Ensure payload stays within Stripe metadata limits (e.g. truncate or reference server-side data if needed).

---

## Test

- **Gap test:** `__tests__/gaps/checkout-stripe-metadata.test.ts` — asserts that `stripe.checkout.sessions.create` is called with `metadata` containing `userId`, `items`, `shippingAddress`. ✅ **19 tests passing**
- **Webhook test:** `__tests__/gaps/webhook-compact-items.test.ts` — asserts webhook correctly parses compact items and handles errors. ✅ **10 tests passing**

---

## Manual Verification Steps (E2E)

1. **POST checkout with test data:**
   ```bash
   curl -X POST http://localhost:3000/api/checkout/stripe \
     -H "Content-Type: application/json" \
     -d '{"items":[{"product":{"id":"test-product","name":"Test","price":29.99,"images":[],"category":"test","sizes":["S"],"colors":["Red"],"inStock":true,"stockCount":10,"description":""},"quantity":1,"selectedSize":"S","selectedColor":"Red"}],"userId":"user_123","shippingAddress":{"id":"a1","fullName":"Jane Doe","street":"123 Main St","city":"Boston","state":"MA","zipCode":"02101","country":"US","isDefault":true}}'
   ```

2. **Complete payment in Stripe test mode** using the returned checkout URL.

3. **Verify Firestore order document** has:
   - `userId`: "user_123" (not "guest")
   - `items`: Array with product details
   - `shippingAddress`: Full address object
   - `status`: "processing"
   - `paymentStatus`: "paid"

---

## Sign-off Checklist

| Phase | Description | Status |
|-------|-------------|--------|
| 1 | Core metadata pass-through (userId, items, shippingAddress) | ✅ |
| 4 | userId validation and "guest" default | ✅ |
| 5 | Stripe metadata size limits (500 chars per value) | ✅ |
| 6 | Compact items format for webhook parsing | ✅ |
| 7 | Success/cancel URL documentation and same-origin validation | ✅ |
| 8 | Warning logs for missing metadata | ✅ |
| 9 | Error handling for malformed metadata (needs_review status) | ✅ |
| 10 | Server-side product existence validation | ✅ |
| 11 | Stock validation (quantity vs stockCount) | ✅ |
| 12 | Price validation (prevent client manipulation) | ✅ |
| 13 | API contract documentation | ✅ |
| 14 | Shared CompactCartItem type for consistency | ✅ |
| 15 | Integration check and gap test | ✅ |

---

## Status

**✅ Resolved** — PR #13 merged 2026-01-31
