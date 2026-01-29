import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  updateDoc,
  serverTimestamp,
  type Firestore,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import type { ReturnRequest, ReturnStatus } from "@/types/returns";

const COLLECTION = "returns";

export async function createReturn(
  userId: string,
  orderId: string,
  items: ReturnRequest["items"]
): Promise<string> {
  const ref = await addDoc(collection(db, COLLECTION), {
    userId,
    orderId,
    items,
    status: "requested",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function getReturnById(returnId: string): Promise<ReturnRequest | null> {
  const ref = doc(db, COLLECTION, returnId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  const d = snap.data();
  return {
    id: snap.id,
    userId: d.userId,
    orderId: d.orderId,
    items: d.items,
    status: d.status as ReturnStatus,
    refundAmount: d.refundAmount,
    labelUrl: d.labelUrl,
    trackingNumber: d.trackingNumber,
    createdAt: d.createdAt?.toDate?.() ?? new Date(),
    updatedAt: d.updatedAt?.toDate?.() ?? new Date(),
  };
}

export async function getReturnsByOrder(orderId: string): Promise<ReturnRequest[]> {
  const q = query(
    collection(db, COLLECTION),
    where("orderId", "==", orderId),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((docSnap) => {
    const d = docSnap.data();
    return {
      id: docSnap.id,
      userId: d.userId,
      orderId: d.orderId,
      items: d.items,
      status: d.status as ReturnStatus,
      refundAmount: d.refundAmount,
      labelUrl: d.labelUrl,
      trackingNumber: d.trackingNumber,
      createdAt: d.createdAt?.toDate?.() ?? new Date(),
      updatedAt: d.updatedAt?.toDate?.() ?? new Date(),
    };
  });
}

export async function getReturnsByUser(userId: string): Promise<ReturnRequest[]> {
  const q = query(
    collection(db, COLLECTION),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((docSnap) => {
    const d = docSnap.data();
    return {
      id: docSnap.id,
      userId: d.userId,
      orderId: d.orderId,
      items: d.items,
      status: d.status as ReturnStatus,
      refundAmount: d.refundAmount,
      labelUrl: d.labelUrl,
      trackingNumber: d.trackingNumber,
      createdAt: d.createdAt?.toDate?.() ?? new Date(),
      updatedAt: d.updatedAt?.toDate?.() ?? new Date(),
    };
  });
}

export async function updateReturnStatus(
  returnId: string,
  status: ReturnStatus,
  updates?: Partial<Pick<ReturnRequest, "refundAmount" | "labelUrl" | "trackingNumber">>
): Promise<void> {
  const ref = doc(db, COLLECTION, returnId);
  await updateDoc(ref, {
    status,
    ...updates,
    updatedAt: serverTimestamp(),
  });
}
