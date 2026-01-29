"use client";

import { useState } from "react";
import type { Campaign } from "@/types/editorial";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import Checkbox from "@/components/common/Checkbox";

interface CampaignFormProps {
  campaign?: Campaign | null;
  onSubmit: (data: Partial<Campaign> & { title: string; slug: string }) => Promise<void>;
  onCancel: () => void;
}

export default function CampaignForm({ campaign, onSubmit, onCancel }: CampaignFormProps) {
  const [title, setTitle] = useState(campaign?.title ?? "");
  const [slug, setSlug] = useState(campaign?.slug ?? "");
  const [description, setDescription] = useState(campaign?.description ?? "");
  const [imageUrl, setImageUrl] = useState(campaign?.imageUrl ?? "");
  const [startDate, setStartDate] = useState(
    campaign?.startDate ? new Date(campaign.startDate).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10)
  );
  const [endDate, setEndDate] = useState(
    campaign?.endDate ? new Date(campaign.endDate).toISOString().slice(0, 10) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  );
  const [active, setActive] = useState(campaign?.active ?? true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await onSubmit({
        title,
        slug,
        description: description || undefined,
        imageUrl: imageUrl || undefined,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        active,
        blocks: campaign?.blocks ?? [],
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      <Input label="Slug" value={slug} onChange={(e) => setSlug(e.target.value)} required />
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
        />
      </div>
      <Input label="Image URL" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
      <div className="grid grid-cols-2 gap-4">
        <Input label="Start date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        <Input label="End date" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
      </div>
      <Checkbox label="Active" checked={active} onChange={(e) => setActive(e.target.checked)} />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex gap-4">
        <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Save"}</Button>
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
}
