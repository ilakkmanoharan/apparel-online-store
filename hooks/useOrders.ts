"use client";

import { useEffect, useState } from "react";
import { Order } from "@/types";
import { getOrdersForUser, getOrderById } from "@/lib/firebase/orders";

export function useOrders(userId: string | null) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setOrders([]);
      setLoading(false);
      return;
    }
    let cancelled = false;
    getOrdersForUser(userId)
      .then((data) => {
        if (!cancelled) setOrders(data);
      })
      .catch(console.error)
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [userId]);

  return { orders, loading };
}

export function useOrder(orderId: string | null) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(!!orderId);

  useEffect(() => {
    if (!orderId) {
      setOrder(null);
      setLoading(false);
      return;
    }
    let cancelled = false;
    getOrderById(orderId)
      .then((data) => {
        if (!cancelled) setOrder(data ?? null);
      })
      .catch(console.error)
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [orderId]);

  return { order, loading };
}
