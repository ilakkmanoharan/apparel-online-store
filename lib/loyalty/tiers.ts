import type { LoyaltyTier, LoyaltyTierId } from "@/types/loyalty";

export const LOYALTY_TIERS: LoyaltyTier[] = [
  { id: "bronze", name: "Bronze", minPoints: 0, benefits: ["1x points"], multiplier: 1 },
  { id: "silver", name: "Silver", minPoints: 500, benefits: ["1.25x points", "Birthday reward"], multiplier: 1.25 },
  { id: "gold", name: "Gold", minPoints: 2000, benefits: ["1.5x points", "Free shipping", "Early access"], multiplier: 1.5 },
  { id: "platinum", name: "Platinum", minPoints: 5000, benefits: ["2x points", "Free shipping", "Early access", "Dedicated support"], multiplier: 2 },
];

export function getTierForPoints(points: number): LoyaltyTier {
  let tier = LOYALTY_TIERS[0];
  for (const t of LOYALTY_TIERS) {
    if (points >= t.minPoints) tier = t;
  }
  return tier;
}

export function getTierById(id: LoyaltyTierId): LoyaltyTier | undefined {
  return LOYALTY_TIERS.find((t) => t.id === id);
}

export function getTierBenefits(tierId: LoyaltyTierId): string[] {
  const tier = getTierById(tierId);
  return tier?.benefits ?? [];
}
