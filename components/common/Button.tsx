"use client";

import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

export default function Button({
  variant = "primary",
  size = "md",
  fullWidth,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
        variant === "primary" && "bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-900",
        variant === "secondary" && "bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500",
        variant === "outline" && "border border-gray-300 bg-white hover:bg-gray-50 focus:ring-gray-900",
        variant === "ghost" && "hover:bg-gray-100 focus:ring-gray-500",
        size === "sm" && "px-3 py-1.5 text-sm",
        size === "md" && "px-4 py-2 text-sm",
        size === "lg" && "px-6 py-3 text-base",
        fullWidth && "w-full",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
