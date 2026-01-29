"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import ReturnForm from "@/components/returns/ReturnForm";
import { getOrderById } from "@/lib/firebase/orders";
import type { Order } from "@/types";

export default function OrderReturnPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const orderId = params?.orderId as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!orderId || !user?.uid) return;
    getOrderById(orderId).then((o) => {
      if (o && o.userId === user.uid) setOrder(o);
      else setOrder(null);
    }).finally(() => setLoading(false));
  }, [orderId, user?.uid]);

  if (!authLoading && !user) return null;
  if (authLoading || loading) {
    return <div className="animate-pulse h-64 bg-gray-200 rounded" />;
  }
  if (!order) {
    return (
      <div>
        <p className="text-gray-600">Order not found.</p>
        <button onClick={() => router.push("/account/orders")} className="mt-4 text-blue-600 underline">
          Back to Orders
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Start a Return</h1>
      <p className="text-gray-600 mb-6">Order #{orderId.slice(-8)}</p>
      <ReturnForm order={order} onSuccess={() => router.push("/account/returns")} onCancel={() => router.push(`/account/orders/${orderId}`)} />
    </div>
  );
}
