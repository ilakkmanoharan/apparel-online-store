# Issue 10: Add/remove payment method API missing — only list exists

**Scope:** ~2.5 hours (LLM or developer).

Only `app/api/payment-methods/list/route.ts` exists. There is **no** API to add a new card or remove a saved payment method. Account “Payment methods” page cannot support “Add card” or “Remove” without these endpoints.

---

## Observed

- `GET /api/payment-methods/list` works for listing saved methods.
- No `POST /api/payment-methods` to add a card (e.g. Stripe SetupIntent or PaymentMethod attach).
- No `DELETE /api/payment-methods/:id` to remove a saved method.

---

## Context

- **Location**: Missing `app/api/payment-methods/route.ts` (POST) and `app/api/payment-methods/[id]/route.ts` (DELETE); list at `app/api/payment-methods/list/route.ts`; Stripe helpers in `lib/stripe/`.
- **Effect**: Users cannot add or remove saved payment methods via the app.
- **Cause**: Only list endpoint was implemented.

---

## Expected

- **POST /api/payment-methods:** Accepts payload (e.g. payment_method_id or Stripe PM id), associates with current user’s Stripe customer, returns 200 or the created/attached method.
- **DELETE /api/payment-methods/:id:** Detaches or deletes the payment method for the current user; returns 204 or 200.

---

## Resolution

1. **POST:** Add `app/api/payment-methods/route.ts` (or extend if a single file serves both list and create). Resolve current user and Stripe customer ID; create or attach PaymentMethod (Stripe API); persist association; return success.
2. **DELETE:** Add `app/api/payment-methods/[id]/route.ts`. Resolve current user; verify the method belongs to the user’s customer; detach or delete via Stripe; return 204.
3. Reuse `lib/stripe/saved-methods.ts` and `lib/stripe/customers.ts` where applicable; ensure idempotency and auth checks.

---

## Test

- **Gap test:** `__tests__/gaps/payment-methods-crud.test.ts` — asserts that `app/api/payment-methods/route.ts` exists with `POST` and `app/api/payment-methods/[id]/route.ts` exists with `DELETE`. Fails until both are added.

---

## Status

Open.
