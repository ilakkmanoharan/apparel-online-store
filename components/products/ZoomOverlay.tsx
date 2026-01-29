"use client";

import { useEffect } from "react";
import Image from "next/image";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";

interface ZoomOverlayProps {
  src: string;
  alt: string;
  onClose: () => void;
  className?: string;
}

export default function ZoomOverlay({ src, alt, onClose, className }: ZoomOverlayProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4",
        className
      )}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Zoomed image"
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 p-2 text-white hover:bg-white/10 rounded-full"
        aria-label="Close"
      >
        <XMarkIcon className="w-8 h-8" />
      </button>
      <div
        className="relative w-full max-w-4xl aspect-square max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-contain"
          sizes="90vw"
        />
      </div>
    </div>
  );
}
