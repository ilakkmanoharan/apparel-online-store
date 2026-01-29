"use client";

import type { SpendTier } from "@/types/loyalty";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import TierBadge from "./TierBadge";

interface PlatinumBenefitsProps {
  tier: SpendTier;
  className?: string;
}

export default function PlatinumBenefits({ tier, className = "" }: PlatinumBenefitsProps) {
  return (
    <div className={className}>
      <div className="flex items-center gap-2 mb-2">
        <TierBadge tierId={tier.id} />
        <span className="text-sm font-medium text-gray-900">{tier.name} benefits</span>
      </div>
      <ul className="space-y-1.5">
        {tier.benefits.map((benefit, i) => (
          <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
            <CheckCircleIcon className="w-4 h-4 text-green-600 flex-shrink-0" />
            {benefit}
          </li>
        ))}
      </ul>
      {tier.freeShipping && (
        <p className="mt-2 text-sm font-medium text-green-700">Free shipping on all orders.</p>
      )}
    </div>
  );
}
