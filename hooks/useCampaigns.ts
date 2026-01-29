"use client";

import { useState, useEffect, useCallback } from "react";
import { getCampaigns, getCampaignBySlug } from "@/lib/editorial/campaigns";
import type { Campaign } from "@/types/editorial";

export function useCampaigns(activeOnly = true) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(() => {
    setLoading(true);
    getCampaigns(activeOnly)
      .then(setCampaigns)
      .finally(() => setLoading(false));
  }, [activeOnly]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { campaigns, loading, refetch };
}

export function useCampaign(slug: string | null) {
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(!!slug);

  useEffect(() => {
    if (!slug) {
      setCampaign(null);
      setLoading(false);
      return;
    }
    let cancelled = false;
    getCampaignBySlug(slug)
      .then((c) => {
        if (!cancelled) setCampaign(c ?? null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [slug]);

  return { campaign, loading };
}
