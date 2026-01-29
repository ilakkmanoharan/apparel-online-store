import { getPointsBalance } from "@/lib/loyalty/points";

export interface RewardOption {
  id: string;
  name: string;
  pointsCost: number;
  type: "discount" | "free_shipping" | "gift";
}

export const REWARD_OPTIONS: RewardOption[] = [
  { id: "10off", name: "$10 off", pointsCost: 500, type: "discount" },
  { id: "25off", name: "$25 off", pointsCost: 1000, type: "discount" },
  { id: "freeship", name: "Free shipping", pointsCost: 250, type: "free_shipping" },
];

export async function getEligibleRewards(userId: string): Promise<RewardOption[]> {
  const balance = await getPointsBalance(userId);
  const points = balance?.points ?? 0;
  return REWARD_OPTIONS.filter((r) => r.pointsCost <= points);
}
