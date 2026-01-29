import { collection, doc, getDoc, getDocs, query, where, addDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import type { GiftCard } from "@/types/giftcard";

const COLLECTION = "giftCards";

export async function getGiftCardByCode(code: string): Promise<GiftCard | null> {
  const normalized = code.trim().replace(/\s/g, "").toUpperCase();
  const q = query(collection(db, COLLECTION), where("code", "==", normalized));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0].data();
  return {
    id: snap.docs[0].id,
    code: d.code,
    balance: d.balance,
    initialBalance: d.initialBalance,
    currency: d.currency ?? "USD",
    userId: d.userId,
    redeemedAt: d.redeemedAt?.toDate?.(),
    expiresAt: d.expiresAt?.toDate?.(),
    createdAt: d.createdAt?.toDate?.() ?? new Date(),
  };
}

export async function updateGiftCardBalance(id: string, newBalance: number, userId?: string): Promise<void> {
  const ref = doc(db, COLLECTION, id);
  const updates: Record<string, unknown> = {
    balance: newBalance,
    updatedAt: serverTimestamp(),
  };
  if (userId !== undefined) {
    updates.userId = userId;
    updates.redeemedAt = serverTimestamp();
  }
  await updateDoc(ref, updates);
}

export async function createGiftCard(
  code: string,
  initialBalance: number,
  currency: string,
  expiresAt?: Date
): Promise<string> {
  const ref = await addDoc(collection(db, COLLECTION), {
    code,
    balance: initialBalance,
    initialBalance,
    currency,
    expiresAt: expiresAt ?? null,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}
