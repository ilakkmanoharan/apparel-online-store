"use client";

import type { UserCoupon } from "@/types/userCoupon";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface UserCouponCardProps {
  coupon: UserCoupon;
  onUse?: (code: string) => void;
  disabled?: boolean;
  className?: string;
}

function getDiscountLabel(coupon: UserCoupon): string {
  if (coupon.type === "percent") return `${coupon.value}% off`;
  if (coupon.type === "fixed") return `${formatPrice(coupon.value)} off`;
  if (coupon.type === "free_shipping") return "Free shipping";
  return "Discount";
}

export default function UserCouponCard({
  coupon,
  onUse,
  disabled = false,
  className,
}: UserCouponCardProps) {
  const label = getDiscountLabel(coupon);
  const expired = coupon.expiresAt ? new Date() > coupon.expiresAt : false;

  return (
    <div
      className={cn(
        "flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3 text-sm",
        (expired || disabled) && "opacity-60",
        className
      )}
    >
      <div>
        <p className="font-mono font-medium text-gray-900">{coupon.code}</p>
        <p className="text-xs text-gray-500">
          {label}
          {coupon.minOrder != null && ` · Min ${formatPrice(coupon.minOrder)}`}
          {coupon.expiresAt && (
            <> · Expires {new Date(coupon.expiresAt).toLocaleDateString()}</>
          )}
        </p>
      </div>
      {onUse && !expired && (
        <button
          type="button"
          onClick={() => onUse(coupon.code)}
          disabled={disabled}
          className="text-sm font-medium text-blue-600 hover:underline disabled:opacity-50"
        >
          Use
        </button>
      )}
    </div>
  );
}
