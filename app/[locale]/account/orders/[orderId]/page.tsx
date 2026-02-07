"use client";

import { use } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocaleRouter } from "@/hooks/useLocaleRouter";
import OrderDetail from "@/components/account/OrderDetail";
import { useOrder } from "@/hooks/useOrders";

interface PageProps {
  params: Promise<{ orderId: string }>;
}

export default function OrderDetailPage({ params }: PageProps) {
  const { orderId } = use(params);
  const { user, loading: authLoading } = useAuth();
  const router = useLocaleRouter();
  const { order, loading } = useOrder(orderId);

  if (!authLoading && !user) {
    router.push("/login");
    return null;
  }
  if (!authLoading && !user) return null;
  if (authLoading || loading) return <div className="animate-pulse h-64 bg-gray-100 rounded" />;
  if (!order) return <p className="text-gray-600">Order not found.</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Order {orderId}</h1>
      <OrderDetail order={order} />
    </div>
  );
}
