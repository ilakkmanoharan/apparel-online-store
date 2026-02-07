"use client";

import { use, useEffect, useState } from "react";
import LocaleLink from "@/components/common/LocaleLink";
import Spinner from "@/components/common/Spinner";
import { useTranslations } from "@/hooks/useTranslations";
import { getCampaignBySlug } from "@/lib/editorial/campaigns";
import type { Campaign } from "@/types/editorial";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function TrendSlugPage({ params }: PageProps) {
  const { slug } = use(params);
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const t = useTranslations();

  useEffect(() => {
    getCampaignBySlug(slug).then(setCampaign).finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner />
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>{t("editorial.trendNotFound")}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <LocaleLink href="/trends" className="text-blue-600 hover:underline mb-4 inline-block">{t("editorial.allTrends")}</LocaleLink>
      <h1 className="text-2xl font-bold">{campaign.title}</h1>
      {campaign.description && <p className="text-gray-600 mt-2">{campaign.description}</p>}
    </div>
  );
}
