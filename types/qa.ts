export interface QAPair {
  id: string;
  productId: string;
  question: string;
  answer?: string | null;
  askedByUserId?: string | null;
  askedByDisplayName?: string | null;
  answeredByUserId?: string | null;
  answeredAt?: Date | null;
  askedAt: Date;
  helpfulCount: number;
}

export interface QAFormData {
  question: string;
}
