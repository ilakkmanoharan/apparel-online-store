"use client";

import { useState } from "react";
import type { AdminPromo } from "@/lib/admin/promos";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import Checkbox from "@/components/common/Checkbox";

interface PromoFormProps {
  promo?: AdminPromo | null;
  onSubmit: (data: Omit<AdminPromo, "id" | "createdAt" | "updatedAt">) => Promise<void>;
  onCancel: () => void;
}

export default function PromoForm({ promo, onSubmit, onCancel }: PromoFormProps) {
  const [code, setCode] = useState(promo?.code ?? "");
  const [discountPercent, setDiscountPercent] = useState(promo?.discountPercent?.toString() ?? "10");
  const [minOrder, setMinOrder] = useState(promo?.minOrder?.toString() ?? "");
  const [active, setActive] = useState(promo?.active ?? true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const percent = parseInt(discountPercent, 10);
    if (isNaN(percent) || percent < 1 || percent > 100) {
      setError("Discount must be 1–100%");
      return;
    }
    setLoading(true);
    try {
      await onSubmit({
        code: code.trim().toUpperCase(),
        discountPercent: percent,
        minOrder: minOrder ? parseFloat(minOrder) : undefined,
        active,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
      <Input label="Code" value={code} onChange={(e) => setCode(e.target.value)} required placeholder="SAVE10" />
      <Input label="Discount %" type="number" min={1} max={100} value={discountPercent} onChange={(e) => setDiscountPercent(e.target.value)} required />
      <Input label="Min order (optional)" type="number" step="0.01" value={minOrder} onChange={(e) => setMinOrder(e.target.value)} placeholder="50" />
      <Checkbox label="Active" checked={active} onChange={(e) => setActive(e.target.checked)} />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex gap-4">
        <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Save"}</Button>
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
}
