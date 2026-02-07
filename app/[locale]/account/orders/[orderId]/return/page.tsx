"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ReturnForm from "@/components/returns/ReturnForm";
import { useAuth } from "@/contexts/AuthContext";
import { useLocaleRouter } from "@/hooks/useLocaleRouter";
import { useTranslations } from "@/hooks/useTranslations";
import { getOrderById } from "@/lib/firebase/orders";
import type { Order } from "@/types";

export default function OrderReturnPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useLocaleRouter();
  const params = useParams();
  const orderId = params?.orderId as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const t = useTranslations();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!orderId || !user?.uid) {
      return;
    }

    getOrderById(orderId)
      .then((fetchedOrder) => {
        if (fetchedOrder && fetchedOrder.userId === user.uid) {
          setOrder(fetchedOrder);
        } else {
          setOrder(null);
        }
      })
      .finally(() => setLoading(false));
  }, [orderId, user?.uid]);

  if (!authLoading && !user) {
    return null;
  }

  if (authLoading || loading) {
    return <div className="animate-pulse h-64 bg-gray-200 rounded" />;
  }

  if (!order) {
    return (
      <div>
        <p className="text-gray-600">{t("account.orderNotFound")}</p>
        <button onClick={() => router.push("/account/orders")} className="mt-4 text-blue-600 underline">
          {t("account.backToOrders")}
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{t("returns.startReturn")}</h1>
      <p className="text-gray-600 mb-6">{t("account.orderNumber", { orderId: orderId.slice(-8) })}</p>
      <ReturnForm order={order} onSuccess={() => router.push("/account/returns")} onCancel={() => router.push(`/account/orders/${orderId}`)} />
    </div>
  );
}
