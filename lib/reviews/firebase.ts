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
  limit,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import type { ProductReview, ReviewSummary } from "@/types/review";

const REVIEWS_COLLECTION = "productReviews";

export async function getReviews(
  productId: string,
  opts: { limit?: number; orderBy?: "createdAt" | "rating" } = {}
): Promise<ProductReview[]> {
  const { limit: limitCount = 20, orderBy: orderByField = "createdAt" } = opts;
  const q = query(
    collection(db, REVIEWS_COLLECTION),
    where("productId", "==", productId),
    orderBy(orderByField, "desc"),
    limit(limitCount)
  );
  const snap = await getDocs(q);
  return snap.docs.map((docSnap) => {
    const d = docSnap.data();
    return {
      id: docSnap.id,
      productId: d.productId,
      userId: d.userId,
      userDisplayName: d.userDisplayName,
      rating: d.rating,
      title: d.title,
      body: d.body,
      verifiedPurchase: d.verifiedPurchase ?? false,
      helpfulCount: d.helpfulCount ?? 0,
      createdAt: d.createdAt?.toDate?.() ?? new Date(),
      updatedAt: d.updatedAt?.toDate?.() ?? new Date(),
    };
  }) as ProductReview[];
}

export async function addReview(
  productId: string,
  userId: string,
  data: { rating: number; title?: string; body?: string; verifiedPurchase?: boolean }
): Promise<string> {
  const ref = await addDoc(collection(db, REVIEWS_COLLECTION), {
    productId,
    userId,
    userDisplayName: null,
    rating: data.rating,
    title: data.title ?? null,
    body: data.body ?? null,
    verifiedPurchase: data.verifiedPurchase ?? false,
    helpfulCount: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function getReviewSummary(productId: string): Promise<ReviewSummary | null> {
  const reviews = await getReviews(productId, { limit: 1000 });
  if (!reviews.length) return null;
  const distribution: Record<1 | 2 | 3 | 4 | 5, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let sum = 0;
  for (const r of reviews) {
    distribution[r.rating as 1 | 2 | 3 | 4 | 5]++;
    sum += r.rating;
  }
  return {
    productId,
    averageRating: Math.round((sum / reviews.length) * 10) / 10,
    totalCount: reviews.length,
    distribution,
  };
}
