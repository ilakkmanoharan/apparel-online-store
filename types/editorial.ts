export type ContentBlockType = "hero" | "grid" | "carousel" | "text" | "cta" | "products";

export interface ContentBlock {
  id: string;
  type: ContentBlockType;
  title?: string;
  subtitle?: string;
  body?: string;
  imageUrl?: string;
  imageAlt?: string;
  productIds?: string[];
  ctaLabel?: string;
  ctaHref?: string;
  order: number;
}

export interface Campaign {
  id: string;
  slug: string;
  title: string;
  description?: string;
  imageUrl?: string;
  startDate: Date;
  endDate: Date;
  blocks: ContentBlock[];
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Banner {
  id: string;
  title?: string;
  imageUrl: string;
  imageAlt?: string;
  href?: string;
  campaignId?: string;
  position: "top" | "mid" | "bottom";
  order: number;
  active: boolean;
  startDate?: Date;
  endDate?: Date;
}
