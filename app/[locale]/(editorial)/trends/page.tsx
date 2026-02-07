"use client";

import Spinner from "@/components/common/Spinner";
import TrendCard from "@/components/editorial/TrendCard";
import { useTranslations } from "@/hooks/useTranslations";
import { useCampaigns } from "@/hooks/useCampaigns";

export default function TrendsPage() {
  const { campaigns, loading } = useCampaigns();
  const t = useTranslations();

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">{t("editorial.trends")}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.map((campaign) => (
          <TrendCard key={campaign.id} slug={campaign.slug} title={campaign.title} description={campaign.description} imageUrl={campaign.imageUrl} />
        ))}
      </div>
    </div>
  );
}
