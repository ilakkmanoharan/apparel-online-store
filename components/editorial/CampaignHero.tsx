import Image from "next/image";
import type { Campaign } from "@/types/editorial";

interface CampaignHeroProps {
  campaign: Campaign;
}

export default function CampaignHero({ campaign }: CampaignHeroProps) {
  return (
    <section className="relative w-full aspect-[21/9] min-h-[200px] bg-gray-200">
      {campaign.imageUrl && (
        <Image src={campaign.imageUrl} alt={campaign.title} fill className="object-cover" sizes="100vw" priority />
      )}
      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
        <div className="text-center text-white px-4">
          <h1 className="text-3xl md:text-4xl font-bold">{campaign.title}</h1>
          {campaign.description && <p className="mt-2 text-lg max-w-xl mx-auto">{campaign.description}</p>}
        </div>
      </div>
    </section>
  );
}
