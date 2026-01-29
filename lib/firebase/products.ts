import { collection, getDocs, doc, getDoc, query, where, orderBy, limit } from "firebase/firestore";
import { db } from "./config";
import { Product } from "@/types";

const productsCollection = collection(db, "products");

export async function getProducts(): Promise<Product[]> {
  const snapshot = await getDocs(productsCollection);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() || new Date(),
    updatedAt: doc.data().updatedAt?.toDate() || new Date(),
  })) as Product[];
}

export async function getProductById(id: string): Promise<Product | null> {
  const docRef = doc(db, "products", id);
  const docSnap = await getDoc(docRef);
  
  if (!docSnap.exists()) {
    return null;
  }

  return {
    id: docSnap.id,
    ...docSnap.data(),
    createdAt: docSnap.data().createdAt?.toDate() || new Date(),
    updatedAt: docSnap.data().updatedAt?.toDate() || new Date(),
  } as Product;
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  const q = query(
    productsCollection,
    where("category", "==", category),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() || new Date(),
    updatedAt: doc.data().updatedAt?.toDate() || new Date(),
  })) as Product[];
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const q = query(
    productsCollection,
    where("featured", "==", true),
    orderBy("createdAt", "desc"),
    limit(8)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() || new Date(),
    updatedAt: doc.data().updatedAt?.toDate() || new Date(),
  })) as Product[];
}
