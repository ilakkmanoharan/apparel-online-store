import type { CartItem } from "@/types";
import type { CartValidationResult, CartValidationItem } from "@/types/cart";

const MAX_QUANTITY = 10;

export function validateCart(items: CartItem[]): CartValidationResult {
  const resultItems: CartValidationItem[] = [];
  const errors: string[] = [];

  for (const item of items) {
    let valid = true;
    let error: CartValidationItem["error"];

    if (item.quantity > MAX_QUANTITY) {
      valid = false;
      error = "max_quantity";
      errors.push(`${item.product.name}: max quantity is ${MAX_QUANTITY}`);
    } else if (!item.product.inStock) {
      valid = false;
      error = "out_of_stock";
      errors.push(`${item.product.name}: out of stock`);
    } else if (item.product.stockCount < item.quantity) {
      valid = false;
      error = "out_of_stock";
      errors.push(`${item.product.name}: only ${item.product.stockCount} available`);
    }

    resultItems.push({ item, valid: valid ?? true, error });
  }

  return {
    valid: errors.length === 0,
    items: resultItems,
    errors,
  };
}
