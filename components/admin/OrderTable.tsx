"use client";

import Link from "next/link";
import type { Order } from "@/types";
import { formatPrice } from "@/lib/utils";

interface OrderTableProps {
  orders: Order[];
  loading?: boolean;
}

function formatDate(d: Date | { toDate?: () => Date } | unknown): string {
  if (!d) return "—";
  const date = d instanceof Date ? d : (d as { toDate?: () => Date }).toDate?.() ?? new Date();
  return date.toLocaleDateString();
}

const STATUS_STYLES: Record<Order["status"], string> = {
  pending: "bg-amber-100 text-amber-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-gray-100 text-gray-800",
  needs_review: "bg-orange-100 text-orange-800",
};

export default function OrderTable({ orders, loading }: OrderTableProps) {
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
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Order</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {orders.map((o) => (
            <tr key={o.id} className="hover:bg-gray-50">
              <td className="px-4 py-2">
                <Link href={`/admin/orders/${o.id}`} className="font-medium text-gray-900 hover:underline">
                  #{o.id.slice(-8)}
                </Link>
              </td>
              <td className="px-4 py-2 text-sm text-gray-600">{formatDate(o.createdAt)}</td>
              <td className="px-4 py-2 text-sm text-gray-600 text-right">{formatPrice(o.total)}</td>
              <td className="px-4 py-2">
                <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[o.status]}`}>
                  {o.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {orders.length === 0 && (
        <p className="px-4 py-8 text-center text-gray-500">No orders yet.</p>
      )}
    </div>
  );
}
