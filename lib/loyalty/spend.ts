import type { SpendTier, SpendTierId } from "@/types/loyalty";
import { SPEND_TIERS } from "./constants";

export function getTierBySpend(spend: number): SpendTier {
  let tier = SPEND_TIERS[0];
  for (const t of SPEND_TIERS) {
    if (spend >= t.minSpend) tier = t;
  }
  return tier;
}

export function getSpendTierById(id: SpendTierId): SpendTier | undefined {
  return SPEND_TIERS.find((t) => t.id === id);
}

export function isFreeShippingEligible(tierId: SpendTierId): boolean {
  const tier = getSpendTierById(tierId);
  return tier?.freeShipping ?? false;
}

export function isPlatinum(tierId: SpendTierId): boolean {
  return tierId === "platinum";
}

export function getNextTierSpend(currentSpend: number): { tier: SpendTier; spendNeeded: number } | null {
  const current = getTierBySpend(currentSpend);
  const nextTier = SPEND_TIERS[SPEND_TIERS.indexOf(current) + 1];
  if (!nextTier) return null;
  return { tier: nextTier, spendNeeded: nextTier.minSpend - currentSpend };
}
