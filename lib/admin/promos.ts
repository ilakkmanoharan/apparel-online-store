import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  orderBy,
  addDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";

const COLLECTION = "promos";

export interface AdminPromo {
  id: string;
  code: string;
  discountPercent: number;
  minOrder?: number;
  active: boolean;
  startDate?: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

function mapPromo(docSnap: { id: string; data: () => Record<string, unknown> }): AdminPromo {
  const d = docSnap.data();
  return {
    id: docSnap.id,
    code: (d.code as string) ?? "",
    discountPercent: (d.discountPercent as number) ?? 0,
    minOrder: d.minOrder as number | undefined,
    active: (d.active as boolean) ?? true,
    startDate: (d.startDate as { toDate?: () => Date })?.toDate?.(),
    endDate: (d.endDate as { toDate?: () => Date })?.toDate?.(),
    createdAt: (d.createdAt as { toDate?: () => Date })?.toDate?.() ?? new Date(),
    updatedAt: (d.updatedAt as { toDate?: () => Date })?.toDate?.() ?? new Date(),
  };
}

export async function listAdminPromos(limit = 50): Promise<AdminPromo[]> {
  const q = query(collection(db, COLLECTION), orderBy("code", "asc"));
  const snap = await getDocs(q);
  return snap.docs.slice(0, limit).map((d) => mapPromo({ id: d.id, data: d.data() }));
}

export async function getAdminPromo(id: string): Promise<AdminPromo | null> {
  const ref = doc(db, COLLECTION, id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return mapPromo({ id: snap.id, data: snap.data() });
}

export async function createAdminPromo(data: Omit<AdminPromo, "id" | "createdAt" | "updatedAt">): Promise<string> {
  const ref = await addDoc(collection(db, COLLECTION), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateAdminPromo(id: string, data: Partial<AdminPromo>): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), { ...data, updatedAt: serverTimestamp() });
}
