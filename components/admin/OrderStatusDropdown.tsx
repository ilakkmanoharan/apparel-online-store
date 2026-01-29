"use client";

import type { Order } from "@/types";
import { cn } from "@/lib/utils";

const STATUS_OPTIONS: Order["status"][] = ["pending", "processing", "shipped", "delivered", "cancelled"];

interface OrderStatusDropdownProps {
  value: Order["status"];
  onChange: (status: Order["status"]) => void;
  disabled?: boolean;
  className?: string;
}

export default function OrderStatusDropdown({
  value,
  onChange,
  disabled = false,
  className,
}: OrderStatusDropdownProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as Order["status"])}
      disabled={disabled}
      className={cn(
        "rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium capitalize disabled:opacity-50",
        className
      )}
    >
      {STATUS_OPTIONS.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}
