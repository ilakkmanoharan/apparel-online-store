"use client";

import Button from "@/components/common/Button";
import type { RewardOption } from "@/lib/loyalty/rewards";
import { cn } from "@/lib/utils";

interface RewardTileProps {
  reward: RewardOption;
  pointsBalance: number;
  onRedeem?: (rewardId: string) => void;
  loading?: boolean;
  className?: string;
}

export default function RewardTile({
  reward,
  pointsBalance,
  onRedeem,
  loading = false,
  className,
}: RewardTileProps) {
  const canRedeem = pointsBalance >= reward.pointsCost;

  return (
    <div
      className={cn(
        "flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3 text-sm",
        className
      )}
    >
      <div>
        <p className="font-medium text-gray-900">{reward.name}</p>
        <p className="text-xs text-gray-500">{reward.pointsCost} points</p>
      </div>
      {onRedeem && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={!canRedeem || loading}
          onClick={() => onRedeem(reward.id)}
        >
          {loading ? "…" : canRedeem ? "Redeem" : "Not enough points"}
        </Button>
      )}
    </div>
  );
}
