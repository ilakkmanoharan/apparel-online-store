import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import type { QAPair } from "@/types/qa";

const COLLECTION = "productQA";

function mapDoc(
  id: string,
  d: Record<string, unknown> & { askedAt?: { toDate?: () => Date }; answeredAt?: { toDate?: () => Date } }
): QAPair {
  return {
    id,
    productId: d.productId as string,
    question: d.question as string,
    answer: (d.answer as string | null) ?? null,
    askedByUserId: (d.askedByUserId as string | null) ?? null,
    askedByDisplayName: (d.askedByDisplayName as string | null) ?? null,
    answeredByUserId: (d.answeredByUserId as string | null) ?? null,
    answeredAt: d.answeredAt?.toDate?.() ?? null,
    askedAt: d.askedAt?.toDate?.() ?? new Date(),
    helpfulCount: (d.helpfulCount as number) ?? 0,
  };
}

export async function getQAByProduct(
  productId: string,
  opts: { limit?: number } = {}
): Promise<QAPair[]> {
  const limitCount = opts.limit ?? 20;
  const q = query(
    collection(db, COLLECTION),
    where("productId", "==", productId),
    orderBy("askedAt", "desc"),
    limit(limitCount)
  );
  const snap = await getDocs(q);
  return snap.docs.map((docSnap) =>
    mapDoc(docSnap.id, docSnap.data() as Record<string, unknown> & { askedAt?: { toDate?: () => Date }; answeredAt?: { toDate?: () => Date } })
  );
}

export async function getQAPairById(
  productId: string,
  qaId: string
): Promise<QAPair | null> {
  const ref = doc(db, COLLECTION, qaId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  const data = snap.data();
  if (data.productId !== productId) return null;
  return mapDoc(snap.id, data as Record<string, unknown> & { askedAt?: { toDate?: () => Date }; answeredAt?: { toDate?: () => Date } });
}

export async function addQuestion(
  productId: string,
  question: string,
  userId: string | null,
  displayName: string | null
): Promise<string> {
  const ref = await addDoc(collection(db, COLLECTION), {
    productId,
    question,
    askedByUserId: userId ?? null,
    askedByDisplayName: displayName ?? null,
    answer: null,
    answeredByUserId: null,
    answeredAt: null,
    askedAt: serverTimestamp(),
    helpfulCount: 0,
  });
  return ref.id;
}
