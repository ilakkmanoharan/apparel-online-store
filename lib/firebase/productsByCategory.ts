import type admin from "firebase-admin";
import type { Product } from "@/types";
import type { SortOption } from "@/lib/config/filters";
import { PLP_DEFAULT_PAGE_SIZE } from "@/lib/config/plp";
import { getSortOptionConfig } from "@/lib/config/sortOptions";

function toProduct(doc: admin.firestore.DocumentSnapshot): Product {
  const data = doc.data()!;
  return {
    id: doc.id,
    name: data.name ?? "",
    description: data.description ?? "",
    price: Number(data.price) ?? 0,
    originalPrice: data.originalPrice != null ? Number(data.originalPrice) : undefined,
    images: Array.isArray(data.images) ? data.images : [],
    category: data.category ?? "",
    subcategory: data.subcategory,
    sizes: Array.isArray(data.sizes) ? data.sizes : [],
    colors: Array.isArray(data.colors) ? data.colors : [],
    inStock: Boolean(data.inStock),
    stockCount: Number(data.stockCount) ?? 0,
    rating: data.rating != null ? Number(data.rating) : undefined,
    reviewCount: data.reviewCount != null ? Number(data.reviewCount) : undefined,
    featured: data.featured,
    createdAt: data.createdAt?.toDate?.() ?? new Date(),
    updatedAt: data.updatedAt?.toDate?.() ?? new Date(),
  } as Product;
}

export interface ProductsByCategoryResult {
  products: Product[];
  total: number;
  hasMore: boolean;
}

export async function getProductsByCategoryPaginated(
  db: admin.firestore.Firestore,
  slug: string,
  options: {
    page?: number;
    pageSize?: number;
    sort?: SortOption;
  } = {}
): Promise<ProductsByCategoryResult> {
  const page = Math.max(1, options.page ?? 1);
  const pageSize = options.pageSize ?? PLP_DEFAULT_PAGE_SIZE;
  const sort = options.sort ?? "newest";
  const config = getSortOptionConfig(sort);
  const field = config?.field ?? "createdAt";
  const direction = config?.direction === "asc" ? "asc" : "desc";

  const coll = db.collection("products");
  let query = coll.where("category", "==", slug) as admin.firestore.Query;

  query = query.orderBy(field, direction);

  const offset = (page - 1) * pageSize;
  const snapshot = await query.offset(offset).limit(pageSize + 1).get();
  const docs = snapshot.docs.slice(0, pageSize);
  const products = docs.map((d) => toProduct(d));
  const hasMore = snapshot.docs.length > pageSize;
  const total = offset + products.length;

  return { products, total, hasMore };
}
