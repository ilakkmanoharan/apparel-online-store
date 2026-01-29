import type { ReturnItem, ReturnReason } from "@/types/returns";

const ELIGIBLE_DAYS = 30;

export function validateReturnEligibility(
  orderDate: Date,
  itemCount: number
): { eligible: boolean; message?: string } {
  const now = new Date();
  const daysSince = Math.floor((now.getTime() - new Date(orderDate).getTime()) / (1000 * 60 * 60 * 24));
  if (daysSince > ELIGIBLE_DAYS) {
    return { eligible: false, message: `Returns must be requested within ${ELIGIBLE_DAYS} days of delivery.` };
  }
  if (itemCount < 1) {
    return { eligible: false, message: "Select at least one item to return." };
  }
  return { eligible: true };
}

export function isValidReturnReason(reason: string): reason is ReturnReason {
  return [
    "wrong_size",
    "wrong_item",
    "defective",
    "not_as_described",
    "changed_mind",
    "other",
  ].includes(reason);
}

export function validateReturnItems(items: ReturnItem[]): { valid: boolean; message?: string } {
  if (!items.length) return { valid: false, message: "No items selected." };
  for (const item of items) {
    if (!isValidReturnReason(item.reason)) {
      return { valid: false, message: `Invalid reason for item: ${item.productId}` };
    }
    if (item.quantity < 1) return { valid: false, message: "Quantity must be at least 1." };
  }
  return { valid: true };
}
