import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import type { UserPreferences } from "@/types/userPreferences";

const COLLECTION = "userPreferences";

export async function getUserPreferences(userId: string): Promise<UserPreferences | null> {
  const ref = doc(db, COLLECTION, userId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  const d = snap.data();
  return {
    userId: snap.id,
    shippingHabit: (d.shippingHabit as UserPreferences["shippingHabit"]) ?? "none",
    defaultShippingSpeed: d.defaultShippingSpeed as UserPreferences["defaultShippingSpeed"],
    marketingEmails: (d.marketingEmails as boolean) ?? false,
    orderUpdates: (d.orderUpdates as boolean) ?? true,
    promos: (d.promos as boolean) ?? false,
    newArrivals: (d.newArrivals as boolean) ?? true,
    updatedAt: d.updatedAt?.toDate?.() ?? new Date(),
  };
}

export async function setShippingPreference(userId: string, shippingHabit: UserPreferences["shippingHabit"]): Promise<void> {
  const ref = doc(db, COLLECTION, userId);
  await setDoc(ref, { shippingHabit, updatedAt: serverTimestamp() }, { merge: true });
}

export async function updateUserPreferences(userId: string, data: Partial<UserPreferences>): Promise<void> {
  const ref = doc(db, COLLECTION, userId);
  await updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
}
