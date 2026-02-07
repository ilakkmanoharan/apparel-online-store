import { collection, getDocs, doc, getDoc, query, where, orderBy, limit } from "firebase/firestore";
import { db } from "./config";
import { Product } from "@/types";
import { localizeProduct, normalizeLocale } from "./products-i18n";

const productsCollection = collection(db, "products");

function toProduct(id: string, data: Record<string, any>, localeValue?: string): Product {
  return localizeProduct(
    {
      id,
      ...data,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    } as Product,
    localeValue
  );
}

export async function getProducts(localeValue?: string): Promise<Product[]> {
  const locale = normalizeLocale(localeValue);
  const snapshot = await getDocs(productsCollection);
  return snapshot.docs.map((docSnapshot) => {
    const data = docSnapshot.data() as Record<string, any>;
    return toProduct(docSnapshot.id, data, locale);
  });
}

export async function getProductById(id: string, localeValue?: string): Promise<Product | null> {
  const locale = normalizeLocale(localeValue);
  const docRef = doc(db, "products", id);
  const docSnap = await getDoc(docRef);
  
  if (!docSnap.exists()) {
    return null;
  }

  const data = docSnap.data() as Record<string, any>;
  return toProduct(docSnap.id, data, locale);
}

export async function getProductsByCategory(category: string, localeValue?: string): Promise<Product[]> {
  const locale = normalizeLocale(localeValue);
  const q = query(
    productsCollection,
    where("category", "==", category),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnapshot) => {
    const data = docSnapshot.data() as Record<string, any>;
    return toProduct(docSnapshot.id, data, locale);
  });
}

export async function getFeaturedProducts(localeValue?: string): Promise<Product[]> {
  const locale = normalizeLocale(localeValue);
  const q = query(
    productsCollection,
    where("featured", "==", true),
    orderBy("createdAt", "desc"),
    limit(8)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnapshot) => {
    const data = docSnapshot.data() as Record<string, any>;
    return toProduct(docSnapshot.id, data, locale);
  });
}
