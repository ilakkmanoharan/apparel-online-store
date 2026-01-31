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

/** One entry in the compact items array stored in Stripe session metadata. */
export interface CheckoutMetadataItem {
  productId: string;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
  price: number;
}
