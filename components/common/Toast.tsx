"use client";

import { cn } from "@/lib/utils";

interface ToastProps {
  message: string;
  variant?: "success" | "error" | "info";
  className?: string;
}

export default function Toast({ message, variant = "info", className }: ToastProps) {
  return (
    <div
      role="alert"
      className={cn(
        "px-4 py-3 rounded-lg text-sm font-medium",
        variant === "success" && "bg-green-50 text-green-800",
        variant === "error" && "bg-red-50 text-red-800",
        variant === "info" && "bg-gray-100 text-gray-800",
        className
      )}
    >
      {message}
    </div>
  );
}
