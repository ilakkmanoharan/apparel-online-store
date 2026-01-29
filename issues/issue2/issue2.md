# Issue 2: Stripe checkout session metadata not passed — orders created as guest with empty items

Checkout calls `/api/checkout/stripe` with items and shipping address but does **not** pass `userId`, `items`, or `shippingAddress` in the Stripe session `metadata`. The webhook expects `session.metadata.userId`, `metadata.items`, and `metadata.shippingAddress` to create the order. As a result, orders are created with `userId: "guest"` and empty `items`.

---

## Observed

- User completes checkout (logged in or guest); payment succeeds in Stripe.
- In Firestore, the created order has:
  - `userId: "guest"` (even when the user was logged in).
  - `items: []` or missing/incomplete line items.
  - Shipping address may be missing or wrong.
- Order history and admin order view show incorrect or empty order data.

---

## Context

- **Location**: Checkout flow → `app/api/checkout/stripe` (or equivalent) when creating the Stripe Checkout Session; webhook that handles `checkout.session.completed` and creates the order in Firestore.
- **Effect**: Orders cannot be attributed to users; line items and shipping are lost; fulfillment and support are broken.
- **Cause**: Session creation does not set `metadata: { userId, items, shippingAddress }` (or equivalent) on the Stripe session; webhook reads from `session.metadata` and falls back to guest/empty when missing.

---

## Expected

- On creating the Checkout Session, include in `metadata` (or in line items / shipping as appropriate):
  - `userId` (current user ID or a stable guest id).
  - Serialized `items` (product ids, quantities, sizes, colors, prices) so the webhook can recreate the order.
  - `shippingAddress` (or enough to persist shipping on the order).
- Webhook uses this metadata to create the Firestore order with correct `userId`, `items`, and shipping.

---

## Resolution (suggested)

1. **Set metadata when creating the Stripe session**  
   In the route that creates the Checkout Session, add `metadata` (and ensure payload size stays within Stripe’s metadata limits). Include `userId`; for `items` and `shippingAddress`, use JSON.stringify and ensure the webhook parses them safely.

2. **Webhook: read metadata and create order**  
   In `checkout.session.completed` handler, read `session.metadata.userId`, `metadata.items`, `metadata.shippingAddress`; validate and then create/update the order in Firestore with full line items and shipping.

3. **Edge cases**  
   Handle missing metadata (e.g. old sessions) with a clear fallback or error path; avoid silently saving orders with empty items.

---

## Status

Open. Stripe session metadata not yet wired; orders created as guest with empty items.
