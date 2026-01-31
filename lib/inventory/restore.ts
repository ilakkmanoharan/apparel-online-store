/**
 * Restore inventory for refunded order line items.
 * Called from Stripe webhook on charge.refunded (full refund only).
 * Each item is restored inside its own transaction for consistency with deduct.ts.
 * Throws if the product document does not exist; caller should log and flag the order.
 */
import { db } from "@/lib/firebase/config";
import { doc, runTransaction } from "firebase/firestore";
import type { CartItem } from "@/types";

export async function restoreForOrder(orderId: string, items: CartItem[]): Promise<void> {
  for (const item of items) {
    await runTransaction(db, async (transaction) => {
      const productRef = doc(db, "products", item.product.id);
      const productSnap = await transaction.get(productRef);

      if (!productSnap.exists()) {
        throw new Error(
          `[restore] Product ${item.product.id} not found during restore for order ${orderId}`
        );
      }

      const currentStock = productSnap.data().stockCount ?? 0;
      const newStock = currentStock + item.quantity;
      transaction.update(productRef, {
        stockCount: newStock,
        inStock: true,
      });
    });
  }
}
