import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import type { UserSpend } from "@/types/loyalty";

const COLLECTION = "userSpend";

export async function getUserSpend(userId: string): Promise<UserSpend | null> {
  const ref = doc(db, COLLECTION, userId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  const d = snap.data();
  return {
    userId: snap.id,
    lifetimeSpend: d.lifetimeSpend ?? 0,
    updatedAt: d.updatedAt?.toDate?.() ?? new Date(),
  };
}

export async function incrementUserSpend(userId: string, orderTotal: number): Promise<void> {
  const ref = doc(db, COLLECTION, userId);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      lifetimeSpend: orderTotal,
      updatedAt: serverTimestamp(),
    });
    return;
  }
  const current = (snap.data()?.lifetimeSpend ?? 0) as number;
  await updateDoc(ref, {
    lifetimeSpend: current + orderTotal,
    updatedAt: serverTimestamp(),
  });
}

export async function setUserSpend(userId: string, lifetimeSpend: number): Promise<void> {
  const ref = doc(db, COLLECTION, userId);
  await setDoc(ref, { lifetimeSpend, updatedAt: serverTimestamp() }, { merge: true });
}
