import { createBOPISReservation, getReservationById, updateReservationStatus } from "@/lib/bopis/firebase";
import { checkStoreAvailability } from "@/lib/bopis/availability";
import type { BOPISReservationStatus } from "@/types/store";

const DEFAULT_EXPIRES_HOURS = 24;

export async function reservePickup(
  userId: string,
  storeId: string,
  productId: string,
  variantKey: string,
  quantity: number,
  expiresInHours = DEFAULT_EXPIRES_HOURS
): Promise<{ reservationId: string; expiresAt: Date }> {
  const check = await checkStoreAvailability(storeId, productId, variantKey, quantity);
  if (!check.available) throw new Error(check.message ?? "Item not available at this store.");
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + expiresInHours);
  const reservationId = await createBOPISReservation(
    userId,
    storeId,
    productId,
    variantKey,
    quantity,
    expiresAt
  );
  return { reservationId, expiresAt };
}

export async function cancelReservation(reservationId: string): Promise<void> {
  const reservation = await getReservationById(reservationId);
  if (!reservation) throw new Error("Reservation not found.");
  if (reservation.status === "picked_up") throw new Error("Cannot cancel; already picked up.");
  await updateReservationStatus(reservationId, "cancelled" as BOPISReservationStatus);
}
