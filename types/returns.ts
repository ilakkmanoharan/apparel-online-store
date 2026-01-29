export type ReturnStatus =
  | "requested"
  | "approved"
  | "label_sent"
  | "in_transit"
  | "received"
  | "refunded"
  | "rejected"
  | "cancelled";

export type ReturnReason =
  | "wrong_size"
  | "wrong_item"
  | "defective"
  | "not_as_described"
  | "changed_mind"
  | "other";

export interface ReturnItem {
  orderId: string;
  productId: string;
  variantKey: string; // e.g. "size-color"
  quantity: number;
  reason: ReturnReason;
  reasonDetail?: string;
}

export interface ReturnRequest {
  id: string;
  userId: string;
  orderId: string;
  items: ReturnItem[];
  status: ReturnStatus;
  refundAmount?: number;
  labelUrl?: string;
  trackingNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ExchangeRequest {
  id: string;
  returnRequestId: string;
  userId: string;
  orderId: string;
  returnItems: ReturnItem[];
  newProductId: string;
  newVariantKey: string;
  newQuantity: number;
  status: "pending" | "approved" | "shipped" | "completed" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
}
