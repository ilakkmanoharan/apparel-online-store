"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import CampaignList from "@/components/admin/CampaignList";
import { listAdminCampaigns } from "@/lib/admin/campaigns";
import type { Campaign } from "@/types/editorial";
import Button from "@/components/common/Button";

export default function AdminCampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listAdminCampaigns(100).then(setCampaigns).finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Campaigns</h1>
        <Link href="/admin/campaigns/new">
          <Button>New campaign</Button>
        </Link>
      </div>
      <CampaignList campaigns={campaigns} loading={loading} />
    </div>
  );
}
