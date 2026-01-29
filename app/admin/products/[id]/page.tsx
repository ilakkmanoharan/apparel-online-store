"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getAdminProduct } from "@/lib/admin/products";
import type { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import Button from "@/components/common/Button";

export default function AdminProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    getAdminProduct(id).then((p) => {
      if (p) {
        setProduct({
          ...p,
          createdAt: (p as unknown as { createdAt?: { toDate?: () => Date } }).createdAt?.toDate?.() ?? new Date(),
          updatedAt: (p as unknown as { updatedAt?: { toDate?: () => Date } }).updatedAt?.toDate?.() ?? new Date(),
        });
      }
      setLoading(false);
    });
  }, [id]);

  if (loading) return <div className="animate-pulse h-64 bg-gray-200 rounded-lg" />;
  if (!product) return <p className="text-gray-600">Product not found.</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
        <div className="flex gap-2">
          <Link href={`/admin/products/${id}/edit`}>
            <Button variant="outline">Edit</Button>
          </Link>
          <Link href="/admin/products">
            <Button variant="outline">Back to list</Button>
          </Link>
        </div>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <p className="text-gray-600">{product.description}</p>
        <p className="font-semibold">{formatPrice(product.price)}</p>
        <p className="text-sm text-gray-500">Category: {product.category}</p>
        <p className="text-sm text-gray-500">Stock: {product.stockCount} · {product.inStock ? "In stock" : "Out of stock"}</p>
        <p className="text-sm text-gray-500">Sizes: {product.sizes.join(", ")} · Colors: {product.colors.join(", ")}</p>
        {product.images?.length ? (
          <div className="flex gap-2 flex-wrap">
            {product.images.map((url, i) => (
              <img key={i} src={url} alt="" className="w-24 h-24 object-cover rounded border" />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
