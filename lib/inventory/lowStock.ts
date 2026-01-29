import { DEFAULT_LOW_STOCK_THRESHOLD } from "@/types/inventory";

/**
 * Returns true when quantity is positive but at or below threshold.
 */
export function isLowStock(
  quantity: number,
  threshold: number = DEFAULT_LOW_STOCK_THRESHOLD
): boolean {
  return quantity > 0 && quantity <= threshold;
}

/**
 * Returns a user-facing message for low stock, or null if not low stock.
 */
export function getLowStockMessage(
  quantity: number,
  threshold: number = DEFAULT_LOW_STOCK_THRESHOLD
): string | null {
  if (!isLowStock(quantity, threshold)) return null;
  if (quantity === 1) return "Only 1 left in stock.";
  return `Only ${quantity} left in stock.`;
}
