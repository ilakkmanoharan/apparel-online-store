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

        // Filter out any images without valid URLs
        const validImages = data.filter(img => {
          const hasValidUrl = img.imageUrl && typeof img.imageUrl === 'string' && img.imageUrl.trim().length > 0;
          if (!hasValidUrl) {
            console.warn("[WomenFashionGallery] Skipping image with invalid URL:", img);
          }
          return hasValidUrl;
        });

        console.log(`[WomenFashionGallery] Loaded ${validImages.length} valid images`);
        setImages(validImages);
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
      <section className="mb-16">
        <div className="h-8 w-48 bg-gray-100 rounded mb-6 animate-pulse" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
            <div key={i} className="bg-gray-100 rounded-xl border border-gray-200 h-80 animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  if (images.length === 0) {
    return (
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-6">{t("category.womenGallery")}</h2>
        <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl">
          <p>No gallery images available at this time.</p>
        </div>
      </section>
    );
  }

  const handleImageError = (imageId: string, imageUrl: string) => {
    console.error(`[WomenFashionGallery] Failed to load image ${imageId}:`, imageUrl);
  };

  return (
    <section className="mb-16">
      <h2 className="text-3xl font-bold mb-6">{t("category.womenGallery")}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {images.map((image) => (
          <div
            key={image.id}
            className="group relative bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            <div className="relative w-full h-80 bg-gray-50 p-4 flex items-center justify-center">
              <img
                src={image.imageUrl}
                alt={image.label || t("category.womenLook")}
                className="max-w-full max-h-full object-contain transition-transform duration-300"
                loading="lazy"
                onError={() => handleImageError(image.id, image.imageUrl)}
              />
            </div>
            {image.label && (
              <div className="p-3 border-t border-gray-100">
                <p className="text-sm text-gray-700 text-center truncate">{image.label}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
