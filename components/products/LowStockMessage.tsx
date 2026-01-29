"use client";

import { getLowStockMessage } from "@/lib/inventory/lowStock";
import { DEFAULT_LOW_STOCK_THRESHOLD } from "@/types/inventory";
import { cn } from "@/lib/utils";

interface LowStockMessageProps {
  quantity: number;
  threshold?: number;
  className?: string;
}

export default function LowStockMessage({
  quantity,
  threshold = DEFAULT_LOW_STOCK_THRESHOLD,
  className,
}: LowStockMessageProps) {
  const message = getLowStockMessage(quantity, threshold);
  if (!message) return null;

  return (
    <p
      className={cn(
        "text-sm font-medium text-amber-700",
        className
      )}
      role="status"
    >
      {message}
    </p>
  );
}
