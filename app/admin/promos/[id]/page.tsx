"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getAdminPromo, updateAdminPromo } from "@/lib/admin/promos";
import type { AdminPromo } from "@/lib/admin/promos";
import PromoForm from "@/components/admin/PromoForm";
import Button from "@/components/common/Button";

export default function AdminPromoDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [promo, setPromo] = useState<AdminPromo | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (!id) return;
    getAdminPromo(id).then(setPromo).finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (data: Omit<AdminPromo, "id" | "createdAt" | "updatedAt">) => {
    if (!id) return;
    await updateAdminPromo(id, data);
    setPromo((prev) => prev ? { ...prev, ...data } : null);
    setEditing(false);
  };

  if (loading) return <div className="animate-pulse h-64 bg-gray-200 rounded-lg" />;
  if (!promo) return <p className="text-gray-600">Promo not found.</p>;

  if (editing) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Edit promo</h1>
        <PromoForm promo={promo} onSubmit={handleSubmit} onCancel={() => setEditing(false)} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 font-mono">{promo.code}</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setEditing(true)}>Edit</Button>
          <Link href="/admin/promos">
            <Button variant="outline">Back to list</Button>
          </Link>
        </div>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-2">
        <p className="text-sm text-gray-600">Discount: {promo.discountPercent}%</p>
        <p className="text-sm text-gray-600">Min order: {promo.minOrder != null ? `$${promo.minOrder}` : "—"}</p>
        <p className="text-sm text-gray-500">Active: {promo.active ? "Yes" : "No"}</p>
      </div>
    </div>
  );
}
