"use client";

import { useEffect, useState } from "react";
import OrderTable from "@/components/admin/OrderTable";
import OrderFilters from "@/components/admin/OrderFilters";
import { listAdminOrders } from "@/lib/admin/orders";
import type { Order } from "@/types";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState<Order["status"] | "">("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const opts = statusFilter ? { status: statusFilter } : {};
    listAdminOrders({ limit: 100, ...opts }).then((list) => {
      setOrders(list.map((o) => ({
        ...o,
        createdAt: (o as unknown as { createdAt?: { toDate?: () => Date } }).createdAt?.toDate?.() ?? new Date(),
        updatedAt: (o as unknown as { updatedAt?: { toDate?: () => Date } }).updatedAt?.toDate?.() ?? new Date(),
      })));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [statusFilter]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
      <OrderFilters status={statusFilter} onStatusChange={setStatusFilter} />
      <OrderTable orders={orders} loading={loading} />
    </div>
  );
}
