"use client";

import { useTranslations } from "@/hooks/useTranslations";
import { cn } from "@/lib/utils";
import Button from "./Button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export default function Pagination({ currentPage, totalPages, onPageChange, className }: PaginationProps) {
  const t = useTranslations();

  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav className={cn("flex items-center justify-center gap-2", className)} aria-label={t("common.pagination")}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        aria-label={t("common.previousPage")}
      >
        {t("common.previous")}
      </Button>
      <span className="text-sm text-gray-600">{t("common.pageOf", { page: currentPage, totalPages })}</span>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        aria-label={t("common.nextPage")}
      >
        {t("common.next")}
      </Button>
    </nav>
  );
}
