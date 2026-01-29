import type { Campaign } from "@/types/editorial";

// In-memory fallback; replace with Firestore when campaigns collection exists
const MOCK_CAMPAIGNS: Campaign[] = [];

export async function getCampaigns(activeOnly = true): Promise<Campaign[]> {
  // TODO: fetch from Firestore lib/editorial/firebase
  return MOCK_CAMPAIGNS.filter((c) => !activeOnly || (c.active && new Date() >= c.startDate && new Date() <= c.endDate));
}

export async function getCampaignBySlug(slug: string): Promise<Campaign | null> {
  const list = await getCampaigns(false);
  return list.find((c) => c.slug === slug) ?? null;
}
