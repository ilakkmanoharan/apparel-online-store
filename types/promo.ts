/**
 * Promo types for use across app.
 * Extended / re-exported from lib/promo where needed.
 */
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

export interface PromoEligibility {
  eligible: boolean;
  reason?: string;
  minOrder?: number;
  discountPercent?: number;
}
