"use client";

import Link from "next/link";
import type { Product } from "@/types";
import { formatPrice } from "@/lib/utils";

interface ProductTableProps {
  products: Product[];
  loading?: boolean;
}

function formatDate(d: Date | { toDate?: () => Date } | unknown): string {
  if (!d) return "—";
  const date = d instanceof Date ? d : (d as { toDate?: () => Date }).toDate?.() ?? new Date();
  return date.toLocaleDateString();
}

export default function ProductTable({ products, loading }: ProductTableProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="animate-pulse divide-y divide-gray-200">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-14 px-4 flex items-center gap-4">
              <div className="h-8 w-24 bg-gray-200 rounded" />
              <div className="h-4 flex-1 bg-gray-200 rounded" />
              <div className="h-4 w-16 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Price</th>
            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Stock</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Updated</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {products.map((p) => (
            <tr key={p.id} className="hover:bg-gray-50">
              <td className="px-4 py-2">
                <Link href={`/admin/products/${p.id}`} className="font-medium text-gray-900 hover:underline">
                  {p.name}
                </Link>
              </td>
              <td className="px-4 py-2 text-sm text-gray-600">{p.category}</td>
              <td className="px-4 py-2 text-sm text-gray-600 text-right">{formatPrice(p.price)}</td>
              <td className="px-4 py-2 text-sm text-gray-600 text-right">{p.stockCount}</td>
              <td className="px-4 py-2 text-sm text-gray-500">{formatDate(p.updatedAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {products.length === 0 && (
        <p className="px-4 py-8 text-center text-gray-500">No products yet.</p>
      )}
    </div>
  );
}
