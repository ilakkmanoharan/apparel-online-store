"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getAdminCampaign, updateAdminCampaign } from "@/lib/admin/campaigns";
import type { Campaign } from "@/types/editorial";
import CampaignForm from "@/components/admin/CampaignForm";
import Button from "@/components/common/Button";

export default function AdminCampaignDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (!id) return;
    getAdminCampaign(id).then(setCampaign).finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (data: Partial<Campaign> & { title: string; slug: string }) => {
    if (!id) return;
    await updateAdminCampaign(id, data);
    setCampaign((prev) => prev ? { ...prev, ...data } : null);
    setEditing(false);
  };

  if (loading) return <div className="animate-pulse h-64 bg-gray-200 rounded-lg" />;
  if (!campaign) return <p className="text-gray-600">Campaign not found.</p>;

  if (editing) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Edit campaign</h1>
        <CampaignForm campaign={campaign} onSubmit={handleSubmit} onCancel={() => setEditing(false)} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{campaign.title}</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setEditing(true)}>Edit</Button>
          <Link href="/admin/campaigns">
            <Button variant="outline">Back to list</Button>
          </Link>
        </div>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <p className="text-sm text-gray-500">Slug: {campaign.slug}</p>
        {campaign.description && <p className="text-gray-600">{campaign.description}</p>}
        <p className="text-sm text-gray-500">
          {new Date(campaign.startDate).toLocaleDateString()} – {new Date(campaign.endDate).toLocaleDateString()}
        </p>
        <p className="text-sm">Active: {campaign.active ? "Yes" : "No"}</p>
      </div>
    </div>
  );
}
