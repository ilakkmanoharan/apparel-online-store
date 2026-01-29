"use client";

import type { ReturnStatus } from "@/types/returns";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<ReturnStatus, string> = {
  requested: "bg-amber-100 text-amber-800",
  approved: "bg-blue-100 text-blue-800",
  label_sent: "bg-indigo-100 text-indigo-800",
  in_transit: "bg-purple-100 text-purple-800",
  received: "bg-cyan-100 text-cyan-800",
  refunded: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  cancelled: "bg-gray-100 text-gray-800",
};

const STATUS_LABELS: Record<ReturnStatus, string> = {
  requested: "Requested",
  approved: "Approved",
  label_sent: "Label sent",
  in_transit: "In transit",
  received: "Received",
  refunded: "Refunded",
  rejected: "Rejected",
  cancelled: "Cancelled",
};

interface ReturnStatusBadgeProps {
  status: ReturnStatus;
  className?: string;
}

export default function ReturnStatusBadge({ status, className }: ReturnStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        STATUS_STYLES[status],
        className
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
