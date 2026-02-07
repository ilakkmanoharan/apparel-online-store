"use client";

import { useEffect } from "react";
import OrderList from "@/components/account/OrderList";
import { useAuth } from "@/contexts/AuthContext";
import { useLocaleRouter } from "@/hooks/useLocaleRouter";
import { useTranslations } from "@/hooks/useTranslations";
import { useOrders } from "@/hooks/useOrders";

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useLocaleRouter();
  const { orders, loading } = useOrders(user?.uid ?? null);
  const t = useTranslations();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  if (!authLoading && !user) {
    return null;
  }

  if (authLoading) {
    return <div className="animate-pulse h-32 bg-gray-100 rounded" />;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{t("account.orders")}</h1>
      <OrderList orders={orders} loading={loading} />
    </div>
  );
}
