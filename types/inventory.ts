export interface SizeAvailability {
  size: string;
  inStock: boolean;
  quantity: number;
}

export interface ProductAvailability {
  productId: string;
  inStock: boolean;
  totalQuantity: number;
  bySize: SizeAvailability[];
}

export type LowStockThreshold = number;

export const DEFAULT_LOW_STOCK_THRESHOLD: LowStockThreshold = 5;
