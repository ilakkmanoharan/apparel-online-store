"use client";

import Link from "next/link";
import type { AdminPromo } from "@/lib/admin/promos";

interface PromoListProps {
  promos: AdminPromo[];
  loading?: boolean;
}

export default function PromoList({ promos, loading }: PromoListProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="animate-pulse divide-y divide-gray-200">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-14 px-4 flex items-center gap-4">
              <div className="h-8 w-24 bg-gray-200 rounded" />
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
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Discount</th>
            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Min order</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Active</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {promos.map((p) => (
            <tr key={p.id} className="hover:bg-gray-50">
              <td className="px-4 py-2">
                <Link href={`/admin/promos/${p.id}`} className="font-medium text-gray-900 hover:underline font-mono">
                  {p.code}
                </Link>
              </td>
              <td className="px-4 py-2 text-sm text-gray-600 text-right">{p.discountPercent}%</td>
              <td className="px-4 py-2 text-sm text-gray-600 text-right">{p.minOrder != null ? `$${p.minOrder}` : "—"}</td>
              <td className="px-4 py-2">
                <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${p.active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                  {p.active ? "Yes" : "No"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {promos.length === 0 && (
        <p className="px-4 py-8 text-center text-gray-500">No promos yet. Add codes in lib/promo/validatePromo.ts or use Firestore promos collection.</p>
      )}
    </div>
  );
}
