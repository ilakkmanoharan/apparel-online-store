/**
 * Artificial Macy's-style showcase data for the women's fashion gallery.
 * Used as API fallback and to enrich Firestore gallery docs when ids/orders match.
 */

import type { WomenGalleryRichFields } from "@/lib/firebase/womenFashion";

const unsplash = (id: string, w = 800) =>
  `https://images.unsplash.com/${id}?w=${w}&q=80`;

/** Full row returned when Firestore has no gallery (fallback API response). */
export interface WomenGalleryShowcaseRow extends WomenGalleryRichFields {
  id: string;
  imageUrl: string;
  storagePath: string;
  category: string;
  label?: string;
  order?: number;
}

export const WOMEN_GALLERY_SHOWCASE: WomenGalleryShowcaseRow[] = [
  {
    id: "look-1",
    imageUrl: unsplash("photo-1515372039744-b8f02a3ae446"),
    storagePath: "",
    category: "women",
    label: "Editor's pick",
    order: 1,
    brand: "Charter Club",
    name: "Linen-Blend Open-Front Cardigan",
    description:
      "A breathable linen blend with a relaxed drape—ideal for layering over tanks, tees, and sundresses on warm days.",
    sponsored: false,
    exclusive: true,
    isNew: true,
    badge: { type: "clearance", text: "Clearance" },
    currentPrice: 44.99,
    originalPrice: 79.5,
    discountPercent: 43,
    vipApplied: true,
    rewardsText: "Earn $8 Star Money",
    rating: 4.3,
    reviewCount: 312,
    colors: [
      { name: "Soft White", hex: "#f4f1ea" },
      { name: "Navy", hex: "#1b2d4a" },
      { name: "Blush", hex: "#deb8b8" },
      { name: "Black", hex: "#1a1a1a" },
    ],
  },
  {
    id: "look-2",
    imageUrl: unsplash("photo-1539008835657-9e8e9680c956"),
    storagePath: "",
    category: "women",
    label: "Going out",
    order: 2,
    brand: "I.N.C. International Concepts",
    name: "Women's Statement Necklace Set",
    description:
      "Gold-tone crystal accents catch the light; wear solo or stacked for an evening-ready finish.",
    sponsored: true,
    exclusive: false,
    isNew: false,
    badge: {
      type: "in-demand",
      text: "In demand — 162 bought in the last 5 days",
    },
    currentPrice: 34.99,
    originalPrice: 49.5,
    discountPercent: 29,
    vipApplied: false,
    rewardsText: undefined,
    rating: 4.6,
    reviewCount: 2509,
    colors: [
      { name: "Gold", hex: "#c9a227" },
      { name: "Silver", hex: "#c0c0c0" },
    ],
  },
  {
    id: "look-3",
    imageUrl: unsplash("photo-1509631179647-0177331693ae"),
    storagePath: "",
    category: "women",
    label: "Weekend",
    order: 3,
    brand: "Tommy Hilfiger",
    name: "Women's One-Button Blazer",
    description:
      "Structured shoulders and a single-button close—sharp enough for the office, easy to dress down with denim.",
    sponsored: true,
    exclusive: false,
    isNew: true,
    badge: undefined,
    currentPrice: 111.75,
    originalPrice: 149.0,
    discountPercent: 25,
    vipApplied: true,
    rewardsText: "Earn $20 Star Money",
    rating: 4.4,
    reviewCount: 892,
    colors: [
      { name: "Black", hex: "#222" },
      { name: "Camel", hex: "#c4a574" },
      { name: "Navy Pinstripe", hex: "#2a3a52" },
      { name: "Ivory", hex: "#f5f0e6" },
      { name: "Charcoal", hex: "#4a4a4a" },
      { name: "Red", hex: "#8b2942" },
    ],
  },
  {
    id: "look-4",
    imageUrl: unsplash("photo-1483985988355-763728e1935b"),
    storagePath: "",
    category: "women",
    label: "Workwear",
    order: 4,
    brand: "Donna Karan New York",
    name: "Women's Menswear Blazer",
    description:
      "Tailored wool-blend silhouette with notch lapels; pair with trousers or a midi skirt for a polished desk-to-dinner look.",
    sponsored: false,
    exclusive: true,
    isNew: false,
    badge: { type: "clearance", text: "Clearance" },
    currentPrice: 156.75,
    originalPrice: 209.0,
    discountPercent: 25,
    vipApplied: true,
    rewardsText: undefined,
    rating: 4.8,
    reviewCount: 124,
    colors: [
      { name: "Black", hex: "#1a1a1a" },
      { name: "Heather Gray", hex: "#9a9a9a" },
    ],
  },
  {
    id: "look-5",
    imageUrl: unsplash("photo-1469334031218-e382a71b716b"),
    storagePath: "",
    category: "women",
    label: "Resort",
    order: 5,
    brand: "Style & Co",
    name: "Printed Maxi Dress",
    description:
      "Flowy floor-length cut with a smocked bodice—packs easily and works with sandals or wedges.",
    sponsored: false,
    exclusive: false,
    isNew: false,
    badge: {
      type: "in-demand",
      text: "In demand — 89 bought in the last 5 days",
    },
    currentPrice: 59.63,
    originalPrice: 79.5,
    discountPercent: 25,
    vipApplied: false,
    rewardsText: "Earn $12 Star Money",
    rating: 4.1,
    reviewCount: 567,
    colors: [
      { name: "Floral Multi", hex: "#d4a5a5" },
      { name: "Navy Ground", hex: "#2c3e50" },
      { name: "Sage", hex: "#9caa8e" },
    ],
  },
  {
    id: "look-6",
    imageUrl: unsplash("photo-1529139574466-a303027c1d8b"),
    storagePath: "",
    category: "women",
    label: "Date night",
    order: 6,
    brand: "Calvin Klein",
    name: "Satin Slip Midi Skirt",
    description:
      "Bias-cut satin skims the hips with a subtle sheen—tuck in a slim tee or match with the coordinating cami.",
    sponsored: true,
    exclusive: false,
    isNew: true,
    badge: undefined,
    currentPrice: 69.5,
    originalPrice: 89.0,
    discountPercent: 22,
    vipApplied: false,
    rewardsText: undefined,
    rating: 4.5,
    reviewCount: 203,
    colors: [
      { name: "Champagne", hex: "#e8dcc8" },
      { name: "Black", hex: "#0d0d0d" },
      { name: "Bordeaux", hex: "#722f37" },
    ],
  },
  {
    id: "look-7",
    imageUrl: unsplash("photo-1487222477894-8943e31ef7b2"),
    storagePath: "",
    category: "women",
    label: "Accessories",
    order: 7,
    brand: "Kate Spade New York",
    name: "Leather Crossbody Bag",
    description:
      "Compact crossbody with card slots inside—hands-free for markets, travel, and nights out.",
    sponsored: false,
    exclusive: true,
    isNew: false,
    badge: undefined,
    currentPrice: 128.0,
    originalPrice: 198.0,
    discountPercent: 35,
    vipApplied: true,
    rewardsText: "Earn $16 Star Money",
    rating: 4.7,
    reviewCount: 441,
    colors: [
      { name: "Black", hex: "#111" },
      { name: "Tan", hex: "#c6a574" },
      { name: "Cherry", hex: "#8b2332" },
      { name: "Dusty Blue", hex: "#7a9eb1" },
      { name: "Cream", hex: "#f3ead7" },
    ],
  },
  {
    id: "look-8",
    imageUrl: unsplash("photo-1490481651871-ab68de25d43d"),
    storagePath: "",
    category: "women",
    label: "Casual",
    order: 8,
    brand: "Levi's",
    name: "High-Rise Straight Jeans",
    description:
      "Vintage-inspired straight leg with a high rise—finished with classic five-pocket styling and a hint of stretch.",
    sponsored: false,
    exclusive: false,
    isNew: false,
    badge: { type: "clearance", text: "Clearance" },
    currentPrice: 54.99,
    originalPrice: 79.5,
    discountPercent: 31,
    vipApplied: false,
    rewardsText: undefined,
    rating: 4.2,
    reviewCount: 3201,
    colors: [
      { name: "Medium Wash", hex: "#6b7c8f" },
      { name: "Light Wash", hex: "#a8b5c4" },
      { name: "Black", hex: "#222" },
    ],
  },
];

/** Omit base/identity fields when merging onto Firestore rows (keep image URL from storage). */
const STRIP_KEYS = new Set([
  "id",
  "imageUrl",
  "storagePath",
  "category",
  "order",
]);

function stripToRichFields(row: WomenGalleryShowcaseRow): WomenGalleryRichFields {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(row)) {
    if (!STRIP_KEYS.has(k)) out[k] = v;
  }
  return out as WomenGalleryRichFields;
}

/** Merge Firestore/base gallery rows with showcase copy when id or order matches. */
export const SHOWCASE_DETAILS_BY_ID: Record<string, WomenGalleryRichFields> =
  Object.fromEntries(
    WOMEN_GALLERY_SHOWCASE.map((row) => [row.id, stripToRichFields(row)])
  );

export const SHOWCASE_DETAILS_BY_ORDER: Record<number, WomenGalleryRichFields> =
  Object.fromEntries(
    WOMEN_GALLERY_SHOWCASE.filter((r) => r.order != null).map((row) => [
      row.order as number,
      stripToRichFields(row),
    ])
  );
