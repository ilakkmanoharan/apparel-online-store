"use client";

import LocaleLink from "@/components/common/LocaleLink";
import { formatPrice } from "@/lib/utils";
import { Order } from "@/types";

interface OrderListProps {
  orders: Order[];
  loading: boolean;
}

export default function OrderList({ orders, loading }: OrderListProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-gray-100 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12 text-gray-600">
        <p className="mb-4">You haven&apos;t placed any orders yet.</p>
        <LocaleLink href="/" className="text-gray-900 underline font-medium">
          Start Shopping
        </LocaleLink>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-gray-200">
      {orders.map((order) => (
        <li key={order.id} className="py-4">
          <LocaleLink
            href={`/account/orders/${order.id}`}
            className="flex flex-wrap items-center justify-between gap-4 hover:bg-gray-50 -mx-2 px-2 py-2 rounded"
          >
            <div>
              <p className="font-medium text-gray-900">Order #{order.id.slice(0, 8)}</p>
              <p className="text-sm text-gray-500">
                {new Date(order.createdAt).toLocaleDateString()} · {order.items.length} item
                {order.items.length !== 1 ? "s" : ""}
              </p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-900">{formatPrice(order.total)}</p>
              <p className="text-sm text-gray-500 capitalize">{order.status}</p>
            </div>
          </LocaleLink>
        </li>
      ))}
    </ul>
  );
}
