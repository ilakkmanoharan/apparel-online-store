/**
 * Restore inventory for refunded order line items.
 * Called from Stripe webhook on charge.refunded (full refund).
 *
 * For each item in the order:
 * 1. Get current product stock from Firestore
 * 2. Calculate new stock (current + quantity)
 * 3. Update product document with new stockCount and inStock flag
 *
 * This reverses the deduction done when the order was placed.
 *
 * @see lib/inventory/deduct.ts - Inventory deduction on checkout
 * @see lib/firebase/orders.ts - Refund webhook handler
 *
 * @throws Error if Firestore update fails (caller should handle)
 */
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import type { CartItem } from "@/types";

export interface RestoreResult {
  productId: string;
  previousStock: number;
  restored: number;
  newStock: number;
}

/**
 * Restore inventory for all items in an order.
 * Called after a full refund to return stock to inventory.
 *
 * @param items - Cart items from the refunded order
 * @returns Array of restore results for each item
 * @throws Error if any Firestore operation fails
 */
export async function restoreForOrder(items: CartItem[]): Promise<RestoreResult[]> {
  const results: RestoreResult[] = [];

  for (const item of items) {
    const productId = item.product.id;
    const quantity = item.quantity;

    // Get current product stock
    const productRef = doc(db, "products", productId);
    const productSnap = await getDoc(productRef);

    if (!productSnap.exists()) {
      // Product may have been deleted; log and skip
      console.warn(
        `[inventory] Product not found for restore: ${productId}; skipping`
      );
      continue;
    }

    const productData = productSnap.data();
    const previousStock = productData.stockCount ?? 0;
    const newStock = previousStock + quantity;

    // Update product stock
    await updateDoc(productRef, {
      stockCount: newStock,
      inStock: newStock > 0,
      updatedAt: new Date(),
    });

    results.push({
      productId,
      previousStock,
      restored: quantity,
      newStock,
    });

    console.log(
      `[inventory] Restored ${quantity} to product ${productId}: ${previousStock} -> ${newStock}`
    );
  }

  return results;
}
