import type { Address } from "./index";

export type CheckoutStep = "shipping" | "payment" | "review";

export interface CheckoutState {
  step: CheckoutStep;
  shippingAddress: Address | null;
  shippingMethod: string | null;
  paymentMethodId: string | null;
  completedSteps: CheckoutStep[];
}

export interface CheckoutValidation {
  shipping: { valid: boolean; errors: string[] };
  payment: { valid: boolean; errors: string[] };
}

/**
 * Compact cart item format for Stripe metadata.
 *
 * Due to Stripe's 500-char limit per metadata value, we store items in
 * a compact format instead of full CartItem objects. This type is used:
 * - In checkout route when building metadata.items
 * - In webhook (orders.ts) when parsing metadata.items
 *
 * The webhook expands these back to full CartItem by fetching product
 * details from the database. Price is preserved from checkout time.
 *
 * @see app/api/checkout/stripe/route.ts - Checkout session creation
 * @see lib/firebase/orders.ts - Webhook order creation
 */
export interface CompactCartItem {
  /** Product ID to fetch full details from database */
  productId: string;
  /** Quantity ordered */
  quantity: number;
  /** Selected size variant */
  selectedSize: string;
  /** Selected color variant */
  selectedColor: string;
  /** Price at checkout time (server-authoritative) */
  price: number;
}
