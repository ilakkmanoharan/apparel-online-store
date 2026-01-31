/**
 * Deduct inventory for order line items.
 * Called from Stripe webhook on checkout.session.completed.
 *
 * For each item in the order:
 * 1. Get current product stock from Firestore
 * 2. Calculate new stock (current - quantity)
 * 3. Update product document with new stockCount and inStock flag
 *
 * If stock goes negative (oversold), we still update but log a warning.
 * The order is already paid, so we don't fail the deduction.
 *
 * @throws Error if Firestore update fails (caller should handle)
 */
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import type { CartItem } from "@/types";

export interface DeductionResult {
  productId: string;
  previousStock: number;
  deducted: number;
  newStock: number;
  oversold: boolean;
}

/**
 * Deduct inventory for all items in an order.
 * @param items - Cart items from the order
 * @returns Array of deduction results for each item
 * @throws Error if any Firestore operation fails
 */
export async function deductForOrder(items: CartItem[]): Promise<DeductionResult[]> {
  const results: DeductionResult[] = [];

  for (const item of items) {
    const productId = item.product.id;
    const quantity = item.quantity;

    // Get current product stock
    const productRef = doc(db, "products", productId);
    const productSnap = await getDoc(productRef);

    if (!productSnap.exists()) {
      console.warn(
        `[inventory] Product not found for deduction: ${productId}; skipping`
      );
      continue;
    }

    const productData = productSnap.data();
    const previousStock = productData.stockCount ?? 0;
    const newStock = previousStock - quantity;
    const oversold = newStock < 0;

    if (oversold) {
      console.warn(
        `[inventory] Oversold product ${productId}: previous=${previousStock}, deducted=${quantity}, new=${newStock}`
      );
    }

    // Update product stock
    await updateDoc(productRef, {
      stockCount: newStock,
      inStock: newStock > 0,
      updatedAt: new Date(),
    });

    results.push({
      productId,
      previousStock,
      deducted: quantity,
      newStock,
      oversold,
    });

    console.log(
      `[inventory] Deducted ${quantity} from product ${productId}: ${previousStock} -> ${newStock}`
    );
  }

  return results;
}
