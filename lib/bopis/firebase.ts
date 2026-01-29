import { collection, doc, getDoc, getDocs, query, where, addDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import type { BOPISReservation, BOPISReservationStatus } from "@/types/store";

const COLLECTION = "bopisReservations";

export async function createBOPISReservation(
  userId: string,
  storeId: string,
  productId: string,
  variantKey: string,
  quantity: number,
  expiresAt: Date
): Promise<string> {
  const ref = await addDoc(collection(db, COLLECTION), {
    userId,
    storeId,
    productId,
    variantKey,
    quantity,
    status: "reserved",
    expiresAt,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function getReservationById(id: string): Promise<BOPISReservation | null> {
  const ref = doc(db, COLLECTION, id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  const d = snap.data();
  return {
    id: snap.id,
    userId: d.userId,
    orderId: d.orderId,
    storeId: d.storeId,
    productId: d.productId,
    variantKey: d.variantKey,
    quantity: d.quantity,
    status: d.status as BOPISReservationStatus,
    expiresAt: d.expiresAt?.toDate?.() ?? new Date(),
    readyAt: d.readyAt?.toDate?.(),
    pickedUpAt: d.pickedUpAt?.toDate?.(),
    createdAt: d.createdAt?.toDate?.() ?? new Date(),
    updatedAt: d.updatedAt?.toDate?.() ?? new Date(),
  };
}

export async function getReservationsByUser(userId: string): Promise<BOPISReservation[]> {
  const q = query(collection(db, COLLECTION), where("userId", "==", userId));
  const snap = await getDocs(q);
  return snap.docs.map((docSnap) => {
    const d = docSnap.data();
    return {
      id: docSnap.id,
      userId: d.userId,
      orderId: d.orderId,
      storeId: d.storeId,
      productId: d.productId,
      variantKey: d.variantKey,
      quantity: d.quantity,
      status: d.status as BOPISReservationStatus,
      expiresAt: d.expiresAt?.toDate?.() ?? new Date(),
      readyAt: d.readyAt?.toDate?.(),
      pickedUpAt: d.pickedUpAt?.toDate?.(),
      createdAt: d.createdAt?.toDate?.() ?? new Date(),
      updatedAt: d.updatedAt?.toDate?.() ?? new Date(),
    };
  });
}

export async function updateReservationStatus(id: string, status: BOPISReservationStatus): Promise<void> {
  const ref = doc(db, COLLECTION, id);
  const updates: Record<string, unknown> = { status, updatedAt: serverTimestamp() };
  if (status === "ready") updates.readyAt = serverTimestamp();
  if (status === "picked_up") updates.pickedUpAt = serverTimestamp();
  await updateDoc(ref, updates);
}
