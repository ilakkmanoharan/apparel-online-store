import type { StoreLocation } from "./store";

export type BOPISReservationStatus = "reserved" | "ready" | "picked_up" | "expired" | "cancelled";

export interface BOPISReservation {
  id: string;
  userId: string;
  storeId: string;
  productId: string;
  variantKey: string;
  quantity: number;
  status: BOPISReservationStatus;
  expiresAt: Date;
  readyAt?: Date | null;
  pickedUpAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface BOPISAvailability {
  store: StoreLocation;
  available: boolean;
  quantity: number;
  estimatedReady?: Date | null;
}
