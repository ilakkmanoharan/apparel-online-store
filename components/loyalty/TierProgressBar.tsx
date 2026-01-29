"use client";

import { getTierForPoints, LOYALTY_TIERS } from "@/lib/loyalty/tiers";
import type { LoyaltyTier } from "@/types/loyalty";
import { cn } from "@/lib/utils";

interface TierProgressBarProps {
  points: number;
  className?: string;
}

function getNextTierByPoints(points: number): { tier: LoyaltyTier; pointsNeeded: number } | null {
  const current = getTierForPoints(points);
  const idx = LOYALTY_TIERS.indexOf(current);
  const next = LOYALTY_TIERS[idx + 1];
  if (!next) return null;
  return { tier: next, pointsNeeded: next.minPoints - points };
}

export default function TierProgressBar({ points, className }: TierProgressBarProps) {
  const currentTier = getTierForPoints(points);
  const next = getNextTierByPoints(points);

  return (
    <div className={cn("space-y-2 text-sm", className)}>
      <div className="flex items-center justify-between">
        <span className="text-gray-600">Points</span>
        <span className="font-medium text-gray-900">{points.toLocaleString()}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-medium text-gray-900">{currentTier.name}</span>
        {next && (
          <span className="text-xs text-gray-500">
            {next.pointsNeeded.toLocaleString()} pts to {next.tier.name}
          </span>
        )}
      </div>
      {next && next.pointsNeeded > 0 && (
        <div className="h-2 overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full rounded-full bg-gray-900 transition-all"
            style={{
              width: `${Math.min(100, (points / next.tier.minPoints) * 100)}%`,
            }}
          />
        </div>
      )}
    </div>
  );
}
