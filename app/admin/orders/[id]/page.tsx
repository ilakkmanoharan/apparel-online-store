"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getAdminOrder, updateOrderStatus } from "@/lib/admin/orders";
import type { Order } from "@/types";
import OrderDetailView from "@/components/admin/OrderDetailView";
import Button from "@/components/common/Button";

export default function AdminOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    getAdminOrder(id).then((o) => {
      if (o) {
        setOrder({
          ...o,
          createdAt: (o as unknown as { createdAt?: { toDate?: () => Date } }).createdAt?.toDate?.() ?? new Date(),
          updatedAt: (o as unknown as { updatedAt?: { toDate?: () => Date } }).updatedAt?.toDate?.() ?? new Date(),
        });
      }
      setLoading(false);
    });
  }, [id]);

  const handleStatusChange = async (status: Order["status"]) => {
    if (!id) return;
    await updateOrderStatus(id, status);
    setOrder((prev) => prev ? { ...prev, status } : null);
  };

  if (loading) return <div className="animate-pulse h-64 bg-gray-200 rounded-lg" />;
  if (!order) return <p className="text-gray-600">Order not found.</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Order #{id.slice(-8)}</h1>
        <Link href="/admin/orders">
          <Button variant="outline">Back to orders</Button>
        </Link>
      </div>
      <OrderDetailView order={order} onStatusChange={handleStatusChange} />
    </div>
  );
}
