"use client";

import { useRouter } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";
import { createAdminProduct } from "@/lib/admin/products";
import type { Product } from "@/types";

export default function AdminNewProductPage() {
  const router = useRouter();

  const handleSubmit = async (data: Partial<Product> & { name: string; price: number; category: string }) => {
    const id = await createAdminProduct({
      name: data.name,
      description: data.description ?? "",
      price: data.price,
      originalPrice: data.originalPrice,
      images: data.images ?? [],
      category: data.category,
      subcategory: data.subcategory,
      sizes: data.sizes ?? [],
      colors: data.colors ?? [],
      inStock: data.inStock ?? true,
      stockCount: data.stockCount ?? 0,
      featured: data.featured ?? false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    router.push(`/admin/products/${id}`);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">New product</h1>
      <ProductForm product={null} onSubmit={handleSubmit} onCancel={() => router.push("/admin/products")} />
    </div>
  );
}
