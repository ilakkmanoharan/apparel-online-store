"use client";

import type { ContentBlock as ContentBlockType } from "@/types/editorial";
import LocaleLink from "@/components/common/LocaleLink";

export default function ContentBlock({ block }: { block: ContentBlockType }) {
  if (block.type === "cta" && block.ctaHref && block.ctaLabel) {
    return (
      <div className="py-4">
        <LocaleLink href={block.ctaHref} className="inline-block px-4 py-2 bg-gray-900 text-white rounded font-medium">
          {block.ctaLabel}
        </LocaleLink>
      </div>
    );
  }
  if (block.type === "text" && block.body) {
    return <div className="prose py-2" dangerouslySetInnerHTML={{ __html: block.body }} />;
  }
  return (
    <div className="py-2">
      {block.title && <h3 className="font-semibold">{block.title}</h3>}
      {block.subtitle && <p className="text-gray-600">{block.subtitle}</p>}
    </div>
  );
}
