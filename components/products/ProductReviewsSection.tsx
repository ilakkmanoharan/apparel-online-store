"use client";

import { useState } from "react";
import ReviewList from "@/components/reviews/ReviewList";
import ReviewForm from "@/components/reviews/ReviewForm";
import type { ProductReview } from "@/types/review";
import { addReview } from "@/lib/reviews/firebase";
import { useAuth } from "@/contexts/AuthContext";

interface ProductReviewsSectionProps {
  productId: string;
  reviews: ProductReview[];
  onReviewAdded?: () => void;
}

export default function ProductReviewsSection({ productId, reviews: initialReviews, onReviewAdded }: ProductReviewsSectionProps) {
  const [reviews, setReviews] = useState<ProductReview[]>(initialReviews);
  const [showForm, setShowForm] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (data: { rating: number; title?: string; body?: string }) => {
    if (!user) return;
    const id = await addReview(productId, user.uid, {
      rating: data.rating,
      title: data.title,
      body: data.body,
      verifiedPurchase: false,
    });
    setReviews((prev) => [
      ...prev,
      {
        id,
        productId,
        userId: user.uid,
        userDisplayName: user.displayName ?? undefined,
        rating: data.rating,
        title: data.title,
        body: data.body,
        verifiedPurchase: false,
        helpfulCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
    setShowForm(false);
    onReviewAdded?.();
  };

  return (
    <section className="border-t pt-8 mt-8">
      <h2 className="text-xl font-bold mb-4">Reviews</h2>
      <ReviewList reviews={reviews} />
      {user ? (
        showForm ? (
          <div className="mt-6">
            <ReviewForm productId={productId} onSubmit={handleSubmit} onCancel={() => setShowForm(false)} />
          </div>
        ) : (
          <button type="button" onClick={() => setShowForm(true)} className="mt-4 text-blue-600 hover:underline font-medium">
            Write a review
          </button>
        )
      ) : (
        <p className="mt-4 text-gray-600 text-sm">Sign in to write a review.</p>
      )}
    </section>
  );
}
