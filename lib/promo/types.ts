export interface PromoCode {
  code: string;
  discountPercent?: number;
  discountFixed?: number;
  minOrder?: number;
  validFrom?: Date;
  validUntil?: Date;
}

export interface PromoValidationResult {
  valid: boolean;
  message?: string;
  discountPercent?: number;
  discountFixed?: number;
}
