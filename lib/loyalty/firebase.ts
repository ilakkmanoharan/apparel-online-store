import { collection, doc, getDoc, getDocs, query, where, addDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { getTierForPoints } from "./tiers";
import type { PointsBalance, PointsTransaction } from "@/types/loyalty";

const BALANCE_COLLECTION = "loyaltyBalances";
const TRANSACTIONS_COLLECTION = "loyaltyTransactions";

export async function getPointsBalanceFromFirestore(userId: string): Promise<PointsBalance | null> {
  const q = query(collection(db, BALANCE_COLLECTION), where("userId", "==", userId));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0].data();
  const lifetimePoints = d.lifetimePoints ?? 0;
  const tier = getTierForPoints(lifetimePoints);
  return {
    userId: d.userId,
    points: d.points ?? 0,
    tierId: tier.id,
    lifetimePoints,
    updatedAt: d.updatedAt?.toDate?.() ?? new Date(),
  };
}

export async function addPointsTransaction(
  userId: string,
  type: PointsTransaction["type"],
  points: number,
  orderId?: string,
  description?: string
): Promise<string> {
  const ref = await addDoc(collection(db, TRANSACTIONS_COLLECTION), {
    userId,
    type,
    points,
    orderId: orderId ?? null,
    description: description ?? null,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateBalanceAfterEarn(userId: string, points: number): Promise<void> {
  const q = query(collection(db, BALANCE_COLLECTION), where("userId", "==", userId));
  const snap = await getDocs(q);
  if (!snap.empty) {
    const docId = snap.docs[0].id;
    const d = snap.docs[0].data();
    const currentPoints = d.points ?? 0;
    const currentLifetime = d.lifetimePoints ?? 0;
    await updateDoc(doc(db, BALANCE_COLLECTION, docId), {
      points: currentPoints + points,
      lifetimePoints: currentLifetime + points,
      updatedAt: serverTimestamp(),
    });
  } else {
    await addDoc(collection(db, BALANCE_COLLECTION), {
      userId,
      points,
      lifetimePoints: points,
      updatedAt: serverTimestamp(),
    });
  }
}
