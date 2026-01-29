import { getStoreById } from "@/lib/stores/locations";
import type { BOPISReservationStatus } from "@/types/store";

// Mock: in production would check Firestore inventory per store
export async function checkStoreAvailability(
  storeId: string,
  productId: string,
  variantKey: string,
  quantity: number
): Promise<{ available: boolean; message?: string }> {
  const store = await getStoreById(storeId);
  if (!store) return { available: false, message: "Store not found." };
  if (!store.services.includes("pickup")) return { available: false, message: "Store does not offer pickup." };
  // Placeholder: assume available
  return { available: true };
}

export async function createReservation(
  userId: string,
  storeId: string,
  productId: string,
  variantKey: string,
  quantity: number,
  expiresInHours = 24
): Promise<{ reservationId: string; expiresAt: Date }> {
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + expiresInHours);
  // TODO: persist to Firestore lib/bopis/firebase
  return { reservationId: `res-${Date.now()}`, expiresAt };
}

export async function cancelReservation(reservationId: string): Promise<void> {
  // TODO: update status in Firestore
}
