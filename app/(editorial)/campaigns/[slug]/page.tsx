import { notFound } from "next/navigation";
import { getCampaignBySlug } from "@/lib/editorial/campaigns";
import CampaignHero from "@/components/editorial/CampaignHero";
import Link from "next/link";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function CampaignSlugPage({ params }: PageProps) {
  const { slug } = await params;
  const campaign = await getCampaignBySlug(slug);
  if (!campaign) notFound();
  return (
    <div>
      <CampaignHero campaign={campaign} />
      <div className="container mx-auto px-4 py-8">
        {campaign.description && <p className="text-lg text-gray-700 mb-8">{campaign.description}</p>}
        {campaign.blocks?.length > 0 && (
          <div className="space-y-8">
            {campaign.blocks.map((b) => (
              <section key={b.id}>
                {b.title && <h2 className="text-xl font-bold mb-2">{b.title}</h2>}
                {b.body && <p className="text-gray-600">{b.body}</p>}
                {b.ctaLabel && b.ctaHref && (
                  <Link href={b.ctaHref} className="text-blue-600 hover:underline mt-2 inline-block">{b.ctaLabel}</Link>
                )}
              </section>
            ))}
          </div>
        )}
        <Link href="/campaigns" className="mt-8 inline-block text-blue-600 hover:underline">All campaigns</Link>
      </div>
    </div>
  );
}
