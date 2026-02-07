"use client";

import LocaleLink from "@/components/common/LocaleLink";
import type { Order } from "@/types";
import OrderStatusBadge from "./OrderStatusBadge";
import TrackingInfo from "./TrackingInfo";
import ReorderButton from "./ReorderButton";

interface OrderCardProps {
  order: Order;
}

export default function OrderCard({ order }: OrderCardProps) {
  const createdLabel = order.createdAt.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <article className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4 text-sm">
      <header className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-gray-600">Order</span>
            <LocaleLink
              href={`/account/orders/${order.id}`}
              className="font-mono text-xs text-gray-900 underline"
            >
              #{order.id.slice(0, 8)}
            </LocaleLink>
          </div>
          <p className="text-gray-500">Placed on {createdLabel}</p>
        </div>
        <OrderStatusBadge status={order.status} />
      </header>

      <TrackingInfo orderId={order.id} />

      <footer className="mt-2 flex items-center justify-between gap-4">
        <p className="text-gray-700">
          <span className="font-medium">
            {order.items.reduce((count, item) => count + item.quantity, 0)} item
            {order.items.length !== 1 ? "s" : ""}
          </span>{" "}
          • Total{" "}
          <span className="font-semibold">
            ${order.total.toFixed(2)}
          </span>
        </p>
        <div className="flex items-center gap-2">
          <LocaleLink
            href={`/account/orders/${order.id}`}
            className="text-xs font-medium text-gray-900 underline"
          >
            View details
          </LocaleLink>
          <ReorderButton order={order} />
        </div>
      </footer>
    </article>
  );
}

