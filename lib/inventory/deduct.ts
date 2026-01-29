/**
 * Deduct inventory for order line items.
 * Called from Stripe webhook on checkout.session.completed.
 * GAP: Implement actual Firestore/product stock updates (~2.5h). See issues/issue4.
 */
import type { CartItem } from "@/types";

export async function deductForOrder(items: CartItem[]): Promise<void> {
  // TODO: For each item, decrement product/variant stock in Firestore.
  // Avoid oversell: check stock before deducting; fail or partial-deduct if insufficient.
  await Promise.resolve(items);
}
