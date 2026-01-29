# Issue 4: Inventory not decremented on order completion (webhook)

**Scope:** ~2.5 hours (LLM or developer).

On `checkout.session.completed`, the webhook creates/updates the order in Firestore but does **not** decrement product/variant stock. There is no call to an inventory-deduction function from the webhook.

---

## Observed

- User completes checkout; webhook creates order with correct items.
- Product/variant stock in Firestore (or inventory store) is **unchanged**; oversell is possible.

---

## Context

- **Location**: `lib/firebase/orders.ts` — `createOrUpdateOrderFromCheckoutSession`; `lib/inventory/deduct.ts` (stub exists).
- **Effect**: Stock counts do not reflect sales; risk of overselling.
- **Cause**: Webhook never calls a deduct function after creating the order.

---

## Expected

- After creating/updating the order, call `deductForOrder(items)` (or equivalent) so product/variant stock is decremented.
- Handle insufficient stock (e.g. fail safely or partial deduct and flag).

---

## Resolution

1. **Implement** `lib/inventory/deduct.ts` — `deductForOrder(items: CartItem[])`: for each item, decrement the product’s (and optionally variant’s) stock in Firestore. Use a transaction or conditional update to avoid oversell.
2. **Wire webhook:** In `createOrUpdateOrderFromCheckoutSession`, after `setDoc`, call `await deductForOrder(items)` (items are already parsed from `session.metadata.items`).
3. **Edge cases:** If stock is insufficient, either throw (webhook retries) or record and continue; document behavior.

---

## Test

- **Gap test:** `__tests__/gaps/webhook-inventory-deduction.test.ts` — mocks `deductForOrder` and asserts it is called with the session’s parsed items when `checkout.session.completed` is handled. Fails until the webhook calls `deductForOrder`.

---

## Status

Open.
