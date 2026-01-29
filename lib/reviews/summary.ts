import type admin from "firebase-admin";
import type { ReviewSummary } from "@/types/review";

export async function getReviewSummaryForProduct(
  db: admin.firestore.Firestore,
  productId: string
): Promise<ReviewSummary | null> {
  const snapshot = await db
    .collection("productReviews")
    .where("productId", "==", productId)
    .limit(1000)
    .get();

  if (snapshot.empty) return null;

  const distribution: Record<1 | 2 | 3 | 4 | 5, number> = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  };
  let sum = 0;

  snapshot.docs.forEach((docSnap) => {
    const rating = Number(docSnap.data().rating);
    if (rating >= 1 && rating <= 5) {
      distribution[rating as 1 | 2 | 3 | 4 | 5]++;
      sum += rating;
    }
  });

  const totalCount = snapshot.size;
  const averageRating = Math.round((sum / totalCount) * 10) / 10;

  return {
    productId,
    averageRating,
    totalCount,
    distribution,
  };
}
