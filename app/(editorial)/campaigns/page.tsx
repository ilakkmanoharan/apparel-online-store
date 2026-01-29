import { getCampaigns } from "@/lib/editorial/campaigns";
import CampaignCard from "@/components/editorial/CampaignCard";

export default async function CampaignsPage() {
  const campaigns = await getCampaigns(true);
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Campaigns</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.length === 0 ? (
          <p className="text-gray-600 col-span-full">No active campaigns.</p>
        ) : (
          campaigns.map((c) => <CampaignCard key={c.id} campaign={c} />)
        )}
      </div>
    </div>
  );
}
