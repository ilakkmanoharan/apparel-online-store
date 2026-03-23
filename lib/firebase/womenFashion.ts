import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "./config";

export type WomenGalleryBadge =
  | { type: "clearance"; text?: string }
  | { type: "in-demand"; text: string }
  | { type: "new"; text?: string };

export interface WomenGalleryColorSwatch {
  name: string;
  hex: string;
}

/** Optional Macy's-style PLP fields (merged from showcase data when available). */
export interface WomenGalleryRichFields {
  /** Small eyebrow (e.g. "Editor's pick") merged from showcase when ids/orders match. */
  label?: string;
  brand?: string;
  name?: string;
  /** Short product copy shown under the title (required for rich cards). */
  description?: string;
  sponsored?: boolean;
  exclusive?: boolean;
  isNew?: boolean;
  badge?: WomenGalleryBadge | null;
  currentPrice?: number;
  originalPrice?: number;
  discountPercent?: number;
  vipApplied?: boolean;
  rewardsText?: string;
  rating?: number;
  reviewCount?: number;
  colors?: WomenGalleryColorSwatch[];
  /** If set, card can link to PDP */
  productId?: string;
}

export interface WomenFashionImage extends WomenGalleryRichFields {
  id: string;
  imageUrl: string;
  storagePath: string;
  category: string;
  order?: number;
}

export async function getWomenFashionImages(): Promise<WomenFashionImage[]> {
  const galleryRef = collection(db, "categories", "women", "gallery");
  const q = query(galleryRef, orderBy("order", "asc"));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => {
    const data = doc.data() as Record<string, unknown>;
    return {
      id: doc.id,
      imageUrl: String(data.imageUrl ?? ""),
      storagePath: String(data.storagePath ?? ""),
      category: String(data.category ?? "women"),
      label: data.label != null ? String(data.label) : undefined,
      order: typeof data.order === "number" ? data.order : undefined,
    };
  });
}
