export interface GiftCard {
  id: string;
  code: string;
  balance: number;
  initialBalance: number;
  currency: string;
  userId?: string; // if redeemed
  redeemedAt?: Date;
  expiresAt?: Date;
  createdAt: Date;
}

export interface StoreCredit {
  id: string;
  userId: string;
  balance: number;
  currency: string;
  source: "return" | "refund" | "promotion" | "adjustment";
  sourceId?: string;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface GiftCardPurchase {
  amount: number;
  recipientEmail?: string;
  recipientName?: string;
  message?: string;
}
