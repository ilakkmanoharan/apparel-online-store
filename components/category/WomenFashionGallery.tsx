"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "@/hooks/useTranslations";
import type { WomenFashionImage } from "@/lib/firebase/womenFashion";

export default function WomenFashionGallery() {
  const [images, setImages] = useState<WomenFashionImage[]>([]);
  const [loading, setLoading] = useState(true);
  const t = useTranslations();

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/gallery/women");

        if (!res.ok) {
          console.warn("[WomenFashionGallery] Gallery API returned", res.status);
          setImages([]);
          return;
        }

        const data: WomenFashionImage[] = await res.json();
        setImages(data.filter((img) => img.imageUrl && img.imageUrl.startsWith("http")));
      } catch (error) {
        console.error("Error loading women fashion gallery:", error);
        setImages([]);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) {
    return (
      <section className="mb-12">
        <div className="h-8 w-48 bg-gray-100 rounded mb-4 animate-pulse" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="aspect-[3/4] bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  if (images.length === 0) {
    return null;
  }

  const [hero, ...rest] = images;

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-4">{t("category.womenGallery")}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden bg-gray-100">
            <img src={hero.imageUrl} alt={hero.label || t("category.womenLook")} className="absolute inset-0 w-full h-full object-cover" loading="eager" />
            {hero.label && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <p className="text-white text-sm">{hero.label}</p>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-1 gap-4">
          {rest.slice(0, 4).map((image) => (
            <div key={image.id} className="relative w-full aspect-[3/4] rounded-xl overflow-hidden bg-gray-100">
              <img src={image.imageUrl} alt={image.label || t("category.womenLook")} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
            </div>
          ))}
        </div>
      </div>

      {rest.length > 4 && (
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {rest.slice(4).map((image) => (
            <div key={image.id} className="relative w-full aspect-[3/4] rounded-xl overflow-hidden bg-gray-100">
              <img src={image.imageUrl} alt={image.label || t("category.womenLook")} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
