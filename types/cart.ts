import type { CartItem } from "./index";

export interface CartTotals {
  subtotal: number;
  shippingEstimate: number;
  taxEstimate: number;
  discount: number;
  total: number;
}

export interface CartValidationItem {
  item: CartItem;
  valid: boolean;
  error?: "out_of_stock" | "max_quantity" | "unavailable";
}

export interface CartValidationResult {
  valid: boolean;
  items: CartValidationItem[];
  errors: string[];
}
