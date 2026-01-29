"use client";

import { getTierBySpend, getNextTierSpend } from "@/lib/loyalty/spend";
import type { SpendTier } from "@/types/loyalty";
import TierBadge from "./TierBadge";
import { cn } from "@/lib/utils";

interface SpendProgressProps {
  lifetimeSpend: number;
  className?: string;
}

export default function SpendProgress({ lifetimeSpend, className }: SpendProgressProps) {
  const currentTier = getTierBySpend(lifetimeSpend);
  const next = getNextTierSpend(lifetimeSpend);

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-600">Lifetime spend</span>
        <span className="font-medium text-gray-900">${lifetimeSpend.toFixed(0)}</span>
      </div>
      <div className="flex items-center gap-2">
        <TierBadge tierId={currentTier.id} />
        {next && (
          <span className="text-xs text-gray-500">
            ${next.spendNeeded.toFixed(0)} to {next.tier.name}
          </span>
        )}
      </div>
      {next && (
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gray-900 rounded-full transition-all"
            style={{
              width: `${Math.min(100, (lifetimeSpend / next.tier.minSpend) * 100)}%`,
            }}
          />
        </div>
      )}
    </div>
  );
}
