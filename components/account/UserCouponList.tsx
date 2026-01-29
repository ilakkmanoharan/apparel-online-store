"use client";

import type { UserCoupon } from "@/types/userCoupon";
import { formatPrice } from "@/lib/utils";

interface UserCouponListProps {
  coupons: UserCoupon[];
  onApply?: (code: string) => void;
  loading?: boolean;
}

export default function UserCouponList({ coupons, onApply, loading }: UserCouponListProps) {
  if (loading) return <div className="animate-pulse h-24 bg-gray-200 rounded" />;
  if (coupons.length === 0) return <p className="text-sm text-gray-500">You have no coupons.</p>;
  return (
    <ul className="space-y-3">
      {coupons.map((c) => (
        <li key={c.id} className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
          <div>
            <p className="font-mono font-medium text-gray-900">{c.code}</p>
            <p className="text-xs text-gray-500">
              {c.type === "percent" && `${c.value}% off`}
              {c.type === "fixed" && `${formatPrice(c.value)} off`}
              {c.type === "free_shipping" && "Free shipping"}
              {c.minOrder != null && ` · Min ${formatPrice(c.minOrder)}`}
            </p>
          </div>
          {onApply && (
            <button type="button" onClick={() => onApply(c.code)} className="text-sm font-medium text-blue-600 hover:underline">
              Use
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}
