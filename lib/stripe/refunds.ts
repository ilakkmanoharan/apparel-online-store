import { stripe } from "./server";

export type RefundReason =
  | "duplicate"
  | "fraudulent"
  | "requested_by_customer";

export interface CreateRefundOptions {
  paymentIntentId: string;
  amount?: number; // cents; omit for full refund
  reason?: RefundReason;
  metadata?: Record<string, string>;
}

export async function createRefund(options: CreateRefundOptions) {
  const params: Parameters<typeof stripe.refunds.create>[0] = {
    payment_intent: options.paymentIntentId,
    reason: options.reason ?? "requested_by_customer",
    metadata: options.metadata,
  };
  if (options.amount != null && options.amount > 0) {
    params.amount = options.amount;
  }
  return stripe.refunds.create(params);
}

export async function listRefunds(paymentIntentId: string) {
  return stripe.refunds.list({ payment_intent: paymentIntentId });
}

export async function getRefund(refundId: string) {
  return stripe.refunds.retrieve(refundId);
}
