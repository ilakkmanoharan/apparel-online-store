"use client";

import LocaleLink from "@/components/common/LocaleLink";

interface PromoBannerProps {
  title: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
  className?: string;
}

export default function PromoBanner({
  title,
  description,
  ctaLabel = "Shop now",
  ctaHref = "/",
  className = "",
}: PromoBannerProps) {
  return (
    <div
      className={`rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 ${className}`}
    >
      <p className="font-semibold">{title}</p>
      {description && <p className="mt-0.5 text-amber-800">{description}</p>}
      {ctaHref && (
        <LocaleLink
          href={ctaHref}
          className="mt-2 inline-block font-medium text-amber-800 underline hover:no-underline"
        >
          {ctaLabel}
        </LocaleLink>
      )}
    </div>
  );
}
