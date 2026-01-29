import type { Product } from "./index";

export interface ProductRecommendation {
  product: Product;
  reason: "similar" | "frequently_bought_together" | "recently_viewed" | "trending";
  score?: number;
}

export interface RecommendationBlock {
  title: string;
  type: "similar" | "frequently_bought_together" | "recently_viewed";
  products: ProductRecommendation[];
}
