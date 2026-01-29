import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "./config";

export interface WomenFashionImage {
  id: string;
  imageUrl: string;
  storagePath: string;
  category: string;
  label?: string;
  order?: number;
}

export async function getWomenFashionImages(): Promise<WomenFashionImage[]> {
  const galleryRef = collection(db, "categories", "women", "gallery");
  const q = query(galleryRef, orderBy("order", "asc"));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => {
    const data = doc.data() as any;
    return {
      id: doc.id,
      imageUrl: data.imageUrl,
      storagePath: data.storagePath,
      category: data.category ?? "women",
      label: data.label,
      order: data.order,
    };
  });
}

