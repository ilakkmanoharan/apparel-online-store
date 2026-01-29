"use client";

import type { Campaign } from "@/types/editorial";
import CampaignCard from "./CampaignCard";

interface CampaignGridProps {
  campaigns: Campaign[];
  className?: string;
}

export default function CampaignGrid({ campaigns, className = "" }: CampaignGridProps) {
  return (
    <div className={"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 " + className}>
      {campaigns.map((c) => (
        <CampaignCard key={c.id} campaign={c} />
      ))}
    </div>
  );
}
