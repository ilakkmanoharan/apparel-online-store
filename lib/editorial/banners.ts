import { getBannersFromFirestore } from "./firebase";
import type { Banner } from "@/types/editorial";

export async function getBanners(pos?: "top" | "mid" | "bottom"): Promise<Banner[]> {
  return getBannersFromFirestore(pos);
}
