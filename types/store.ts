export interface StoreHours {
  day: "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";
  open: string; // "09:00"
  close: string; // "21:00"
  closed?: boolean;
}

export interface StoreLocation {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
  hours: StoreHours[];
  latitude?: number;
  longitude?: number;
  services: ("pickup" | "returns" | "gift_cards")[];
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type BOPISReservationStatus = "reserved" | "ready" | "picked_up" | "expired" | "cancelled";

export interface BOPISReservation {
  id: string;
  userId: string;
  orderId?: string;
  storeId: string;
  productId: string;
  variantKey: string;
  quantity: number;
  status: BOPISReservationStatus;
  expiresAt: Date;
  readyAt?: Date;
  pickedUpAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
