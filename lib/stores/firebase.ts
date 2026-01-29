import { collection, doc, getDoc, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import type { StoreLocation, StoreHours } from "@/types/store";

const COLLECTION = "stores";

function mapStore(docSnap: { id: string; data: () => Record<string, unknown> }): StoreLocation {
  const d = docSnap.data();
  return {
    id: docSnap.id,
    name: d.name as string,
    address: d.address as string,
    city: d.city as string,
    state: d.state as string,
    zipCode: d.zipCode as string,
    country: d.country as string,
    phone: d.phone as string | undefined,
    hours: (d.hours as StoreHours[]) ?? [],
    latitude: d.latitude as number | undefined,
    longitude: d.longitude as number | undefined,
    services: (d.services as StoreLocation["services"]) ?? [],
    active: (d.active as boolean) ?? true,
    createdAt: (d.createdAt as { toDate?: () => Date })?.toDate?.() ?? new Date(),
    updatedAt: (d.updatedAt as { toDate?: () => Date })?.toDate?.() ?? new Date(),
  };
}

export async function getStoresFromFirestore(activeOnly = true): Promise<StoreLocation[]> {
  let q = query(collection(db, COLLECTION), orderBy("name"));
  if (activeOnly) {
    q = query(collection(db, COLLECTION), where("active", "==", true), orderBy("name"));
  }
  const snap = await getDocs(q);
  return snap.docs.map((d) => mapStore({ id: d.id, data: d.data() }));
}

export async function getStoreByIdFromFirestore(id: string): Promise<StoreLocation | null> {
  const ref = doc(db, COLLECTION, id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return mapStore({ id: snap.id, data: snap.data() });
}
