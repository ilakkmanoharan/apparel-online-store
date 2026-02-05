"use client";

import Badge from "@/components/common/Badge";
import type { OrderStatus } from "@/types/order";

interface OrderStatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

function getStatusVariant(status: OrderStatus): "default" | "success" | "warning" | "danger" {
  switch (status) {
    case "delivered":
      return "success";
    case "processing":
    case "shipped":
    case "needs_review":
      return "warning";
    case "cancelled":
      return "danger";
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

