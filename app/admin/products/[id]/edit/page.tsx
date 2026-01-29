"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getAdminProduct, updateAdminProduct } from "@/lib/admin/products";
import type { Product } from "@/types";
import ProductForm from "@/components/admin/ProductForm";

export default function AdminEditProductPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [product, setProduct] = useState<Product | null | undefined>(undefined);

  useEffect(() => {
    if (!id) return;
    getAdminProduct(id).then((p) => {
      if (p) {
        setProduct({
          ...p,
          createdAt: (p as unknown as { createdAt?: { toDate?: () => Date } }).createdAt?.toDate?.() ?? new Date(),
          updatedAt: (p as unknown as { updatedAt?: { toDate?: () => Date } }).updatedAt?.toDate?.() ?? new Date(),
        });
      } else {
        setProduct(null);
      }
    });
  }, [id]);

  const handleSubmit = async (data: Partial<Product> & { name: string; price: number; category: string }) => {
    if (!id) return;
    await updateAdminProduct(id, data);
    router.push(`/admin/products/${id}`);
  };

  if (product === undefined) return <div className="animate-pulse h-64 bg-gray-200 rounded-lg" />;
  if (product === null) return <p className="text-gray-600">Product not found.</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Edit product</h1>
      <ProductForm product={product} onSubmit={handleSubmit} onCancel={() => router.push(`/admin/products/${id}`)} />
    </div>
  );
}
