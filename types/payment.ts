export type PaymentMethodType = "card" | "paypal" | "apple_pay" | "gift_card" | "store_credit" | "bnpl";

export interface PaymentMethod {
  id: string;
  userId: string;
  type: PaymentMethodType;
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
  stripePaymentMethodId?: string;
  createdAt: Date;
}

export interface PayPalIntent {
  orderId: string;
  amount: number;
  currency: string;
  returnUrl: string;
  cancelUrl: string;
}

export interface BNPLOption {
  provider: string;
  name: string;
  description?: string;
  minAmount?: number;
  maxAmount?: number;
}
