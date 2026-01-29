export interface ProductReview {
  id: string;
  productId: string;
  userId: string;
  userDisplayName?: string;
  rating: number;
  title?: string;
  body?: string;
  verifiedPurchase: boolean;
  helpfulCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReviewSummary {
  productId: string;
  averageRating: number;
  totalCount: number;
  distribution: Record<1 | 2 | 3 | 4 | 5, number>;
}

export interface QAPair {
  id: string;
  productId: string;
  question: string;
  answer?: string;
  askedByUserId?: string;
  answeredByUserId?: string;
  askedAt: Date;
  answeredAt?: Date;
}
