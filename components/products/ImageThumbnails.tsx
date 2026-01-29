"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface ImageThumbnailsProps {
  images: string[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  className?: string;
}

export default function ImageThumbnails({
  images,
  selectedIndex,
  onSelect,
  className,
}: ImageThumbnailsProps) {
  return (
    <div className={cn("grid grid-cols-4 gap-2", className)}>
      {images.map((src, index) => (
        <button
          key={`${index}-${src}`}
          type="button"
          onClick={() => onSelect(index)}
          className={cn(
            "relative aspect-square rounded-lg overflow-hidden border-2 transition-colors",
            selectedIndex === index ? "border-gray-900" : "border-transparent hover:border-gray-300"
          )}
        >
          <Image
            src={src}
            alt=""
            fill
            className="object-cover"
            sizes="120px"
          />
        </button>
      ))}
    </div>
  );
}
