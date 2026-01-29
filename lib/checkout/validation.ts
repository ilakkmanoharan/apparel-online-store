import type { Address } from "@/types";

export interface ShippingValidation {
  valid: boolean;
  errors: string[];
}

export function validateShippingAddress(address: Address | null): ShippingValidation {
  const errors: string[] = [];
  if (!address) return { valid: false, errors: ["Shipping address is required."] };
  if (!address.fullName?.trim()) errors.push("Full name is required.");
  if (!address.street?.trim()) errors.push("Street address is required.");
  if (!address.city?.trim()) errors.push("City is required.");
  if (!address.state?.trim()) errors.push("State is required.");
  if (!address.zipCode?.trim()) errors.push("ZIP code is required.");
  if (!address.country?.trim()) errors.push("Country is required.");
  return { valid: errors.length === 0, errors };
}

export function validatePaymentMethod(paymentMethodId: string | null): { valid: boolean; errors: string[] } {
  if (!paymentMethodId?.trim()) return { valid: false, errors: ["Payment method is required."] };
  return { valid: true, errors: [] };
}
