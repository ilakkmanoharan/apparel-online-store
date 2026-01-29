"use client";

import { useState } from "react";
import Image from "next/image";
import ImageThumbnails from "./ImageThumbnails";
import ZoomOverlay from "./ZoomOverlay";
import { cn } from "@/lib/utils";

interface ImageGalleryProps {
  images: string[];
  alt: string;
  className?: string;
}

export default function ImageGallery({ images, alt, className }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);

  if (!images?.length) {
    return (
      <div className={cn("aspect-square bg-gray-100 rounded-lg flex items-center justify-center text-gray-400", className)}>
        No image
      </div>
    );
  }

  const current = images[selectedIndex] ?? images[0];

  return (
    <div className={cn("space-y-4", className)}>
      <div
        className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-zoom-in"
        onClick={() => setZoomOpen(true)}
      >
        <Image
          src={current}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </div>
      {images.length > 1 && (
        <ImageThumbnails
          images={images}
          selectedIndex={selectedIndex}
          onSelect={setSelectedIndex}
        />
      )}
      {zoomOpen && (
        <ZoomOverlay
          src={current}
          alt={alt}
          onClose={() => setZoomOpen(false)}
        />
      )}
    </div>
  );
}
