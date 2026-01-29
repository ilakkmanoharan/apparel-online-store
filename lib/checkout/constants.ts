export const CHECKOUT_STEPS = ["shipping", "payment", "review"] as const;
export type CheckoutStepId = (typeof CHECKOUT_STEPS)[number];

export const STEP_LABELS: Record<CheckoutStepId, string> = {
  shipping: "Shipping",
  payment: "Payment",
  review: "Review",
};
