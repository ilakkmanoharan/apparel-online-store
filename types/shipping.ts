export type ShippingMethodType = "standard" | "express" | "overnight" | "pickup";

export interface ShippingOption {
  id: string;
  type: ShippingMethodType;
  name: string;
  description?: string;
  price: number;
  minDays: number;
  maxDays: number;
  cutoffTime?: string; // e.g. "14:00" for 2 PM cutoff
}

export interface DeliveryEstimate {
  minDate: Date;
  maxDate: Date;
  formatted: string; // e.g. "Jan 30 – Feb 2"
}

export interface ShippingAddress {
  fullName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}
