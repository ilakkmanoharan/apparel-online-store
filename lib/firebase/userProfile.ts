import { db } from "./config";
import { doc, getDoc, setDoc } from "firebase/firestore";

export interface UserProfileData {
  displayName?: string;
  phone?: string;
  avatarUrl?: string;
  updatedAt: Date;
}

const COLLECTION = "users";

export async function getProfile(
  userId: string
): Promise<UserProfileData | null> {
  const ref = doc(db, COLLECTION, userId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  const data = snap.data() as any;
  return {
    displayName: data.displayName,
    phone: data.phone,
    avatarUrl: data.avatarUrl,
    updatedAt: data.updatedAt?.toDate?.() ?? new Date(),
  };
}

export async function updateProfile(
  userId: string,
  data: Partial<Pick<UserProfileData, "displayName" | "phone" | "avatarUrl">>
) {
  const ref = doc(db, COLLECTION, userId);
  const now = new Date();
  await setDoc(
    ref,
    {
      ...data,
      updatedAt: now,
    },
    { merge: true }
  );
  return { ...data, updatedAt: now };
}
