import Image from "next/image";
import LocaleLink from "@/components/common/LocaleLink";
import type { Campaign } from "@/types/editorial";

interface CampaignCardProps {
  campaign: Campaign;
}

export default function CampaignCard({ campaign }: CampaignCardProps) {
  return (
    <LocaleLink href={`/campaigns/${campaign.slug}`} className="block border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative aspect-video bg-gray-100">
        {campaign.imageUrl ? (
          <Image src={campaign.imageUrl} alt={campaign.title} fill className="object-cover" sizes="33vw" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">No image</div>
        )}
      </div>
      <div className="p-4">
        <h2 className="font-semibold text-lg">{campaign.title}</h2>
        {campaign.description && <p className="text-sm text-gray-600 mt-1 line-clamp-2">{campaign.description}</p>}
      </div>
    </LocaleLink>
  );
}
