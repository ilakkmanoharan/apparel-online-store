"use client";

import LocaleLink from "@/components/common/LocaleLink";
import type { ReturnRequest } from "@/types/returns";
import ReturnStatusBadge from "@/components/returns/ReturnStatusBadge";
import { formatPrice } from "@/lib/utils";

interface ReturnListProps {
  returns: ReturnRequest[];
}

export default function ReturnList({ returns }: ReturnListProps) {
  if (returns.length === 0) {
    return (
      <div className="text-center py-12 text-gray-600">
        <p>You have no returns.</p>
        <LocaleLink href="/account/orders" className="mt-4 inline-block text-blue-600 underline">
          View orders
        </LocaleLink>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-gray-200">
      {returns.map((r) => (
        <li key={r.id} className="py-4">
          <LocaleLink href={`/account/orders/${r.orderId}`} className="block hover:bg-gray-50 -mx-4 px-4 py-2 rounded">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium text-gray-900">Return #{r.id.slice(-8)}</p>
                <p className="text-sm text-gray-500">Order #{r.orderId.slice(-8)}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(r.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <ReturnStatusBadge status={r.status} />
                {r.refundAmount != null && (
                  <p className="text-sm font-medium text-gray-900 mt-2">{formatPrice(r.refundAmount)}</p>
                )}
              </div>
            </div>
          </LocaleLink>
        </li>
      ))}
    </ul>
  );
}
