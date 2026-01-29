import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { Product } from "@/types";

export interface SearchFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface SearchResult {
  products: Product[];
}

export async function searchProducts(
  term: string,
  filters: SearchFilters = {}
): Promise<SearchResult> {
  const trimmed = term.trim();
  const productsRef = collection(db, "products");

  // Basic Firestore search: name prefix match + optional category filter.
  // This is intentionally simple; a production app would use a dedicated search service.
  const constraints: any[] = [];

  if (trimmed) {
    constraints.push(
      where("name", ">=", trimmed),
      where("name", "<=", trimmed + "\uf8ff")
    );
  }

  if (filters.category) {
    constraints.push(where("category", "==", filters.category));
  }

  constraints.push(orderBy("name"), limit(40));

  const q = query(productsRef, ...constraints);
  const snapshot = await getDocs(q);

  const products: Product[] = snapshot.docs.map((doc) => {
    const data = doc.data() as any;
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate?.() ?? new Date(),
      updatedAt: data.updatedAt?.toDate?.() ?? new Date(),
    } as Product;
  });

  return { products };
}

