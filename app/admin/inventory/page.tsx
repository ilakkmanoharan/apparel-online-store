"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface InventoryItem {
  id: string;
  name: string;
  stockCount: number;
  inStock: boolean;
}

export default function AdminInventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/inventory?limit=100")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load inventory");
        return res.json();
      })
      .then((data: { items: InventoryItem[] }) => setItems(data.items))
      .catch((err) => setError(err instanceof Error ? err.message : "Error"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>
        <div className="h-64 rounded-lg bg-gray-200 animate-pulse" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>
      <p className="text-sm text-gray-600">Product stock summary. Edit stock on the product edit page.</p>
      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left font-medium text-gray-700">Product</th>
              <th className="px-4 py-2 text-right font-medium text-gray-700">Stock</th>
              <th className="px-4 py-2 text-left font-medium text-gray-700">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {items.map((item) => (
              <tr key={item.id}>
                <td className="px-4 py-2">
                  <Link href={`/admin/products/${item.id}/edit`} className="font-medium text-blue-600 hover:underline">
                    {item.name}
                  </Link>
                </td>
                <td className="px-4 py-2 text-right text-gray-700">{item.stockCount}</td>
                <td className="px-4 py-2">
                  <span className={item.inStock ? "text-green-600" : "text-amber-600"}>
                    {item.inStock ? "In stock" : "Out of stock"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {items.length === 0 && (
          <p className="px-4 py-8 text-center text-gray-500">No products found.</p>
        )}
      </div>
    </div>
  );
}
