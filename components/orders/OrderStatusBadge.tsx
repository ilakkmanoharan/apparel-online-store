"use client";

import Badge from "@/components/common/Badge";
import type { OrderStatus } from "@/types/order";

interface OrderStatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

/** Maps order status to Badge variants (default | sale | new | outline). */
function getStatusVariant(status: OrderStatus): "default" | "sale" | "new" | "outline" {
  switch (status) {
    case "delivered":
      return "new"; // green
    case "processing":
    case "shipped":
    case "needs_review":
      return "outline";
    case "cancelled":
      return "sale"; // red
    case "pending":
    default:
      return "default";
  }
}

function getStatusLabel(status: OrderStatus): string {
  switch (status) {
    case "pending":
      return "Pending";
    case "processing":
      return "Processing";
    case "shipped":
      return "Shipped";
    case "delivered":
      return "Delivered";
    case "cancelled":
      return "Cancelled";
    case "needs_review":
      return "Needs review";
    default:
      return status;
  }
}

export default function OrderStatusBadge({ status, className }: OrderStatusBadgeProps) {
  const variant = getStatusVariant(status);
  const label = getStatusLabel(status);

  return (
    <Badge variant={variant} className={className}>
      {label}
    </Badge>
  );
}

