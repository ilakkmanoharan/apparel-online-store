"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useI18n } from "@/components/common/I18nProvider";
import { useTranslations } from "@/hooks/useTranslations";
import type { WomenFashionImage } from "@/lib/firebase/womenFashion";
import { cn, formatPrice } from "@/lib/utils";
import type { TranslationValues } from "@/types/i18n";

const SWATCH_MAX = 4;

function formatReviewCount(n: number, locale: string): string {
  return new Intl.NumberFormat(locale === "en" ? "en-US" : locale, {
    maximumFractionDigits: 0,
  }).format(n);
}

function StarRating({ rating }: { rating: number }) {
  const filled = Math.min(5, Math.max(0, Math.round(rating)));
  return (
    <span className="inline-flex text-[12px] leading-none" aria-hidden>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= filled ? "text-neutral-900" : "text-neutral-200"}>
          ★
        </span>
      ))}
    </span>
  );
}

function WomenGalleryCard({
  item,
  locale,
  t,
}: {
  item: WomenFashionImage;
  locale: string;
  t: (key: string, values?: TranslationValues) => string;
}) {
  const alt = item.name || item.label || t("womenLook");
  const isRich = Boolean(item.brand || item.name || item.description);

  const inner = (
    <>
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-100">
        {item.badge?.type === "clearance" && (
          <span className="absolute left-2 top-2 z-10 rounded bg-amber-700 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
            {item.badge.text ?? "Clearance"}
          </span>
        )}
        <img
          src={item.imageUrl}
          alt={alt}
          className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.02]"
          loading="lazy"
        />
        {item.badge?.type === "in-demand" && (
          <div className="absolute inset-x-0 bottom-0 z-10 border-t border-rose-100/80 bg-rose-50/95 px-2 py-1.5 text-[10px] font-medium leading-snug text-rose-950">
            {item.badge.text}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1.5 border-t border-neutral-100 p-3 text-left">
        {!isRich && item.label && (
          <p className="text-center text-sm text-neutral-600">{item.label}</p>
        )}

        {isRich && (
          <>
            {item.label && (
              <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
                {item.label}
              </p>
            )}
            {item.sponsored && (
              <p className="text-[10px] font-medium uppercase tracking-wide text-neutral-400">
                {t("gallerySponsored")}
              </p>
            )}
            {item.brand && (
              <p className="text-sm font-bold leading-tight text-neutral-900">{item.brand}</p>
            )}
            {item.name && (
              <p className="text-sm leading-snug text-neutral-800">
                {item.isNew && (
                  <span className="mr-1 font-bold text-red-600">{t("galleryNew")}</span>
                )}
                {item.name}
              </p>
            )}
            {item.exclusive && (
              <p className="text-[11px] text-neutral-500">{t("galleryExclusive")}</p>
            )}

            {item.currentPrice != null && (
              <div className="mt-0.5 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                <span className="text-base font-bold text-red-600">
                  {formatPrice(item.currentPrice)}
                  {item.discountPercent != null && item.discountPercent > 0 && (
                    <span className="ml-1 text-sm font-semibold">
                      ({item.discountPercent}% off)
                    </span>
                  )}
                </span>
                {item.originalPrice != null && item.originalPrice > item.currentPrice && (
                  <span className="text-sm text-neutral-400 line-through">
                    {formatPrice(item.originalPrice)}
                  </span>
                )}
              </div>
            )}
            {item.vipApplied && (
              <p className="text-[11px] text-neutral-500">{t("galleryVipApplied")}</p>
            )}
            {item.rewardsText && (
              <p className="flex items-center gap-1 text-[11px] text-neutral-600">
                <span aria-hidden className="text-amber-600">
                  ★
                </span>
                {item.rewardsText}
              </p>
            )}

            {item.rating != null && item.reviewCount != null && (
              <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-neutral-700">
                <StarRating rating={item.rating} />
                <span className="text-neutral-500">
                  ({formatReviewCount(item.reviewCount, locale)})
                </span>
              </div>
            )}

            {item.description && (
              <p className="line-clamp-3 border-t border-neutral-100 pt-2 text-xs leading-relaxed text-neutral-600">
                {item.description}
              </p>
            )}

            {item.colors && item.colors.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                {item.colors.slice(0, SWATCH_MAX).map((c, idx) => (
                  <span
                    key={`${c.name}-${idx}`}
                    title={c.name}
                    className={cn(
                      "h-5 w-5 shrink-0 rounded-full border-2 border-white shadow ring-1 ring-neutral-300",
                      idx === 0 && "ring-2 ring-neutral-900 ring-offset-1"
                    )}
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
                {item.colors.length > SWATCH_MAX && (
                  <span className="text-[11px] font-medium text-neutral-600">
                    {t("galleryMoreColors", { count: item.colors.length - SWATCH_MAX })}
                  </span>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );

  if (item.productId) {
    return (
      <Link
        href={`/${locale}/products/${item.productId}`}
        className="group block rounded-xl border border-neutral-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
      >
        {inner}
      </Link>
    );
  }

  return (
    <div className="group rounded-xl border border-neutral-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
      {inner}
    </div>
  );
}

export default function WomenFashionGallery() {
  const [images, setImages] = useState<WomenFashionImage[]>([]);
  const [loading, setLoading] = useState(true);
  const t = useTranslations("category");
  const { locale } = useI18n();

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

        const validImages = data.filter((img) => {
          const hasValidUrl =
            img.imageUrl && typeof img.imageUrl === "string" && img.imageUrl.trim().length > 0;
          if (!hasValidUrl) {
            console.warn("[WomenFashionGallery] Skipping image with invalid URL:", img);
          }
          return hasValidUrl;
        });

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
        <div className="mb-6 h-8 w-48 animate-pulse rounded bg-neutral-100" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              className="h-[520px] animate-pulse rounded-xl border border-neutral-200 bg-neutral-100"
            />
          ))}
        </div>
      </section>
    );
  }

  if (images.length === 0) {
    return (
      <section className="mb-16">
        <h2 className="mb-6 text-3xl font-bold">{t("womenGallery")}</h2>
        <div className="rounded-xl bg-neutral-50 py-12 text-center text-neutral-500">
          <p>No gallery images available at this time.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-16">
      <h2 className="mb-6 text-3xl font-bold">{t("womenGallery")}</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {images.map((image) => (
          <WomenGalleryCard key={image.id} item={image} locale={locale} t={t} />
        ))}
      </div>
    </section>
  );
}
