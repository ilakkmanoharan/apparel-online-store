import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "./config";

const STORAGE_BUCKET = "apparel-online-store.firebasestorage.app";

export interface WomenFashionImage {
  id: string;
  imageUrl: string;
  storagePath: string;
  category: string;
  label?: string;
  order?: number;
}

function buildImageUrl(imageUrl: string | undefined, storagePath: string | undefined): string | null {
  if (imageUrl && imageUrl.startsWith("http")) return imageUrl;
  if (storagePath && storagePath.trim()) {
    const encoded = encodeURIComponent(storagePath.trim());
    return `https://firebasestorage.googleapis.com/v0/b/${STORAGE_BUCKET}/o/${encoded}?alt=media`;
  }
  return null;
}

export async function getWomenFashionImages(): Promise<WomenFashionImage[]> {
  const galleryRef = collection(db, "categories", "women", "gallery");
  const q = query(galleryRef, orderBy("order", "asc"));
  const snapshot = await getDocs(q);

  return snapshot.docs
    .map((doc) => {
      const data = doc.data() as any;
      const imageUrl = buildImageUrl(data.imageUrl, data.storagePath);
      if (!imageUrl) return null;
      return {
        id: doc.id,
        imageUrl,
        storagePath: data.storagePath,
        category: data.category ?? "women",
        label: data.label,
        order: data.order,
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);
}

