"use client";

import { useState, useEffect } from "react";
import type { Banner } from "@/types/editorial";
import Link from "next/link";

interface BannerCarouselProps {
  banners: Banner[];
  autoAdvanceMs?: number;
  className?: string;
}

export default function BannerCarousel({ banners, autoAdvanceMs = 5000, className = "" }: BannerCarouselProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % banners.length), autoAdvanceMs);
    return () => clearInterval(t);
  }, [banners.length, autoAdvanceMs]);

  if (banners.length === 0) return null;
  const current = banners[index];
  return (
    <div className={"relative " + className}>
      {current.href ? (
        <Link href={current.href}>
          <img src={current.imageUrl} alt={current.imageAlt ?? current.title ?? "Banner"} className="w-full h-48 object-cover rounded" />
        </Link>
      ) : (
        <img src={current.imageUrl} alt={current.imageAlt ?? current.title ?? "Banner"} className="w-full h-48 object-cover rounded" />
      )}
      {banners.length > 1 && (
        <div className="flex justify-center gap-2 mt-2">
          {banners.map((_, i) => (
            <button key={i} type="button" onClick={() => setIndex(i)} className={"w-2 h-2 rounded-full " + (i === index ? "bg-gray-900" : "bg-gray-300")} aria-label={"Slide " + (i + 1)} />
          ))}
        </div>
      )}
    </div>
  );
}
