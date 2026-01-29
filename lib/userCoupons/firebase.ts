import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  addDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import type { UserCoupon } from "@/types/userCoupon";

const COLLECTION = "userCoupons";

function mapDoc(docSnap: { id: string; data: () => Record<string, unknown> }): UserCoupon {
  const d = docSnap.data();
  return {
    id: docSnap.id,
    userId: d.userId as string,
    code: d.code as string,
    type: d.type as UserCoupon["type"],
    value: d.value as number,
    minOrder: d.minOrder as number | undefined,
    maxUses: d.maxUses as number | undefined,
    usedCount: (d.usedCount as number) ?? 0,
    shippingHabit: d.shippingHabit as UserCoupon["shippingHabit"],
    expiresAt: (d.expiresAt as { toDate?: () => Date })?.toDate?.(),
    createdAt: (d.createdAt as { toDate?: () => Date })?.toDate?.() ?? new Date(),
    updatedAt: (d.updatedAt as { toDate?: () => Date })?.toDate?.() ?? new Date(),
  };
}

export async function getUserCoupons(userId: string): Promise<UserCoupon[]> {
  const q = query(
    collection(db, COLLECTION),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => mapDoc({ id: d.id, data: d.data() }));
}

export async function getUserCouponByCode(userId: string, code: string): Promise<UserCoupon | null> {
  const normalized = code.trim().toUpperCase();
  const q = query(
    collection(db, COLLECTION),
    where("userId", "==", userId),
    where("code", "==", normalized)
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return mapDoc({ id: snap.docs[0].id, data: snap.docs[0].data() });
}

export async function incrementCouponUsage(couponId: string): Promise<void> {
  const ref = doc(db, COLLECTION, couponId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;
  const used = (snap.data()?.usedCount ?? 0) as number;
  await updateDoc(ref, { usedCount: used + 1, updatedAt: serverTimestamp() });
}

export async function assignCouponToUser(
  userId: string,
  data: Omit<UserCoupon, "id" | "userId" | "usedCount" | "createdAt" | "updatedAt">
): Promise<string> {
  const ref = await addDoc(collection(db, COLLECTION), {
    userId,
    ...data,
    usedCount: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}
