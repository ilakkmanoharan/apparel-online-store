import type { SpendTier } from "@/types/loyalty";

/** Spend thresholds (USD) for tier. Platinum = free shipping. */
export const SPEND_TIERS: SpendTier[] = [
  { id: "bronze", name: "Bronze", minSpend: 0, freeShipping: false, benefits: ["1x points"] },
  { id: "silver", name: "Silver", minSpend: 500, freeShipping: false, benefits: ["1.25x points", "Birthday reward"] },
  { id: "gold", name: "Gold", minSpend: 2000, freeShipping: true, benefits: ["1.5x points", "Free shipping", "Early access"] },
  { id: "platinum", name: "Platinum", minSpend: 5000, freeShipping: true, benefits: ["2x points", "Free shipping", "Early access", "Dedicated support"] },
];

export const FREE_SHIPPING_TIERS = ["gold", "platinum"] as const;
export const PLATINUM_MIN_SPEND = 5000;
