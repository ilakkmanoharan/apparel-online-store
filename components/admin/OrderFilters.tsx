"use client";

import type { Order } from "@/types";

interface OrderFiltersProps {
  status: Order["status"] | "";
  onStatusChange: (status: Order["status"] | "") => void;
}

const STATUS_OPTIONS: { value: Order["status"] | ""; label: string }[] = [
  { value: "", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
  { value: "needs_review", label: "Needs review" },
];

export default function OrderFilters({ status, onStatusChange }: OrderFiltersProps) {
  return (
    <div className="flex items-center gap-4">
      <label className="text-sm font-medium text-gray-700">Status</label>
      <select
        value={status}
        onChange={(e) => onStatusChange(e.target.value as Order["status"] | "")}
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
      >
        {STATUS_OPTIONS.map((opt) => (
          <option key={opt.value || "all"} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
