"use client";

import { TruckIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";

interface FreeShippingBannerProps {
  eligible: boolean;
  message?: string;
  className?: string;
}

export default function FreeShippingBanner({ eligible, message, className }: FreeShippingBannerProps) {
  if (!eligible) return null;
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-lg bg-green-50 border border-green-200 px-3 py-2 text-sm text-green-800",
        className
      )}
    >
      <TruckIcon className="w-5 h-5 flex-shrink-0" />
      <span>{message ?? "You qualify for free shipping as a Gold/Platinum member."}</span>
    </div>
  );
}
