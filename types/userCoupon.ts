export type UserCouponType = "percent" | "fixed" | "free_shipping";

export interface UserCoupon {
  id: string;
  userId: string;
  code: string;
  type: UserCouponType;
  value: number; // percent or fixed amount
  minOrder?: number;
  maxUses?: number;
  usedCount: number;
  shippingHabit?: "frequent" | "standard" | "express"; // optional: only for users with this habit
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserCouponAssignment {
  userId: string;
  couponId: string;
  assignedAt: Date;
  expiresAt?: Date;
}
