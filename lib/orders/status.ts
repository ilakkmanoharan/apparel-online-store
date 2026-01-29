import type { Order } from "@/types";
import type { OrderStatus, OrderTimelineEvent } from "@/types/order";

const STATUS_ORDER: OrderStatus[] = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

export function getOrderStatusIndex(status: OrderStatus): number {
  const idx = STATUS_ORDER.indexOf(status);
  return idx === -1 ? 0 : idx;
}

export function buildOrderTimeline(order: Order): OrderTimelineEvent[] {
  const currentIndex = getOrderStatusIndex(order.status as OrderStatus);
  const baseEvents: OrderTimelineEvent[] = [
    {
      id: "placed",
      label: "Order placed",
      timestamp: order.createdAt,
      status: currentIndex >= 0 ? "past" : "upcoming",
    },
    {
      id: "processing",
      label: "Processing",
      status: currentIndex > 0 ? "past" : currentIndex === 0 ? "current" : "upcoming",
    },
    {
      id: "shipped",
      label: "Shipped",
      status: currentIndex > 2 ? "past" : currentIndex === 2 ? "current" : "upcoming",
    },
    {
      id: "delivered",
      label: "Delivered",
      status: currentIndex === 3 ? "current" : currentIndex > 3 ? "past" : "upcoming",
    },
  ];

  if (order.status === "cancelled") {
    baseEvents.push({
      id: "cancelled",
      label: "Cancelled",
      status: "current",
    });
  }

  return baseEvents;
}

