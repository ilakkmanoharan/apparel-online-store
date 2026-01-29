"use client";

import Link from "next/link";
import type { Campaign } from "@/types/editorial";

interface CampaignListProps {
  campaigns: Campaign[];
  loading?: boolean;
}

function formatDate(d: Date | unknown): string {
  if (!d) return "—";
  const date = d instanceof Date ? d : new Date(String(d));
  return date.toLocaleDateString();
}

export default function CampaignList({ campaigns, loading }: CampaignListProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="animate-pulse divide-y divide-gray-200">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-14 px-4 flex items-center gap-4">
              <div className="h-8 flex-1 bg-gray-200 rounded" />
              <div className="h-4 w-20 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Slug</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Dates</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Active</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {campaigns.map((c) => (
            <tr key={c.id} className="hover:bg-gray-50">
              <td className="px-4 py-2">
                <Link href={`/admin/campaigns/${c.id}`} className="font-medium text-gray-900 hover:underline">
                  {c.title}
                </Link>
              </td>
              <td className="px-4 py-2 text-sm text-gray-600">{c.slug}</td>
              <td className="px-4 py-2 text-sm text-gray-500">
                {formatDate(c.startDate)} – {formatDate(c.endDate)}
              </td>
              <td className="px-4 py-2">
                <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${c.active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                  {c.active ? "Yes" : "No"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {campaigns.length === 0 && (
        <p className="px-4 py-8 text-center text-gray-500">No campaigns yet.</p>
      )}
    </div>
  );
}
