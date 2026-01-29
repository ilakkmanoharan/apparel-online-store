"use client";

import type { ReturnRequest } from "@/types/returns";
import ReturnStatusBadge from "@/components/returns/ReturnStatusBadge";
import { formatPrice } from "@/lib/utils";

interface ReturnDetailProps {
  returnRequest: ReturnRequest;
}

export default function ReturnDetail({ returnRequest: r }: ReturnDetailProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-start">
        <h2 className="text-lg font-semibold">Return #{r.id.slice(-8)}</h2>
        <ReturnStatusBadge status={r.status} />
      </div>
      <p className="text-sm text-gray-500">Order #{r.orderId.slice(-8)}</p>
      <p className="text-sm text-gray-500">Requested {new Date(r.createdAt).toLocaleDateString()}</p>
      {r.refundAmount != null && (
        <p className="font-medium">Refund amount: {formatPrice(r.refundAmount)}</p>
      )}
      {r.trackingNumber && (
        <p className="text-sm">Tracking: {r.trackingNumber}</p>
      )}
      {r.labelUrl && (
        <a href={r.labelUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
          Print return label
        </a>
      )}
      <div>
        <h3 className="font-medium mt-4 mb-2">Items</h3>
        <ul className="list-disc list-inside text-sm text-gray-600">
          {r.items.map((item, i) => (
            <li key={i}>
              Product {item.productId} · {item.variantKey} · Qty {item.quantity} · {item.reason}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
