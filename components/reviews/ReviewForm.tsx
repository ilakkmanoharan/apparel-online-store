"use client";

import { useState } from "react";
import Button from "@/components/common/Button";
import { useTranslations } from "@/hooks/useTranslations";

interface ReviewFormProps {
  productId: string;
  onSubmit: (data: { rating: number; title?: string; body?: string }) => Promise<void>;
  onCancel?: () => void;
}

export default function ReviewForm({ productId, onSubmit, onCancel }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const t = useTranslations();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating < 1) {
      return;
    }

    setLoading(true);

    try {
      await onSubmit({ rating, title: title || undefined, body: body || undefined });
      setRating(0);
      setTitle("");
      setBody("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t("reviews.rating")}</label>
        <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="border rounded px-3 py-2" required>
          <option value={0}>{t("common.select")}</option>
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>{t("reviews.stars", { count: n })}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t("reviews.titleOptional")}</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border rounded px-3 py-2" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t("reviews.reviewOptional")}</label>
        <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={3} className="w-full border rounded px-3 py-2" />
      </div>
      <div className="flex gap-2">
        <Button type="submit" disabled={rating < 1 || loading}>{loading ? t("common.submitting") : t("reviews.submitReview")}</Button>
        {onCancel && <Button type="button" variant="outline" onClick={onCancel}>{t("common.cancel")}</Button>}
      </div>
    </form>
  );
}
