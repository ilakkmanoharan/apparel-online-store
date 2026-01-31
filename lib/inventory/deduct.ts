/**
 * Deduct inventory for order line items.
 * Called from Stripe webhook on checkout.session.completed.
 * Each item is deducted inside its own transaction to prevent oversell.
 * Throws on the first item that cannot be fulfilled; caller should mark
 * the order as needs_review rather than deleting it.
 */
import { db } from "@/lib/firebase/config";
import { doc, runTransaction } from "firebase/firestore";
import type { CartItem } from "@/types";

export async function deductForOrder(orderId: string, items: CartItem[]): Promise<void> {
  for (const item of items) {
    await runTransaction(db, async (transaction) => {
      const productRef = doc(db, "products", item.product.id);
      const productSnap = await transaction.get(productRef);

      if (!productSnap.exists()) {
        throw new Error(
          `[deduct] Product ${item.product.id} not found during deduction for order ${orderId}`
        );
      }

      const currentStock = productSnap.data().stockCount ?? 0;
      if (currentStock < item.quantity) {
        throw new Error(
          `[deduct] Insufficient stock for product ${item.product.id}: have ${currentStock}, need ${item.quantity} (order ${orderId})`
        );
      }

      const newStock = currentStock - item.quantity;
      transaction.update(productRef, {
        stockCount: newStock,
        inStock: newStock > 0,
      });
    });
  }
}
