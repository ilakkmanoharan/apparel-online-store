import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "./config";
import { Category } from "@/types";
import { normalizeLocale, resolveLocalizedField } from "./products-i18n";

const categoriesCollection = collection(db, "categories");

function toCategory(id: string, data: Record<string, any>, localeValue?: string): Category {
  const locale = normalizeLocale(localeValue);
  const localizedName = resolveLocalizedField(data, "name", locale);
  const localizedDescription = resolveLocalizedField(data, "description", locale);

  return {
    id,
    ...data,
    name: localizedName ?? data.name ?? "",
    description: localizedDescription ?? data.description,
  } as Category;
}

export async function getCategories(localeValue?: string): Promise<Category[]> {
  const snapshot = await getDocs(categoriesCollection);
  return snapshot.docs.map((docSnapshot) =>
    toCategory(docSnapshot.id, docSnapshot.data() as Record<string, any>, localeValue)
  );
}

export async function getCategoryBySlug(slug: string, localeValue?: string): Promise<Category | null> {
  const q = query(categoriesCollection, where("slug", "==", slug));
  const snapshot = await getDocs(q);
  
  if (snapshot.empty) {
    return null;
  }

  const categoryDoc = snapshot.docs[0];
  return toCategory(categoryDoc.id, categoryDoc.data() as Record<string, any>, localeValue);
}
