"use client";

import { useTranslations } from "@/hooks/useTranslations";
import { cn } from "@/lib/utils";
import type { QAPair } from "@/types/qa";

interface QACardProps {
  item: QAPair;
  className?: string;
}

export default function QACard({ item, className }: QACardProps) {
  const askedAtLabel = item.askedAt instanceof Date ? item.askedAt.toLocaleDateString() : new Date(item.askedAt).toLocaleDateString();
  const t = useTranslations();

  return (
    <article className={cn("border-b border-gray-200 py-4 last:border-b-0", className)}>
      <p className="font-medium text-gray-900">{item.question}</p>
      <p className="mt-1 text-xs text-gray-500">{item.askedByDisplayName ?? t("qa.customer")} - {askedAtLabel}</p>
      {item.answer && (
        <div className="mt-3 rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-700">
          <span className="font-medium text-gray-600">{t("qa.answer")}: </span>
          {item.answer}
        </div>
      )}
    </article>
  );
}
