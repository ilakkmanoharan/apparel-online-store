import CampaignCard from "@/components/editorial/CampaignCard";
import { getCampaigns } from "@/lib/editorial/campaigns";
import { getServerTranslator } from "@/lib/i18n/server";

interface CampaignsPageProps {
  params: { locale: string };
}

export default async function CampaignsPage({ params }: CampaignsPageProps) {
  const campaigns = await getCampaigns(true);
  const { t } = await getServerTranslator(params.locale);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{t("editorial.campaigns")}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.length === 0 ? (
          <p className="text-gray-600 col-span-full">{t("editorial.noCampaigns")}</p>
        ) : (
          campaigns.map((campaign) => <CampaignCard key={campaign.id} campaign={campaign} />)
        )}
      </div>
    </div>
  );
}
