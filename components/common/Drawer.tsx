"use client";

import { useEffect } from "react";
import { cn } from "@/lib/utils";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  side?: "left" | "right";
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export default function Drawer({
  open,
  onClose,
  side = "right",
  title,
  children,
  className,
}: DrawerProps) {
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden
      />
      <aside
        role="dialog"
        aria-modal="true"
        className={cn(
          "relative bg-white shadow-xl w-full max-w-sm flex flex-col",
          side === "left" ? "animate-in slide-in-from-left" : "animate-in slide-in-from-right ml-auto",
          className
        )}
      >
        {title && (
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">{title}</h2>
            <button
              type="button"
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg"
              aria-label="Close"
            >
              &times;
            </button>
          </div>
        )}
        <div className="flex-1 overflow-auto p-4">{children}</div>
      </aside>
    </div>
  );
}
