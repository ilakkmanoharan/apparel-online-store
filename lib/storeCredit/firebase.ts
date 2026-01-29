import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import type { StoreCredit } from "@/types/giftcard";

const COLLECTION = "storeCredit";

export async function getStoreCreditByUserId(userId: string): Promise<StoreCredit | null> {
  const ref = doc(db, COLLECTION, userId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  const d = snap.data();
  return {
    id: snap.id,
    userId: d.userId,
    balance: d.balance ?? 0,
    currency: d.currency ?? "USD",
    source: (d.source as StoreCredit["source"]) ?? "adjustment",
    sourceId: d.sourceId,
    expiresAt: d.expiresAt?.toDate?.(),
    createdAt: d.createdAt?.toDate?.() ?? new Date(),
    updatedAt: d.updatedAt?.toDate?.() ?? new Date(),
  };
}

export async function updateStoreCreditBalance(userId: string, delta: number, source: StoreCredit["source"], sourceId?: string): Promise<void> {
  const ref = doc(db, COLLECTION, userId);
  const snap = await getDoc(ref);
  const current = (snap.data()?.balance as number) ?? 0;
  const newBalance = Math.max(0, current + delta);
  if (snap.exists()) {
    await updateDoc(ref, { balance: newBalance, updatedAt: serverTimestamp() });
  } else {
    await setDoc(ref, {
      userId,
      balance: newBalance,
      currency: "USD",
      source,
      sourceId: sourceId ?? null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }
}
