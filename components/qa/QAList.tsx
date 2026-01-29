"use client";

import type { QAPair } from "@/types/qa";
import QACard from "./QACard";
import { cn } from "@/lib/utils";

interface QAListProps {
  items: QAPair[];
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
}

export default function QAList({
  items,
  loading = false,
  emptyMessage = "No questions yet. Be the first to ask.",
  className,
}: QAListProps) {
  if (loading) {
    return (
      <div className={cn("space-y-4", className)}>
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 animate-pulse rounded-lg bg-gray-100" />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <p className={cn("text-sm text-gray-500", className)}>{emptyMessage}</p>
    );
  }

  return (
    <ul className={cn("divide-y divide-gray-200", className)}>
      {items.map((item) => (
        <li key={item.id}>
          <QACard item={item} />
        </li>
      ))}
    </ul>
  );
}
