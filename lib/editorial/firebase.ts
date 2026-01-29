import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import type { DocumentSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import type { Campaign, Banner } from "@/types/editorial";

const CAMPAIGNS_COLLECTION = "campaigns";
const BANNERS_COLLECTION = "banners";

function mapCampaign(docSnap: DocumentSnapshot): Campaign | null {
  if (!docSnap.exists()) return null;
  const d = docSnap.data()!;
  return {
    id: docSnap.id,
    slug: d.slug,
    title: d.title,
    description: d.description,
    imageUrl: d.imageUrl,
    startDate: d.startDate?.toDate?.() ?? new Date(),
    endDate: d.endDate?.toDate?.() ?? new Date(),
    blocks: d.blocks ?? [],
    active: d.active ?? true,
    createdAt: d.createdAt?.toDate?.() ?? new Date(),
    updatedAt: d.updatedAt?.toDate?.() ?? new Date(),
  };
}

export async function getCampaignsFromFirestore(activeOnly = true): Promise<Campaign[]> {
  const q = query(
    collection(db, CAMPAIGNS_COLLECTION),
    where("active", "==", true),
    orderBy("startDate", "desc")
  );
  const snap = await getDocs(q);
  const now = new Date();
  return snap.docs
    .map((d) => mapCampaign(d))
    .filter((c): c is Campaign => {
      if (!c) return false;
      if (!activeOnly) return true;
      return c.startDate <= now && c.endDate >= now;
    });
}

export async function getCampaignById(id: string): Promise<Campaign | null> {
  const ref = doc(db, CAMPAIGNS_COLLECTION, id);
  const snap = await getDoc(ref);
  return mapCampaign(snap);
}

export async function getBannersFromFirestore(position?: "top" | "mid" | "bottom"): Promise<Banner[]> {
  let q = query(
    collection(db, BANNERS_COLLECTION),
    where("active", "==", true),
    orderBy("order", "asc")
  );
  const snap = await getDocs(q);
  let list = snap.docs.map((docSnap) => {
    const d = docSnap.data();
    return {
      id: docSnap.id,
      title: d.title,
      imageUrl: d.imageUrl,
      imageAlt: d.imageAlt,
      href: d.href,
      campaignId: d.campaignId,
      position: d.position,
      order: d.order,
      active: d.active,
      startDate: d.startDate?.toDate?.(),
      endDate: d.endDate?.toDate?.(),
    };
  }) as Banner[];
  if (position) list = list.filter((b) => b.position === position);
  return list;
}
