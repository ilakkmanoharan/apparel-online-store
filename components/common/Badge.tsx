"use client";

import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "sale" | "new" | "outline";
  className?: string;
}

export default function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold",
        variant === "default" && "bg-gray-900 text-white",
        variant === "sale" && "bg-red-500 text-white",
        variant === "new" && "bg-green-600 text-white",
        variant === "outline" && "border border-gray-300 text-gray-700",
        className
      )}
    >
      {children}
    </span>
  );
}
