export type LoyaltyTierId = "bronze" | "silver" | "gold" | "platinum";

export interface LoyaltyTier {
  id: LoyaltyTierId;
  name: string;
  minPoints: number;
  benefits: string[];
  multiplier: number; // e.g. 1.5 = 1.5x points per dollar
}

export interface PointsBalance {
  userId: string;
  points: number;
  tierId: LoyaltyTierId;
  lifetimePoints: number;
  updatedAt: Date;
}

export interface PointsTransaction {
  id: string;
  userId: string;
  type: "earn" | "redeem" | "expire" | "adjustment";
  points: number;
  orderId?: string;
  description?: string;
  createdAt: Date;
}

export interface Reward {
  id: string;
  name: string;
  description?: string;
  pointsCost: number;
  type: "discount" | "free_shipping" | "product" | "other";
  value?: number; // e.g. $10 off
  active: boolean;
  startDate?: Date;
  endDate?: Date;
}

/** Lifetime spend (dollars) for tier / free shipping. */
export interface UserSpend {
  userId: string;
  lifetimeSpend: number;
  updatedAt: Date;
}

/** Tier by spend threshold (dollars). Platinum = free shipping. */
export type SpendTierId = "bronze" | "silver" | "gold" | "platinum";

export interface SpendTier {
  id: SpendTierId;
  name: string;
  minSpend: number;
  freeShipping: boolean;
  benefits: string[];
}
