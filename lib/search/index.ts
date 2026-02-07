import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import type { QueryConstraint } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { Product } from "@/types";
import {
  getProductNameSearchFields,
  localizeProduct,
  normalizeLocale,
} from "@/lib/firebase/products-i18n";

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
  filters: SearchFilters = {},
  localeValue?: string
): Promise<SearchResult> {
  const locale = normalizeLocale(localeValue);
  const searchFields = getProductNameSearchFields(locale);
  let lastError: unknown;

  for (let i = 0; i < searchFields.length; i += 1) {
    const searchField = searchFields[i];
    try {
      const products = await runSearchQuery(term, filters, searchField);
      if (products.length > 0 || i === searchFields.length - 1) {
        return {
          products: products.map((product) => localizeProduct(product, locale)),
        };
      }
    } catch (error) {
      lastError = error;
      if (i === searchFields.length - 1) {
        throw error;
      }
    }
  }

  if (lastError) {
    throw lastError;
  }

  return { products: [] };
}

async function runSearchQuery(
  term: string,
  filters: SearchFilters,
  searchField: string
): Promise<Product[]> {
  const trimmed = term.trim();
  const productsRef = collection(db, "products");
  const constraints: QueryConstraint[] = [];

  // Basic Firestore search: localized name prefix match + optional category filter.
  // This is intentionally simple; a production app would use a dedicated search service.
  if (trimmed) {
    constraints.push(where(searchField, ">=", trimmed), where(searchField, "<=", trimmed + "\uf8ff"));
  }

  if (filters.category) {
    constraints.push(where("category", "==", filters.category));
  }

  constraints.push(orderBy(searchField), limit(40));

  const q = query(productsRef, ...constraints);
  const snapshot = await getDocs(q);

  return snapshot.docs.map((docSnapshot) => {
    const data = docSnapshot.data() as any;
    return {
      id: docSnapshot.id,
      ...data,
      createdAt: data.createdAt?.toDate?.() ?? new Date(),
      updatedAt: data.updatedAt?.toDate?.() ?? new Date(),
    } as Product;
  });
}
