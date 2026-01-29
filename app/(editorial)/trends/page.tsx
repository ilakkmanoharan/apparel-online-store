"use client";

import { useCampaigns } from "@/hooks/useCampaigns";
import TrendCard from "@/components/editorial/TrendCard";
import Spinner from "@/components/common/Spinner";

export default function TrendsPage() {
  const { campaigns, loading } = useCampaigns();

  if (loading) return <div className="flex justify-center py-8"><Spinner /></div>;
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Trends</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.map((c) => (
          <TrendCard key={c.id} slug={c.slug} title={c.title} description={c.description} imageUrl={c.imageUrl} />
        ))}
      </div>
    </div>
  );
}
