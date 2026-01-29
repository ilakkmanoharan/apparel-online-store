"use client";

import type { SpendTierId } from "@/types/loyalty";
import { cn } from "@/lib/utils";

const TIER_STYLES: Record<SpendTierId, string> = {
  bronze: "bg-amber-100 text-amber-800 border-amber-200",
  silver: "bg-gray-100 text-gray-800 border-gray-200",
  gold: "bg-yellow-100 text-yellow-800 border-yellow-200",
  platinum: "bg-slate-200 text-slate-900 border-slate-300",
};

const TIER_LABELS: Record<SpendTierId, string> = {
  bronze: "Bronze",
  silver: "Silver",
  gold: "Gold",
  platinum: "Platinum",
};

interface TierBadgeProps {
  tierId: SpendTierId;
  className?: string;
}

export default function TierBadge({ tierId, className }: TierBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize",
        TIER_STYLES[tierId],
        className
      )}
    >
      {TIER_LABELS[tierId]}
    </span>
  );
}
