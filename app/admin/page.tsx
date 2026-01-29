"use client";

import DashboardStats from "@/components/admin/DashboardStats";
import { getTopProducts } from "@/lib/admin/analytics";
import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/utils";
import type { TopProductRow } from "@/types/admin";
import Link from "next/link";

export default function AdminDashboardPage() {
  const [topProducts, setTopProducts] = useState<TopProductRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTopProducts(5).then(setTopProducts).finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      <DashboardStats />
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Top products</h2>
          <Link href="/admin/analytics" className="text-sm text-blue-600 hover:underline">
            View analytics
          </Link>
        </div>
        {loading ? (
          <div className="h-48 bg-gray-200 rounded-lg animate-pulse" />
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Quantity sold</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {topProducts.map((row) => (
                  <tr key={row.productId}>
                    <td className="px-4 py-2 text-sm font-medium text-gray-900">
                      <Link href={`/admin/products/${row.productId}`} className="hover:underline">
                        {row.name}
                      </Link>
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-600 text-right">{row.quantitySold}</td>
                    <td className="px-4 py-2 text-sm text-gray-600 text-right">{formatPrice(row.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {topProducts.length === 0 && (
              <p className="px-4 py-8 text-center text-gray-500">No orders yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
