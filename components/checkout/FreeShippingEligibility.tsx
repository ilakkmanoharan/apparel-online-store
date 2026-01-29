"use client";

import FreeShippingBanner from "@/components/loyalty/FreeShippingBanner";
import { isFreeShippingEligible } from "@/lib/loyalty/spend";
import type { SpendTierId } from "@/types/loyalty";

interface FreeShippingEligibilityProps {
  tierId: SpendTierId | null;
  subtotal: number;
  freeShippingThreshold?: number;
  className?: string;
}

export default function FreeShippingEligibility({
  tierId,
  subtotal,
  freeShippingThreshold = 75,
  className = "",
}: FreeShippingEligibilityProps) {
  const eligibleByTier = tierId ? isFreeShippingEligible(tierId) : false;
  const eligibleByThreshold = subtotal >= freeShippingThreshold;
  const eligible = eligibleByTier || eligibleByThreshold;
  const message = eligibleByTier
    ? "Free shipping applied (Gold/Platinum)."
    : eligibleByThreshold
      ? "You've qualified for free standard shipping."
      : undefined;
  return <FreeShippingBanner eligible={!!eligible} message={message} className={className} />;
}
