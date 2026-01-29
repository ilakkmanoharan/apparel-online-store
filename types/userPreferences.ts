export type ShippingHabit = "frequent" | "standard" | "express" | "none";

export interface UserPreferences {
  userId: string;
  shippingHabit: ShippingHabit;
  defaultShippingSpeed?: "standard" | "express";
  marketingEmails: boolean;
  orderUpdates: boolean;
  promos?: boolean;
  newArrivals?: boolean;
  updatedAt: Date;
}

export interface ShippingPreference {
  habit: ShippingHabit;
  label: string;
  description?: string;
}
