import { collection, getDocs, doc, getDoc, query, where } from "firebase/firestore";
import { db } from "./config";
import { Category } from "@/types";

const categoriesCollection = collection(db, "categories");

export async function getCategories(): Promise<Category[]> {
  const snapshot = await getDocs(categoriesCollection);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Category[];
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const q = query(categoriesCollection, where("slug", "==", slug));
  const snapshot = await getDocs(q);
  
  if (snapshot.empty) {
    return null;
  }

  return {
    id: snapshot.docs[0].id,
    ...snapshot.docs[0].data(),
  } as Category;
}
