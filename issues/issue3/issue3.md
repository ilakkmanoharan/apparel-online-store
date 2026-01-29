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

- **Gap test:** `__tests__/gaps/checkout-stripe-metadata.test.ts` — asserts that `stripe.checkout.sessions.create` is called with `metadata` containing `userId`, `items`, `shippingAddress`. Fails until this issue is fixed.

---

## Status

Open.
