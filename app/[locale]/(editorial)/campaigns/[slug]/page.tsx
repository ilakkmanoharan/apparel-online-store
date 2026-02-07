import { notFound } from "next/navigation";
import LocaleLink from "@/components/common/LocaleLink";
import CampaignHero from "@/components/editorial/CampaignHero";
import { getCampaignBySlug } from "@/lib/editorial/campaigns";
import { getServerTranslator } from "@/lib/i18n/server";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export default async function CampaignSlugPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const campaign = await getCampaignBySlug(slug);

  if (!campaign) {
    notFound();
  }

  const { t } = await getServerTranslator(locale);

  return (
    <div>
      <CampaignHero campaign={campaign} />
      <div className="container mx-auto px-4 py-8">
        {campaign.description && <p className="text-lg text-gray-700 mb-8">{campaign.description}</p>}
        {campaign.blocks?.length > 0 && (
          <div className="space-y-8">
            {campaign.blocks.map((block) => (
              <section key={block.id}>
                {block.title && <h2 className="text-xl font-bold mb-2">{block.title}</h2>}
                {block.body && <p className="text-gray-600">{block.body}</p>}
                {block.ctaLabel && block.ctaHref && (
                  <LocaleLink href={block.ctaHref} className="text-blue-600 hover:underline mt-2 inline-block">{block.ctaLabel}</LocaleLink>
                )}
              </section>
            ))}
          </div>
        )}
        <LocaleLink href="/campaigns" className="mt-8 inline-block text-blue-600 hover:underline">{t("editorial.allCampaigns")}</LocaleLink>
      </div>
    </div>
  );
}
