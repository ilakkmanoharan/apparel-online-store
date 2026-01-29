import type { Order } from "@/types";

export type OrderStatus = Order["status"];

export interface OrderTimelineEvent {
  id: string;
  label: string;
  timestamp?: Date;
  status: "past" | "current" | "upcoming";
}

export interface OrderTrackingInfo {
  orderId: string;
  status: OrderStatus;
  carrier?: string;
  trackingNumber?: string;
  estimatedDelivery?: Date | null;
  events: OrderTimelineEvent[];
}

