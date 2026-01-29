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
import type { Campaign } from "@/types/editorial";

const COLLECTION = "campaigns";

function mapCampaign(docSnap: { id: string; data: () => Record<string, unknown> }): Campaign {
  const d = docSnap.data();
  return {
    id: docSnap.id,
    slug: d.slug as string,
    title: d.title as string,
    description: d.description as string,
    imageUrl: d.imageUrl as string,
    startDate: (d.startDate as { toDate?: () => Date })?.toDate?.() ?? new Date(),
    endDate: (d.endDate as { toDate?: () => Date })?.toDate?.() ?? new Date(),
    blocks: (d.blocks as Campaign["blocks"]) ?? [],
    active: (d.active as boolean) ?? true,
    createdAt: (d.createdAt as { toDate?: () => Date })?.toDate?.() ?? new Date(),
    updatedAt: (d.updatedAt as { toDate?: () => Date })?.toDate?.() ?? new Date(),
  };
}

export async function listAdminCampaigns(limit = 50): Promise<Campaign[]> {
  const q = query(collection(db, COLLECTION), orderBy("startDate", "desc"));
  const snap = await getDocs(q);
  return snap.docs.slice(0, limit).map((d) => mapCampaign({ id: d.id, data: d.data() }));
}

export async function getAdminCampaign(id: string): Promise<Campaign | null> {
  const ref = doc(db, COLLECTION, id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return mapCampaign({ id: snap.id, data: snap.data() });
}

export async function createAdminCampaign(data: Omit<Campaign, "id" | "createdAt" | "updatedAt">): Promise<string> {
  const ref = await addDoc(collection(db, COLLECTION), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateAdminCampaign(id: string, data: Partial<Campaign>): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), { ...data, updatedAt: serverTimestamp() });
}
