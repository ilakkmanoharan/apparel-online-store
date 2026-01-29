import type { ShippingOption } from "@/types/shipping";

export const SHIPPING_TYPES = ["standard", "express", "overnight", "pickup"] as const;

export const DEFAULT_SHIPPING_OPTIONS: Omit<ShippingOption, "id">[] = [
  { type: "standard", name: "Standard", description: "5–7 business days", price: 0, minDays: 5, maxDays: 7 },
  { type: "express", name: "Express", description: "2–3 business days", price: 9.99, minDays: 2, maxDays: 3 },
  { type: "overnight", name: "Overnight", description: "Next business day", price: 24.99, minDays: 1, maxDays: 1, cutoffTime: "14:00" },
];

export const FREE_SHIPPING_THRESHOLD = 75;
