"use client";

import { useRouter } from "next/navigation";
import CampaignForm from "@/components/admin/CampaignForm";
import { createAdminCampaign } from "@/lib/admin/campaigns";
import type { Campaign } from "@/types/editorial";

export default function AdminNewCampaignPage() {
  const router = useRouter();

  const handleSubmit = async (data: Partial<Campaign> & { title: string; slug: string }) => {
    const id = await createAdminCampaign({
      title: data.title,
      slug: data.slug,
      description: data.description ?? "",
      imageUrl: data.imageUrl ?? "",
      startDate: data.startDate ?? new Date(),
      endDate: data.endDate ?? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      blocks: data.blocks ?? [],
      active: data.active ?? true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    router.push(`/admin/campaigns/${id}`);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">New campaign</h1>
      <CampaignForm campaign={null} onSubmit={handleSubmit} onCancel={() => router.push("/admin/campaigns")} />
    </div>
  );
}
