import { collection, doc, getDoc, getDocs, query, orderBy, addDoc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import type { Product } from "@/types";

const COLLECTION = "products";

export async function listAdminProducts(opts: { limit?: number; categoryId?: string } = {}): Promise<Product[]> {
  const { limit: limitCount = 50 } = opts;
  const q = query(collection(db, COLLECTION), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  let list = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Product));
  if (opts.categoryId) list = list.filter((p) => p.category === opts.categoryId);
  return list.slice(0, limitCount);
}

export async function getAdminProduct(id: string): Promise<Product | null> {
  const ref = doc(db, COLLECTION, id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Product;
}

export async function createAdminProduct(data: Omit<Product, "id" | "createdAt" | "updatedAt">): Promise<string> {
  const ref = await addDoc(collection(db, COLLECTION), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateAdminProduct(id: string, data: Partial<Product>): Promise<void> {
  const ref = doc(db, COLLECTION, id);
  await updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
}

export async function deleteAdminProduct(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id));
}
