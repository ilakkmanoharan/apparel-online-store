"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProductTable from "@/components/admin/ProductTable";
import { listAdminProducts } from "@/lib/admin/products";
import type { Product } from "@/types";
import Button from "@/components/common/Button";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listAdminProducts({ limit: 100 }).then((list) => {
      setProducts(list.map((p) => ({ ...p, createdAt: (p as unknown as { createdAt?: { toDate?: () => Date } }).createdAt?.toDate?.() ?? new Date(), updatedAt: (p as unknown as { updatedAt?: { toDate?: () => Date } }).updatedAt?.toDate?.() ?? new Date() })));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <Link href="/admin/products/new">
          <Button>Add product</Button>
        </Link>
      </div>
      <ProductTable products={products} loading={loading} />
    </div>
  );
}
