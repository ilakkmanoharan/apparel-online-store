"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import OrderList from "@/components/account/OrderList";
import { useOrders } from "@/hooks/useOrders";

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { orders, loading } = useOrders(user?.uid ?? null);

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [user, authLoading, router]);

  if (!authLoading && !user) return null;
  if (authLoading) return <div className="animate-pulse h-32 bg-gray-100 rounded" />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Order History</h1>
      <OrderList orders={orders} loading={loading} />
    </div>
  );
}
